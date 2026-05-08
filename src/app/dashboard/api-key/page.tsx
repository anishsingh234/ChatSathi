import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ApiKeyClient from "@/components/admin/ApiKeyClient";

export const dynamic = "force-dynamic";

export default async function ApiKeyPage() {
  const user = await getSession();
  if (!user) redirect("/");

  return <ApiKeyClient hasKey={!!user.geminiApiKey} />;
}
