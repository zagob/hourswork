import { prisma } from "@/db/prismaClient";
import { getAllDaysOfMonh } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { format } from "date-fns";
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
      )

      if (hoursRegistred) {
        // const totalHours = hour
        return {
          date: value,
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
