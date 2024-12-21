"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

import { z } from "zod";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { DatePicker } from "./date-picker";
import { api } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import clsx from "clsx";
import { useDateContext } from "@/contexts/date-provider";
import { getMonth, getYear } from "date-fns";
import { cn } from "@/lib/utils";

const CreateHoursSchema = z
  .object({
    date: z.date(),
    times: z.array(z.string().min(4, { message: "Obrigatório" })).min(1),
  })
  .refine(
    (data) => {
      for (let i = 1; i < data.times.length; i++) {
        if (data.times[i] <= data.times[i - 1]) {
          return false;
        }
      }
      return true;
    },
    {
      message: "Cada hora deve ser mais cedo que a próxima",
      path: ["times"],
    }
  );

type CreateHoursSchema = z.infer<typeof CreateHoursSchema>;

export function FormRegisterHours() {
  const queryClient = useQueryClient();
  const { date } = useDateContext();
  const [inputsTime, setInputsTime] = useState(4);
  const methods = useForm<CreateHoursSchema>({
    resolver: zodResolver(CreateHoursSchema),
  });

  const timesError = methods.formState.errors.times?.root?.message;

  const onSubmit = async (data: CreateHoursSchema) => {
    registerHours(data);
  };

  const { mutate: registerHours, isPending: isLoadingRegisterHours } =
    useMutation<void, AxiosError, CreateHoursSchema>({
      mutationFn: async (data) =>
        await api.post("/register-hours", {
          date: data.date,
          times: data.times.join(),
        }),
      onSuccess: () => {
        methods.reset();
        queryClient.invalidateQueries({
          queryKey: ["disable-days-month"],
        });
        queryClient.invalidateQueries({
          queryKey: ["register-hours", getMonth(date), getYear(date)],
          exact: true,
        });
      },
    });

  const valueData = methods.watch("date");

  useEffect(() => {
    if (date) {
      methods.reset();
    }
  }, [date, methods]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className="flex items-center flex-wrap gap-2">
          <DatePicker />
          <div className="flex items-center gap-2 flex-wrap">
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
                    className={clsx(
                      "w-full lg:w-28 border-zinc-600 outline-none focus:border-orange-500"
                    )}
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
            <Button disabled={isLoadingRegisterHours} type="submit">
              {isLoadingRegisterHours ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Clock />
                  Register Hours
                </>
              )}
            </Button>
            {!!timesError?.length && (
              <span className="font-bold text-xs text-red-400">
                ATENÇÃO! {timesError}*
              </span>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
