"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

import { z } from "zod";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { DatePicker } from "./date-picker";
import { useDateContext } from "@/contexts/date-provider";
import axios from "axios";

const CreateHoursSchema = z.object({
  date: z.date(),
  times: z.array(z.string()).min(1),
});

type CreateHoursSchema = z.infer<typeof CreateHoursSchema>;

export function FormRegisterHours() {
  const { date } = useDateContext();
  const [inputsTime, setInputsTime] = useState(4);
  const methods = useForm<CreateHoursSchema>({
    resolver: zodResolver(CreateHoursSchema),
    defaultValues: {
      date: date,
    },
  });
  const onSubmit = async (data: CreateHoursSchema) => {
    axios.post("/register-hours", data);
  };

  const valueData = methods.watch("date");

  console.log(methods.getValues("date"));

  useEffect(() => {
    methods.setValue("date", date);
  }, [date]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="flex items-center flex-wrap gap-2">
          <DatePicker />
          <div className="flex items-center gap-2">
            {Array.from({ length: inputsTime }).map((_, index) => {
              const time = index + 1;

              const timePar = time % 2 === 0;

              return (
                <div
                  key={time}
                  className={cn("relative", {
                    "mr-2": timePar,
                  })}
                >
                  <Input
                    type="time"
                    disabled={!valueData}
                    className="w-28 border-zinc-600 outline-none focus:border-orange-500"
                    {...methods.register(`times.${index}`)}
                  />
                  {time > 4 && timePar && (
                    <div
                      onClick={() => setInputsTime((state) => state - 2)}
                      className="border rounded-full size-3.5 flex items-center justify-center bg-red-500 border-zinc-500 absolute -top-1 -right-1 hover:bg-red-400 hover:cursor-pointer"
                    >
                      <X className="size-3" />
                    </div>
                  )}
                </div>
              );
            })}
            <Button type="submit">
              <Clock />
              Registrar
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
