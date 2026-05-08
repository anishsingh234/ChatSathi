import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingsClient from "@/components/admin/SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getSession();
  if (!user) redirect("/");

  return <SettingsClient userId={user.id} />;
}
