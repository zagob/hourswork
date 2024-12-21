import { validateCurrentUser } from "@/app/actions";
import { prisma } from "@/db/prismaClient";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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

  const detailsHours = await prisma.detailHours.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!detailsHours) {
    return NextResponse.json(
      {
        success: false,
        message: "Not found details hours",
      },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { success: true, detailsHours },
    {
      status: 201,
    }
  );
}

const bodyProps = z.object({
  totalHours: z.string(),
  totalHoursWorked: z.string(),
});

export async function POST(req: NextRequest) {
  const auth = await validateCurrentUser();

  const body = await req.json();

  const { totalHours, totalHoursWorked } = bodyProps.parse(body);

  await prisma.detailHours.create({
    data: {
      totalHours,
      totalHoursWorked,
      userId: auth.user.id,
    },
  });

  return NextResponse.json(
    { success: true },
    {
      status: 201,
    }
  );
}

const bodyPropsPUT = z.object({
  totalHoursWorked: z.string(),
});

export async function PUT(req: NextRequest) {
  const auth = await validateCurrentUser();

  const body = await req.json();

  const { totalHoursWorked } = bodyPropsPUT.parse(body);

  await prisma.detailHours.update({
    where: {
      userId: auth.user.id,
    },
    data: {
      totalHoursWorked,
    },
  });

  return NextResponse.json(
    { success: true, message: "detail hours updated success" },
    {
      status: 200,
    }
  );
}
