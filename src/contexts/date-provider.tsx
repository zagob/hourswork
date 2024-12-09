"use client";

import { isSaturday, isSunday } from "date-fns";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface DataContextProps {
  onChangeMonth: (newMonth: number) => void;
  onChangeYear: (newYear: string) => void;
  date: Date;
}

const DateContext = createContext({} as DataContextProps);

export function DateProvider({ children }: { children: ReactNode }) {
  const currentDate = new Date();
  const [date, setDate] = useState(currentDate);

  function onChangeMonth(newMonth: number) {
    const year = date.getFullYear();
    setDate(new Date(year, newMonth));
  }

  function onChangeYear(newYear: string) {}

  console.log("date", date);

  return (
    <DateContext.Provider value={{ onChangeMonth, onChangeYear, date }}>
      {children}
    </DateContext.Provider>
  );
}

export const useDateContext = () => {
  const values = useContext(DateContext);

  return values;
};
