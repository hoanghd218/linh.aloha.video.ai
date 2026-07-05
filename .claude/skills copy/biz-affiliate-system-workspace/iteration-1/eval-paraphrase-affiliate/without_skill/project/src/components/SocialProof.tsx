"use client";

import { useEffect, useState } from "react";

const names = [
  { name: "Hoang Tran", email: "hoanghd***@gmail.com" },
  { name: "Minh Nguyen", email: "minhn***@gmail.com" },
  { name: "Linh Pham", email: "linhp***@gmail.com" },
  { name: "Duc Le", email: "ducle***@gmail.com" },
  { name: "Thu Ha", email: "thuha***@gmail.com" },
  { name: "Anh Vu", email: "anhvu***@gmail.com" },
  { name: "Tuan Dao", email: "tuand***@gmail.com" },
  { name: "Hoa Mai", email: "hoama***@gmail.com" },
  { name: "Khoa Phan", email: "khoap***@gmail.com" },
  { name: "Lan Anh", email: "lanan***@gmail.com" },
  { name: "Bao Tran", email: "baotr***@gmail.com" },
  { name: "My Linh", email: "mylin***@gmail.com" },
  { name: "Thanh Son", email: "thson***@gmail.com" },
  { name: "Ngoc Anh", email: "ngocan***@gmail.com" },
  { name: "Quang Huy", email: "qhuy***@gmail.com" },
  { name: "Thao Nguyen", email: "thaon***@gmail.com" },
  { name: "Hung Vo", email: "hungv***@gmail.com" },
  { name: "Phuong Le", email: "phuongl***@gmail.com" },
  { name: "Duy Khanh", email: "dkhanh***@gmail.com" },
  { name: "Kim Chi", email: "kimchi***@gmail.com" },
];

const times = ["vừa xong", "1 phút trước", "2 phút trước", "3 phút trước", "5 phút trước"];

function getRandomNotif(excludeIndex: number) {
  let idx = Math.floor(Math.random() * names.length);
  while (idx === excludeIndex) idx = Math.floor(Math.random() * names.length);
  const time = times[Math.floor(Math.random() * times.length)];
  return { ...names[idx], time, idx };
}

export default function SocialProof() {
  const [notif, setNotif] = useState({ ...names[0], time: times[0], idx: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const initialDelay = setTimeout(() => {
      setNotif(getRandomNotif(-1));
      setVisible(true);
    }, 3000);

    return () => clearTimeout(initialDelay);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    const nextTimer = setTimeout(() => {
      setNotif((prev) => getRandomNotif(prev.idx));
      setVisible(true);
    }, 10000);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
    };
  }, [visible]);

  return (
    <div
      className={`fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-40 transition-all duration-500 ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-surface-container-high/95 backdrop-blur-xl border border-primary/20 rounded-xl p-3 sm:p-4 shadow-[0_8px_30px_rgba(0,0,0,0.4),0_0_15px_rgba(245,158,11,0.1)] max-w-xs sm:max-w-sm flex items-start gap-3">
        {/* Avatar */}
        <div className="shrink-0 w-10 h-10 rounded-full bg-linear-to-br from-primary to-primary-container flex items-center justify-center text-on-primary-container font-black text-sm">
          {notif.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs sm:text-sm font-bold text-on-surface truncate">{notif.name}</span>
            <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          </div>
          <div className="text-[10px] sm:text-xs text-on-surface-variant truncate">
            {notif.email}
          </div>
          <div className="text-[10px] sm:text-xs text-primary font-medium mt-1">
            vừa giữ chỗ Agent Camp — {notif.time}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => setVisible(false)}
          className="shrink-0 text-on-surface-variant/50 hover:text-on-surface transition-colors"
          aria-label="Đóng"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>
      </div>
    </div>
  );
}
