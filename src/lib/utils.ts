import { clsx, type ClassValue } from "clsx";
import { addMinutes, differenceInMinutes, eachDayOfInterval, endOfMonth, format, parse, startOfDay, startOfMonth } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeStringToMinutes(timeString: string) {
  const time = parse(timeString, "HH:mm", new Date());
  const startOfDayDate = startOfDay(time);
  return differenceInMinutes(time, startOfDayDate);
}

export function minutesToTimeString(totalMinutes: number) {
  const startOfDayDate = startOfDay(new Date());
  const time = addMinutes(startOfDayDate, totalMinutes);

  return format(time, "HH:mm");
}

export function calculateTotalWorkTime(times: Array<{ entry: string, exit: string }>){
  let totalMinutes = 0

  for(let i = 0; i < times.length; i++) {
    const { entry, exit } = times[i]

    const entryDate = parse(entry, "HH:mm", new Date())
    const exitDate = parse(exit, "HH:mm", new Date())

    totalMinutes += differenceInMinutes(exitDate, entryDate)
  }

  // const hours = Math.floor(totalMinutes / 60)
  // const minutes = totalMinutes % 60

  return minutesToTimeString(totalMinutes)
  
}

export function getAllDaysOfMonh(year: number, month: number) {
  const date = new Date(year, month);

  const start = startOfMonth(date);
  const end = endOfMonth(date);

  return eachDayOfInterval({ start, end });
}
