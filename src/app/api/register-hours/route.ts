import { prisma } from "@/db/prismaClient";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodyProps = z.object({
  date: z.date(),
  times: z.string(),
});

export async function POST(req: Request) {
  try {
    const { date, times } = bodyProps.parse(req.body);
    const auth = await currentUser();

    if (!auth) {
      throw new Error("Uneuthorized");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: auth.id,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const register = await prisma.registerHours.create({
      data: {
        userId: user.id,
        createdAt: date,
        times,
      },
    });

    console.log({
      date,
      times,
      register
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
