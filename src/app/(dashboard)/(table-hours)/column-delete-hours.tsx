/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { HoursProps } from "@/components/table-hours";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CellContext } from "@tanstack/react-table";
import { Loader2Icon, Trash2 } from "lucide-react";
import { useState } from "react";

export function ColumnDeleteHours({ row }: CellContext<HoursProps, unknown>) {
  const [open, setOpen] = useState(false);
  const { id, times } = row.original;

  if (!times) return;

  return (
    <div className="w-fit">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="bg-red-500 text-red-50 hover:bg-red-400">
            <Trash2 size={50} />
          </Button>
        </DialogTrigger>
        {open && <DialogContentColumn onChangeOpen={setOpen} id={id} />}
      </Dialog>
    </div>
  );
}

const DialogContentColumn = ({
  onChangeOpen,
  id,
}: {
  onChangeOpen: (open: boolean) => void;
  id: string | null;
}) => {
  const queryClient = useQueryClient();

  const { mutate: deleteHours, isPending } = useMutation({
    mutationFn: async ({ id }: { id: string }) =>
      await api.delete(`/register-hours`, {
        params: {
          id,
        },
      }),
    onSuccess: () => {
      onChangeOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["register-hours"],
      });
    },
  });

  return (
    <DialogContent className="w-80 bg-zinc-700 text-zinc-50 border-none">
      <DialogHeader>
        <DialogTitle>Do you want to delete this schedule?</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-2 gap-2">
        <Button disabled={isPending} onClick={() => deleteHours({ id: id! })}>
          {isPending ? <Loader2Icon className="animate-spin" /> : "Yes"}
        </Button>
        <Button
          disabled={isPending}
          onClick={() => onChangeOpen(false)}
          variant="secondary"
        >
          No
        </Button>
      </div>
    </DialogContent>
  );
};
