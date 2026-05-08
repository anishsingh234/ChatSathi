import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();
  if (!user) redirect("/");

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar userName={user.name} userEmail={user.email} />
      <main className="ml-64 min-h-screen">
        <div className="p-6 sm:p-8">{children}</div>
      </main>
    </div>
  );
}
