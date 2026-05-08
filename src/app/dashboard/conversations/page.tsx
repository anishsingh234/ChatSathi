import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ConversationsClient from "@/components/admin/ConversationsClient";

export const dynamic = "force-dynamic";

export default async function ConversationsPage() {
  const user = await getSession();
  if (!user) redirect("/");

  const conversations = await prisma.conversation.findMany({
    where: { userId: user.id },
    include: {
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
      _count: { select: { messages: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  const formatted = conversations.map((c) => ({
    id: c.id,
    visitorId: c.visitorId,
    messageCount: c._count.messages,
    lastMessage: c.messages[0]?.content || "No messages",
    lastMessageAt: c.updatedAt.toISOString(),
  }));

  return <ConversationsClient conversations={formatted} />;
}
