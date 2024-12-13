"use server";

import { prisma } from "@/db/prismaClient";
import { currentUser } from "@clerk/nextjs/server";

export async function validateCurrentUser() {
  const auth = await currentUser();

  if (!auth) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      externalId: auth.id,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    success: true,
    user,
  };
}
