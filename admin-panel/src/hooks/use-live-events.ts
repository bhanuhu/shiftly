"use client";

import { useEffect, useState } from "react";

type LiveEvent = {
  event: string;
  message: string;
  time: string;
};

export function useLiveEvents() {
  const [events, setEvents] = useState<LiveEvent[]>([
    { event: "driver_location_update", message: "42 drivers broadcasting live", time: "now" },
    { event: "new_booking_request", message: "BKG-48293 entered dispatch queue", time: "1 min" }
  ]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setEvents((current) => [
        {
          event: "live_status",
          message: `Ops heartbeat received from ${Math.floor(36 + Math.random() * 10)} drivers`,
          time: "now"
        },
        ...current.slice(0, 5)
      ]);
    }, 8000);
    return () => window.clearInterval(timer);
  }, []);

  return events;
}
