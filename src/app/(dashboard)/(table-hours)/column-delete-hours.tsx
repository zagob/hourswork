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
  const queryClient = useQueryClient();

  if (!times) return;

  const { mutate: deleteHours, isPending } = useMutation({
    mutationFn: async ({ id }: { id: string }) =>
      await api.delete(`/register-hours`, {
        params: {
          id,
        },
      }),
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["register-hours"],
      });
    },
  });

  return (
    <div className="w-fit">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="bg-red-500 text-red-50 hover:bg-red-400">
            <Trash2 size={50} />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-80 bg-zinc-700 text-zinc-50 border-none">
          <DialogHeader>
            <DialogTitle>Deseja excluir esse horário?</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2">
            <Button
              disabled={isPending}
              onClick={() => deleteHours({ id: id! })}
            >
              {isPending ? <Loader2Icon className="animate-spin" /> : "Sim"}
            </Button>
            <Button
              disabled={isPending}
              onClick={() => setOpen(false)}
              variant="secondary"
            >
              Não
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
