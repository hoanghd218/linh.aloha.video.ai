"use client";

import { useState } from "react";
import Image from "next/image";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/60 backdrop-blur-xl shadow-[0_0_40px_rgba(245,158,11,0.05)]">
      <div className="flex justify-between items-center px-4 sm:px-8 py-3 sm:py-4 max-w-7xl mx-auto gap-3">
        <a href="#" className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Image src="/logo.png" alt="Agent Camp" width={36} height={36} className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
          <span className="text-base sm:text-2xl font-black text-on-surface tracking-tighter truncate">
            AGENT CAMP
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7">
          <a className="text-on-surface-variant hover:text-on-surface transition-all duration-300 hover:scale-105" href="#aios">AIOS</a>
          <a className="text-on-surface-variant hover:text-on-surface transition-all duration-300 hover:scale-105" href="#curriculum">Chương Trình</a>
          <a className="text-on-surface-variant hover:text-on-surface transition-all duration-300 hover:scale-105" href="#systems">Hệ Thống</a>
          <a className="text-on-surface-variant hover:text-on-surface transition-all duration-300 hover:scale-105" href="#pricing">Giá Vé</a>
          <a className="text-on-surface-variant hover:text-on-surface transition-all duration-300 hover:scale-105" href="#faq">FAQ</a>
          <a
            href="#register"
            className="bg-linear-to-br from-primary to-primary-container text-on-primary px-5 py-2 rounded-xl font-bold hover:scale-105 transition-all duration-300"
          >
            Giữ Chỗ
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={`block w-6 h-0.5 bg-on-surface transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-on-surface transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-on-surface transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-80" : "max-h-0"}`}>
        <nav className="flex flex-col gap-1 px-4 pb-4 bg-surface/95 backdrop-blur-xl">
          <a className="py-3 px-4 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-xl transition-all" href="#aios" onClick={() => setMenuOpen(false)}>AIOS</a>
          <a className="py-3 px-4 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-xl transition-all" href="#curriculum" onClick={() => setMenuOpen(false)}>Chương Trình</a>
          <a className="py-3 px-4 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-xl transition-all" href="#systems" onClick={() => setMenuOpen(false)}>Hệ Thống</a>
          <a className="py-3 px-4 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-xl transition-all" href="#pricing" onClick={() => setMenuOpen(false)}>Giá Vé</a>
          <a className="py-3 px-4 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-xl transition-all" href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
          <a
            href="#register"
            onClick={() => setMenuOpen(false)}
            className="mt-2 py-3 px-4 bg-linear-to-br from-primary to-primary-container text-on-primary rounded-xl font-bold text-center"
          >
            Giữ Chỗ Agent Camp
          </a>
        </nav>
      </div>
    </header>
  );
}
