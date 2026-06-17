"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface AdminDateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
}

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const WEEKDAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const pad = (value: number) => String(value).padStart(2, "0");

const toInputValue = (date: Date) => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const parseInputValue = (value: string) => {
  if (!value) return new Date();

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

export default function AdminDateTimePicker({ value, onChange }: AdminDateTimePickerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedDate = useMemo(() => parseInputValue(value), [value]);
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => selectedDate);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(year, month, 1 - firstDay.getDay());

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);
      return date;
    });
  }, [viewDate]);

  const setSelectedDate = (date: Date) => {
    const nextDate = new Date(date);
    nextDate.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
    onChange(toInputValue(nextDate));
    setViewDate(nextDate);
  };

  const setTime = (type: "hour" | "minute", nextValue: string) => {
    const numericValue = Number(nextValue);
    const nextDate = new Date(selectedDate);

    if (type === "hour") {
      nextDate.setHours(numericValue);
    } else {
      nextDate.setMinutes(numericValue);
    }

    nextDate.setSeconds(0, 0);
    onChange(toInputValue(nextDate));
  };

  const moveMonth = (amount: number) => {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  };

  const setToday = () => {
    const today = new Date();
    onChange(toInputValue(today));
    setViewDate(today);
  };

  const displayValue = selectedDate.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((current) => !current);
          setViewDate(selectedDate);
        }}
        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-yellow-500 outline-none transition-colors cursor-pointer flex items-center justify-between gap-3"
      >
        <span>{displayValue}</span>
        <i className="ri-calendar-line text-base text-yellow-500" />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[20rem] max-w-[calc(100vw-3rem)] rounded-xl border border-white/10 bg-[#050505] shadow-2xl shadow-black/60 p-4">
          <div className="flex items-center justify-between gap-2 mb-4">
            <button
              type="button"
              onClick={() => moveMonth(-1)}
              className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.02] text-white/60 hover:text-yellow-500 hover:border-yellow-500/30 transition-colors cursor-pointer"
              aria-label="Bulan sebelumnya"
            >
              <i className="ri-arrow-left-s-line text-lg" />
            </button>
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-white">
                {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
              </p>
            </div>
            <button
              type="button"
              onClick={() => moveMonth(1)}
              className="w-8 h-8 rounded-lg border border-white/10 bg-white/[0.02] text-white/60 hover:text-yellow-500 hover:border-yellow-500/30 transition-colors cursor-pointer"
              aria-label="Bulan berikutnya"
            >
              <i className="ri-arrow-right-s-line text-lg" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAYS.map((day) => (
              <div key={day} className="h-7 flex items-center justify-center text-[10px] font-bold uppercase tracking-wider text-white/35">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date) => {
              const isCurrentMonth = date.getMonth() === viewDate.getMonth();
              const isSelected = date.toDateString() === selectedDate.toDateString();
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className={`h-9 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-yellow-500 text-black"
                      : isToday
                        ? "border border-yellow-500/40 text-yellow-500 bg-yellow-500/10"
                        : "border border-transparent text-white/65 hover:bg-white/[0.04] hover:text-yellow-500"
                  } ${isCurrentMonth ? "" : "opacity-35"}`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={setToday}
              className="px-3 py-2 rounded-lg border border-white/10 bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-white/65 hover:text-yellow-500 hover:border-yellow-500/30 transition-colors cursor-pointer"
            >
              Hari Ini
            </button>

            <div className="flex items-center gap-2">
              <select
                value={pad(selectedDate.getHours())}
                onChange={(event) => setTime("hour", event.target.value)}
                className="bg-black border border-white/10 rounded-lg px-2 py-2 text-xs text-white focus:border-yellow-500 outline-none"
                aria-label="Jam publikasi"
              >
                {Array.from({ length: 24 }, (_, hour) => (
                  <option key={hour} value={pad(hour)} className="bg-neutral-950">
                    {pad(hour)}
                  </option>
                ))}
              </select>
              <span className="text-white/35 text-xs font-bold">:</span>
              <select
                value={pad(selectedDate.getMinutes())}
                onChange={(event) => setTime("minute", event.target.value)}
                className="bg-black border border-white/10 rounded-lg px-2 py-2 text-xs text-white focus:border-yellow-500 outline-none"
                aria-label="Menit publikasi"
              >
                {Array.from({ length: 60 }, (_, minute) => (
                  <option key={minute} value={pad(minute)} className="bg-neutral-950">
                    {pad(minute)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
