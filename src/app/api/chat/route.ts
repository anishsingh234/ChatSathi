import { NextRequest, NextResponse } from "next/server";
import Settings from "@/model/settings.model";

import { GoogleGenAI } from "@google/genai";
import connectDb from "@/lib/db";
export async function POST(req: NextRequest) {
  try {
    const { message, ownerId } = await req.json();

    if (!message || !ownerId) {
      return NextResponse.json(
        { message: "message and owner id is required" },
        { status: 400 },
      );
    }
    await connectDb();
    const setting = await Settings.findOne({ ownerId });

    if (!setting) {
      return NextResponse.json(
        { message: "chat bot is not configured yet." },
        { status: 400 },
      );
    }
    const KNOWLEDGE = `
    business name=${setting.businessName || "not provided"}
    support email=${setting.supportEmail || "not provided"}
    knowledge=${setting.knowledge || "not provided"}
    `;

    const prompt = `
ROLE
You are a professional customer support assistant for this business.

GOAL
Help the customer using ONLY the information provided in the BUSINESS INFORMATION section.

RULES
- Only use the provided business information.
- Do NOT invent policies, pricing, services, or promises.
- If the answer is partially available, respond using only the relevant parts.
- If the question cannot be answered from the information, respond exactly with:
"Please contact support."

STYLE
- Be polite and professional.
- Keep answers clear and concise.
- Do not mention that the information came from "business information".

----------------------------
BUSINESS INFORMATION
----------------------------
${KNOWLEDGE}

----------------------------
CUSTOMER QUESTION
----------------------------
${message}

----------------------------
RESPONSE
----------------------------
`;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const response= NextResponse.json(res.text);
    response.headers.set("Access-Control-Allow-Origin", "*");
response.headers.set("Access-Control-Allow-Methods", "POST,OPTIONS");
response.headers.set("Access-Control-Allow-Headers", "Content-Type");

return response;
  } catch (error) {
    const response= NextResponse.json(
      { message: `chat error ${error}` },
      { status: 500 },
    );
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST,OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return response;
  }
}

export const OPTIONS = async () => {
  return NextResponse.json(null, {
    status: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    }
  })
}
