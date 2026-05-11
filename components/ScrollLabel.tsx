"use client";
import { useEffect, useState } from "react";

const ScrollLabel = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className={`fixed left-4 bottom-6 z-30 flex flex-col items-center gap-2 bg-transparent transition-opacity duration-300 cursor-pointer ${
        visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <span
        className="text-[10px] font-bold uppercase text-white/70"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", letterSpacing: "0.3em" }}
      >
        Scroll To Top
      </span>
      <span className="h-9 w-px bg-white/40" />
    </button>
  );
};

export default ScrollLabel;
