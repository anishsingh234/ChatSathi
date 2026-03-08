import Image from "next/image";
import HomeClient from "@/components/HomeClient";
import { getSession } from "@/lib/getSession";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const session=await getSession()
  console.log("session",session)
  return (
   <div>
    <HomeClient email={session?.user?.email!} />
   </div>
  );
}
