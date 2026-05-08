import HomeClient from "@/components/HomeClient";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getSession();
  return (
    <div>
      <HomeClient user={user} />
    </div>
  );
}
