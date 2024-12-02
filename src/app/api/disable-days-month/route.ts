import { prisma } from "@/db/prismaClient";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
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

  const hours = await prisma.registerHours.findMany({
    where: {
      userId: user.id,
    },
    select: {
      createdAt: true,
    }
  });

  const hoursFormat = hours.map((hour) => new Date(hour.createdAt))

  return NextResponse.json(
    {
      disabledDays: hoursFormat,
    },
    { status: 200 }
  );
}
