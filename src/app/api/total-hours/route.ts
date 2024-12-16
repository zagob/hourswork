import { validateCurrentUser } from "@/app/actions";
import { prisma } from "@/db/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const auth = await validateCurrentUser();

  if (!auth) return;

  const { totalHoursWorked } = await req.json();

  await prisma.detailHours.update({
    where: {
      userId: auth.user.id,
    },
    data: {
      totalHoursWorked,
    },
  });

  return NextResponse.json(
    { message: "Updated total hours success" },
    {
      status: 200,
    }
  );
}
