"use client";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { z } from "zod";
import { Button } from "./ui/button";
import { api } from "@/lib/axios";
import { useState } from "react";
import { Loader } from "lucide-react";

const FormSchema = z.object({
  totalHours: z.string().min(2),
  totalHoursWorked: z.string(),
});

export function FormDetailsHours() {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      totalHours: "08:00",
      totalHoursWorked: "00:00",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    await api.post("/details-hours", data).finally(() => {
      setLoading(false);
      window.location.reload();
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-end gap-4"
      >
        <FormField
          control={form.control}
          name="totalHours"
          render={({ field }) => (
            <FormItem className="grid items-center gap-1">
              <FormLabel>Horas trabalhadas no dia: </FormLabel>
              <FormControl>
                <Input
                  type="time"
                  placeholder="08:00"
                  {...field}
                  className="w-fit border-zinc-600"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="totalHoursWorked"
          render={({ field }) => (
            <FormItem className="grid items-center gap-1">
              <FormLabel>Horas no banco: </FormLabel>
              <FormControl>
                <Input
                  placeholder="00:00"
                  {...field}
                  className="w-fit border-zinc-600"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} type="submit">
          {loading ? <Loader className="animate-spin" /> : "Salvar"}
        </Button>
      </form>
    </Form>
  );
}
