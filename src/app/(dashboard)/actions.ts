"use server";

import { prisma } from "@/db/prismaClient";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const getDaysWorking = async () => {
  const auth = await currentUser();

  if (!auth) redirect("/sign-up");

  await prisma.user.findFirst({
    where: { externalId: auth.id },
  });
};
