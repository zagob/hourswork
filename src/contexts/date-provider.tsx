"use client";

import { addMonths, format } from "date-fns";
import { createContext, ReactNode, useContext, useState } from "react";

interface DataContextProps {
  onChangeMonth: (newMonth: number) => void;
  onChangeYear: (newYear: string) => void;
  date: Date;
  //   month: string;
  //   year: string;
}

const DateContext = createContext({} as DataContextProps);

export function DateProvider({ children }: { children: ReactNode }) {
  //   const currentDate = format(new Date(), "MM/yyyy");
  const currentDate = new Date();
  const [date, setDate] = useState(currentDate);

  //   const [monthNumber, yearNumber] = date.split("/").map(Number)
  //   const [month, year] = date.split("/");

  function onChangeMonth(newMonth: number) {
    const year = date.getFullYear()
    setDate(new Date(year, newMonth));
    // setDate((state) => state.replace(month, newMonth));
  }

  function onChangeYear(newYear: string) {
    // setDate((state) => state.replace(year, newYear));
  }

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
