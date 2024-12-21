"use client";

import { Edit2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import clsx from "clsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const DetailHoursSchema = z.object({
  totalHoursWorked: z.string().regex(/^[-]?\d+:(0[0-9]|[1-5][0-9])$/, {
    message:
      "O valor deve estar no formato 123:45 ou -123:45 e os minutos não podem ultrapassar 59",
  }),
});

type detailHoursSchema = z.infer<typeof DetailHoursSchema>;

export interface DetailsHoursType {
  data: {
    detailsHours: {
      totalHoursWorked: string;
    };
  };
}

export function DialogEditDetailsHours() {
  const { data: detailHours, refetch: refetchDetailsHours } =
    useQuery<DetailsHoursType>({
      queryKey: ["detail-hours"],
      queryFn: async () => await api.get(`/details-hours`),
      staleTime: 1000,
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<detailHoursSchema>({
    defaultValues: {
      totalHoursWorked: detailHours?.data.detailsHours.totalHoursWorked,
    },
    resolver: zodResolver(DetailHoursSchema),
  });

  const { mutate: handleUpdatedDetailsHours, isPending } = useMutation({
    mutationFn: async ({
      data,
    }: {
      data: {
        totalHoursWorked: string;
      };
    }) => await api.put("/details-hours", data),
    onSuccess: () => {
      refetchDetailsHours();
    },
  });

  const handleSubmitData = (data: detailHoursSchema) => {
    handleUpdatedDetailsHours({ data });
  };

  return (
    <div className="w-fit">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="bg-transparent border-zinc-400 text-zinc-400"
          >
            <Edit2 />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-80 bg-zinc-700 text-zinc-50 border-none">
          <DialogHeader>
            <DialogTitle>Detail Hours</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(handleSubmitData)}
            className="grid gap-4"
          >
            <div>
              <Input
                type="text"
                className={clsx(
                  "w-full border-zinc-600 outline-none focus:border-orange-500",
                  {
                    "border-red-500 border-2 text-red-200":
                      errors.totalHoursWorked,
                  }
                )}
                {...register("totalHoursWorked")}
              />
              {errors.totalHoursWorked && (
                <span className="font-bold text-xs text-red-300">
                  {errors.totalHoursWorked?.message}*
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button disabled={isPending} type="submit">
                Yes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
