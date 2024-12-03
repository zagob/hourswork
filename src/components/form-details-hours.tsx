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

const FormSchema = z.object({
  totalHours: z.string().min(2),
  totalHoursWorked: z.string(),
});

export function FormDetailsHours() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      totalHours: "08:00",
      totalHoursWorked: "00:00",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await api.post("/details-hours", data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center gap-4"
      >
        <FormField
          control={form.control}
          name="totalHours"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormLabel>Horas trabalhadas no dia: </FormLabel>
              <FormControl>
                <Input
                  type="time"
                  placeholder="08:00"
                  {...field}
                  className="w-fit"
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
            <FormItem className="flex items-center gap-2">
              <FormLabel>Horas no banco: </FormLabel>
              <FormControl>
                <Input
                  placeholder="00:00"
                  {...field}
                  className="w-fit"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Salvar</Button>
      </form>
    </Form>
  );
}
