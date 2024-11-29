import { DistanceDate } from "@/components/distance-date";
import { FormRegisterHours } from "@/components/form-register-hours";
import { MenuName } from "@/components/menu-name";
import { SelectedMonth } from "@/components/selected-month";
import { TableHours } from "@/components/table-hours";
import { DateProvider } from "@/contexts/date-provider";

export default function Page() {
  return (
    <DateProvider>
      <div className="min-h-screen bg-zinc-900 text-zinc-50">
        <div className="px-20 py-12 space-y-4">
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
              <DistanceDate />
            </div>
            <MenuName />
          </div>

          <div className="w-full h-px bg-zinc-700" />

          <FormRegisterHours />
          <TableHours />
        </div>
      </div>
    </DateProvider>
  );
}
