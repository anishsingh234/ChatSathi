import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ConversationDetail from "@/components/admin/ConversationDetail";

export const dynamic = "force-dynamic";

export default async function ConversationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSession();
  if (!user) redirect("/");

  const { id } = await params;

  const conversation = await prisma.conversation.findFirst({
    where: { id, userId: user.id },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!conversation) redirect("/dashboard/conversations");

  const formatted = {
    id: conversation.id,
    visitorId: conversation.visitorId,
    createdAt: conversation.createdAt.toISOString(),
    messages: conversation.messages.map((m) => ({
      id: m.id,
      content: m.content,
      role: m.role,
      createdAt: m.createdAt.toISOString(),
    })),
  };

  return <ConversationDetail conversation={formatted} />;
}
