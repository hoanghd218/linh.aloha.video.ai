"use client";

import { useEffect, useState } from "react";

const ZALO_LINK = "https://zalo.me/g/kxvavk323";

// Next midnight from client load
function getNextMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime();
}

function formatSegment(value: number) {
  return value.toString().padStart(2, "0");
}

export default function PromoBar() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const target = getNextMidnight();
    const tick = () => setRemaining(Math.max(0, target - Date.now()));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = remaining !== null ? Math.floor(remaining / 3_600_000) : 0;
  const minutes = remaining !== null ? Math.floor((remaining / 60_000) % 60) : 0;
  const seconds = remaining !== null ? Math.floor((remaining / 1000) % 60) : 0;

  return (
    <div className="fixed top-0 left-0 right-0 z-60 bg-linear-to-r from-red-600 via-red-500 to-red-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-1.5 sm:py-2 flex items-center justify-center gap-2 sm:gap-4 text-white">
        <span className="material-symbols-outlined text-sm sm:text-base animate-pulse shrink-0">
          local_fire_department
        </span>
        <span className="text-[10px] sm:text-sm font-black uppercase tracking-wide text-center">
          Chỉ có trong Freedom Builder Pro — Đóng trong{" "}
          <span className="tabular-nums inline-block min-w-18 text-yellow-200">
            {formatSegment(hours)}:{formatSegment(minutes)}:{formatSegment(seconds)}
          </span>
        </span>
        <a
          href={ZALO_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-md bg-white text-red-600 font-black text-xs uppercase hover:scale-105 transition-transform"
        >
          Vào Pro ngay
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </a>
      </div>
    </div>
  );
}
