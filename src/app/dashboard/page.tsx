import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import StatsOverview from "@/components/admin/StatsOverview";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getSession();
  if (!user) redirect("/");

  // Fetch stats
  const [settings, conversationCount, messageCount] = await Promise.all([
    prisma.settings.findUnique({ where: { userId: user.id } }),
    prisma.conversation.count({ where: { userId: user.id } }),
    prisma.message.count({
      where: { conversation: { userId: user.id } },
    }),
  ]);

  // Fetch last-7-day conversation counts for the chart
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const recentConversations = await prisma.conversation.findMany({
    where: {
      userId: user.id,
      createdAt: { gte: sevenDaysAgo },
    },
    select: { createdAt: true },
  });

  // Build daily counts
  const dailyCounts: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const count = recentConversations.filter((c) => {
      const cDate = new Date(c.createdAt).toISOString().split("T")[0];
      return cDate === dateStr;
    }).length;
    dailyCounts.push({ date: dateStr, count });
  }

  // Fetch recent activity (last 5 conversations)
  const recentActivity = await prisma.conversation.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    take: 5,
    include: {
      _count: { select: { messages: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { content: true, createdAt: true },
      },
    },
  });

  const activityItems = recentActivity.map((c) => ({
    id: c.id,
    visitorId: c.visitorId,
    messageCount: c._count.messages,
    lastMessage: c.messages[0]?.content || "",
    lastMessageAt: (c.messages[0]?.createdAt || c.updatedAt).toISOString(),
  }));

  return (
    <StatsOverview
      hasSettings={!!settings?.businessName}
      hasApiKey={!!user.geminiApiKey}
      conversationCount={conversationCount}
      messageCount={messageCount}
      dailyCounts={dailyCounts}
      recentActivity={activityItems}
    />
  );
}