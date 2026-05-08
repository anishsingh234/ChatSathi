import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";

const THIRTY_MINUTES = 30 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const { message, ownerId, visitorId } = await req.json();

    if (!message || !ownerId) {
      return corsResponse(
        { message: "message and owner id is required" },
        400,
      );
    }

    // Fetch settings + user's API key
    const setting = await prisma.settings.findUnique({
      where: { userId: ownerId },
      include: { user: { select: { geminiApiKey: true } } },
    });

    if (!setting) {
      return corsResponse({ message: "chat bot is not configured yet." }, 400);
    }

    // ─── Find or create conversation + fetch history ───
    let conversation = null;
    let historyText = "";

    if (visitorId) {
      const cutoff = new Date(Date.now() - THIRTY_MINUTES);
      conversation = await prisma.conversation.findFirst({
        where: {
          userId: ownerId,
          visitorId,
          updatedAt: { gte: cutoff },
        },
        orderBy: { updatedAt: "desc" },
      });

      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: { userId: ownerId, visitorId },
        });
      }

      // Fetch last 6 messages for RAG-like context
      const recentMessages = await prisma.message.findMany({
        where: { conversationId: conversation.id },
        orderBy: { createdAt: "asc" },
        take: 6,
        select: { role: true, content: true },
      });

      if (recentMessages.length > 0) {
        historyText = recentMessages
          .map((m: { role: string; content: string }) => `${m.role === "user" ? "Customer" : "Assistant"}: ${m.content}`)
          .join("\n");
      }
    }

    // ─── RAG: Knowledge Doc Retrieval ───
    const allDocs = await prisma.knowledgeDoc.findMany({
      where: { userId: ownerId },
      select: { title: true, content: true, tags: true },
    });

    // Simple keyword extraction from the message for filtering
    const keywords = message.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);
    
    // Find relevant docs (if any keyword matches title, content, or tags)
    const relevantDocs = allDocs.filter((doc: { title: string; content: string; tags: string[] }) => {
      const textToSearch = `${doc.title} ${doc.content} ${doc.tags.join(" ")}`.toLowerCase();
      return keywords.some((kw: string) => textToSearch.includes(kw));
    });

    // If no specific match, use top 3 newest as fallback, or just what we matched
    const docsToInject = relevantDocs.length > 0 ? relevantDocs : allDocs.slice(0, 3);
    
    const docsText = docsToInject.map((d: { title: string; content: string }) => `--- ${d.title} ---\n${d.content}`).join("\n\n");

    // Build prompt
    const KNOWLEDGE = `
    business name=${setting.businessName || "not provided"}
    support email=${setting.supportEmail || "not provided"}
    base knowledge=${setting.knowledge || "not provided"}
    `;

    const historySection = historyText
      ? `
----------------------------
CONVERSATION HISTORY
----------------------------
${historyText}
`
      : "";

    const docsSection = docsText
      ? `
----------------------------
RELEVANT KNOWLEDGE DOCUMENTS
----------------------------
${docsText}
`
      : "";

    const prompt = `
ROLE
You are a professional customer support assistant for this business.

GOAL
Help the customer using ONLY the information provided in the BUSINESS INFORMATION and RELEVANT KNOWLEDGE DOCUMENTS sections.

RULES
- Only use the provided business information.
- Do NOT invent policies, pricing, services, or promises.
- If the answer is partially available, respond using only the relevant parts.
- If the question cannot be answered from the information, respond exactly with:
"Please contact support."
- Use the conversation history to understand context of follow-up questions.

STYLE
- Be polite and professional.
- Keep answers clear and concise.
- Do not mention that the information came from "business information".

----------------------------
BUSINESS INFORMATION
----------------------------
${KNOWLEDGE}
${docsSection}
${historySection}
----------------------------
CUSTOMER QUESTION
----------------------------
${message}

----------------------------
RESPONSE
----------------------------
`;

    // Use per-user API key if available
    const apiKey = setting.user?.geminiApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return corsResponse({ message: "No Gemini API key configured." }, 400);
    }

    const ai = new GoogleGenAI({ apiKey });
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const aiResponse = res.text || "Sorry, I couldn't generate a response.";

    // Save messages to conversation
    if (conversation) {
      try {
        await prisma.message.createMany({
          data: [
            { conversationId: conversation.id, content: message, role: "user" },
            { conversationId: conversation.id, content: aiResponse, role: "assistant" },
          ],
        });

        await prisma.conversation.update({
          where: { id: conversation.id },
          data: { updatedAt: new Date() },
        });
      } catch (saveErr) {
        console.error("Error saving conversation:", saveErr);
      }
    }

    // Return the response AND the conversationId so the widget can start polling
    return corsResponse({ text: aiResponse, conversationId: conversation?.id }, 200);
  } catch (error) {
    return corsResponse({ message: `chat error ${error}` }, 500);
  }
}

export const OPTIONS = async () => {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};

function corsResponse(body: any, status: number) {
  const response = NextResponse.json(body, { status });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST,OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}
