import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ThemeCustomizer from "@/components/admin/ThemeCustomizer";

export const dynamic = "force-dynamic";

export default async function AppearancePage() {
  const user = await getSession();
  if (!user) redirect("/");

  return <ThemeCustomizer userId={user.id} />;
}
