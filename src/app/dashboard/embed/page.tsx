import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import EmbedClient from "@/components/EmbedClient";

export const dynamic = "force-dynamic";

export default async function DashboardEmbedPage() {
  const user = await getSession();
  if (!user) redirect("/");

  return <EmbedClient ownerId={user.id} />;
}
