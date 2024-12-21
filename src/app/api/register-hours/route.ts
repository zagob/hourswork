import { validateCurrentUser } from "@/app/actions";
import { prisma } from "@/db/prismaClient";
import {
  calculateTotalWorkTime,
  getAllDaysOfMonh,
  minutesToTimeString,
  timeStringToMinutes,
} from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { differenceInMinutes, format, parse } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
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

    // calculate totalworked

    return NextResponse.json({ message: "Hours registered" }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      {
        message: "Something went wrong",
        err,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
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
  const searchParams = req.nextUrl.searchParams;

  const year = Number(searchParams.get("year"));
  const month = Number(searchParams.get("month"));

  const startOfMonth = new Date(year, month);
  const endOfMonth = new Date(year, month + 1);

  const hours = await prisma.registerHours.findMany({
    where: {
      userId: user.id,
      createdAt: {
        gte: startOfMonth,
        lt: endOfMonth,
      },
    },
    select: {
      id: true,
      times: true,
      createdAt: true,
      user: {
        select: {
          detailsHours: {
            select: {
              totalHours: true,
            },
          },
        },
      },
    },
  });

  const hoursFormat = hours.map((hour) => {
    const timesArray = hour.times.split(",");

    const result = [];

    for (let i = 0; i < timesArray.length; i += 2) {
      result.push({
        name: `time${Math.floor(i / 2) + 1}`,
        entry: timesArray[i],
        exit: timesArray[i + 1],
      });
    }

    return {
      ...hour,
      times: result,
    };
  });

  const hoursWithAllDaysOfMonth = getAllDaysOfMonh(year, month)
    .map((value) => {
      const hoursRegistred = hoursFormat.find(
        (hour) => format(value, "dd/MM") === format(hour.createdAt, "dd/MM")
      );

      if (hoursRegistred) {
        const totalHoursTimesCalculate = calculateTotalWorkTime(
          hoursRegistred.times
        );

        const totalHoursTimesToMinutes = timeStringToMinutes(
          totalHoursTimesCalculate
        );
        const totalHoursTimesDetailsToMinutes = timeStringToMinutes(
          // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
          hoursRegistred.user.detailsHours?.totalHours!
        );

        let workhoursStatus = null;
        if (totalHoursTimesToMinutes > totalHoursTimesDetailsToMinutes)
          workhoursStatus = "POSITIVE";
        if (totalHoursTimesToMinutes === totalHoursTimesDetailsToMinutes)
          workhoursStatus = "EQUAL";
        if (totalHoursTimesToMinutes < totalHoursTimesDetailsToMinutes)
          workhoursStatus = "NEGATIVE";

        return {
          date: value,
          totalHoursTime: totalHoursTimesCalculate,
          totalHoursTimesToMinutes,
          workhoursStatus,
          ...hoursRegistred,
        };
      }

      return {
        id: null,
        times: null,
        createdAt: null,
        date: value,
      };
    })
    .filter(({ date }) => date.getDay() !== 0 && date.getDay() !== 6);

  return NextResponse.json(
    {
      hours: hoursWithAllDaysOfMonth,
    },
    { status: 200 }
  );
}

export async function DELETE(req: NextRequest) {
  try {
    const result = await validateCurrentUser();
    if (!result) return;

    const searchParams = req.nextUrl.searchParams;

    const idHours = searchParams.get("id");

    if (!idHours) return console.log("not id");

    await prisma.registerHours.delete({
      where: {
        id: idHours,
        userId: result.user.id,
      },
    });

    return NextResponse.json("Register Deleted succefully", { status: 200 });
  } catch (error) {
    console.log(error);
  }
}
