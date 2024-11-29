import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export default async function Home() {
  const auth = await currentUser();

  if (!auth) {
    redirect("/sign-in");
  }

  return null;
}
