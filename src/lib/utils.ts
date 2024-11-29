import { clsx, type ClassValue } from "clsx";
import { eachDayOfInterval, endOfMonth, startOfMonth } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAllDaysOfMonh(year: number, month: number) {
  const date = new Date(year, month);

  const start = startOfMonth(date);
  const end = endOfMonth(date);

  return eachDayOfInterval({ start, end });
}
