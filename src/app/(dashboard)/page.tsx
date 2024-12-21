import { FormDetailsHours } from "@/components/form-details-hours";
import { FormRegisterHours } from "@/components/form-register-hours";
import { MenuName } from "@/components/menu-name";
import { SelectedMonth } from "@/components/selected-month";
import { TableHours } from "@/components/table-hours";
// import { TotalBank } from "@/components/total-bank";
import { DateProvider } from "@/contexts/date-provider";
import { prisma } from "@/db/prismaClient";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Page() {
  const auth = await currentUser();

  if (!auth) {
    return redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: {
      externalId: auth.id,
    },
    select: {
      detailsHours: true,
    },
  });

  if (!user) {
    return redirect("/auth-callback");
  }

  const isDetailsHours = user.detailsHours;

  return (
    <DateProvider>
      <div className="min-h-screen bg-zinc-900 text-zinc-50">
        <div className="px-8 lg:px-20 py-6 space-y-4">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-2
        "
            >
              <div className="flex gap-1 flex-col items-start leading-3 border-r pr-2 border-r-zinc-700">
                <h1 className="font-semibold text-2xl flex items-center">
                  <SelectedMonth />
                </h1>
              </div>
              {/* <TotalBank /> */}
            </div>
            <MenuName />
          </div>

          <div className="w-full h-px bg-zinc-700" />

          {isDetailsHours ? <FormRegisterHours /> : <FormDetailsHours />}
          {isDetailsHours ? (
            <TableHours />
          ) : (
            <div className="flex flex-col items-center justify-center">
              <Image
                src="/brand-asset-wave.png"
                className="opacity-40"
                width={500}
                height={1000}
                alt="brand"
              />
              <span className="text-xl text-zinc-600">
                Please, register your detailed hours of work.
              </span>
            </div>
          )}
        </div>
      </div>
    </DateProvider>
  );
}
