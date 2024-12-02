import { prisma } from "@/db/prismaClient";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodyProps = z.object({
  date: z.string(),
  times: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, times } = bodyProps.parse(body);
    const auth = await currentUser();
    if (!auth) {
      throw new Error("Uneuthorized");
    }

    const user = await prisma.user.findFirst({
      where: {
        externalId: auth.id,
      },
    });

    console.log("userr", user);

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
      register,
    });
    return NextResponse.json({ message: "Hours registered" }, { status: 201 });
  } catch (err) {
    console.log("errrrr", err);
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
