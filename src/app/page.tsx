// import { RealTime } from "@/components/real-time";
import { TableHours } from "@/components/table-hours";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

export default function Home() {
  const currentDate = format(new Date(), "dd 'de' MMMM", {
    locale: pt,
  });
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-50">
      <div className="px-20 py-12 space-y-4">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2
        "
          >
            <div className="w-fit flex flex-col items-end leading-3 border-r pr-2 border-r-zinc-700">
              <span>{new Date().getFullYear()}</span>
              <h1 className="font-semibold text-2xl">{currentDate}</h1>
            </div>
            <h2 className="text-3xl font-medium">Hoje</h2>
          </div>
          {/* <RealTime /> */}
        </div>

        <div className="w-full h-px bg-zinc-700" />

        <TableHours />
      </div>
    </div>
  );
}
