"use client";

import { format } from "date-fns";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

export function RealTime() {
  const [currentTime, setCurrentTime] = useState(
    format(new Date(), "HH:mm:ss")
  );

  useEffect(() => {
    const updateClock = () => {
      setCurrentTime(format(new Date(), "HH:mm:ss"));
    };

    const intervalId = setInterval(updateClock, 1000);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <div className="flex items-center gap-2">
      <span className="text-xl">{currentTime}</span>
      <Clock />
    </div>
  );
}
