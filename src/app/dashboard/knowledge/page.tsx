import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import KnowledgeManager from "@/components/admin/KnowledgeManager";

export const dynamic = "force-dynamic";

export default async function KnowledgePage() {
  const user = await getSession();
  if (!user) redirect("/");

  return <KnowledgeManager />;
}
