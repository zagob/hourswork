"use server";

import { prisma } from "@/db/prismaClient";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const createUserAuth = async () => {
  const auth = await currentUser();

  if (!auth) redirect("/sign-up");

  const user = await prisma.user.findFirst({
    where: { externalId: auth.id },
  });

  if (!user) {
    await prisma.user.create({
      data: {
        email: auth.emailAddresses[0].emailAddress,
        externalId: auth.id,
        name: auth.fullName ?? "",
      },
    });
  }

  return { success: true };
};
