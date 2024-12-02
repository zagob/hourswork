"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { createUserAuth } from "./actions";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["auth-callback"],
    queryFn: async () => await createUserAuth(),
    retry: true,
  });

  if (data?.success) {
    router.push("/");
  }

  return (
    <div className="bg-zinc-900 text-zinc-50 min-h-screen flex justify-center pt-20">
      <div className="h-fit flex items-center gap-2">
        <Loader className="animate-spin size-6" />
        <h3 className="text-xl font-semibold">Entrando...</h3>
      </div>
    </div>
  );
}
