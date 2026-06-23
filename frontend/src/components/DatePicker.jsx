import { useEffect, useMemo, useRef, useState } from "react";

import { FaIcon } from "../lib/faIcons.jsx";


const weekdays = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];
const monthNames = [
  "январь",
  "февраль",
  "март",
  "апрель",
  "май",
  "июнь",
  "июль",
  "август",
  "сентябрь",
  "октябрь",
  "ноябрь",
  "декабрь",
];


function pad(value) {
  return String(value).padStart(2, "0");
}


function toDateValue(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}


function toDisplayValue(value) {
  if (!value) {
    return "";
  }

  const date = parseDateValue(value);
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
}


function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}


function parseDateValue(value) {
  const [year, month, day] = (value || "").split("-").map(Number);
  if (!year || !month || !day) {
    return startOfToday();
  }

  return new Date(year, month - 1, day);
}


function parseManualDate(value) {
  const normalized = value.trim();
  const dotted = normalized.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  const dashed = normalized.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);

  const parts = dotted
    ? { day: Number(dotted[1]), month: Number(dotted[2]), year: Number(dotted[3]) }
    : dashed
      ? { day: Number(dashed[3]), month: Number(dashed[2]), year: Number(dashed[1]) }
      : null;

  if (!parts) {
    return null;
  }

  const date = new Date(parts.year, parts.month - 1, parts.day);
  if (
    date.getFullYear() !== parts.year ||
    date.getMonth() !== parts.month - 1 ||
    date.getDate() !== parts.day
  ) {
    return null;
  }

  date.setHours(0, 0, 0, 0);
  return date;
}


function buildCalendarDays(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - offset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return date;
  });
}


export function DatePicker({ label, onChange, value }) {
  const selectedDate = parseDateValue(value);
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState(toDisplayValue(value));
  const [visibleMonth, setVisibleMonth] = useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  );
  const rootRef = useRef(null);

  const today = startOfToday();
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const canMovePrevious = visibleMonth > currentMonth;
  const days = useMemo(() => buildCalendarDays(visibleMonth), [visibleMonth]);
  const manualDate = parseManualDate(draft);
  const isManualInvalid = Boolean(draft.trim()) && (!manualDate || manualDate < today);

  useEffect(() => {
    setDraft(toDisplayValue(value));
  }, [value]);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);

  const moveMonth = (delta) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  };

  const chooseDate = (date) => {
    const dateValue = toDateValue(date);
    onChange(dateValue);
    setDraft(toDisplayValue(dateValue));
    setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    setIsOpen(false);
  };

  const handleManualChange = (event) => {
    const nextDraft = event.target.value;
    const parsed = parseManualDate(nextDraft);
    setDraft(nextDraft);

    if (!nextDraft.trim()) {
      onChange("");
      return;
    }

    if (parsed && parsed >= today) {
      onChange(toDateValue(parsed));
      setVisibleMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1));
      return;
    }

    onChange("");
  };

  return (
    <section className={`picker-shell date-picker ${isOpen ? "is-open" : ""}`} ref={rootRef}>
      <label className="picker-field">
        <span>
          <FaIcon name="calendar" />
          {label}
        </span>
        <div className={isManualInvalid ? "picker-control invalid" : "picker-control"}>
          <input
            value={draft}
            onChange={handleManualChange}
            onFocus={() => setIsOpen(true)}
            inputMode="numeric"
            placeholder="дд.мм.гггг"
            aria-invalid={isManualInvalid}
          />
          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            aria-expanded={isOpen}
            aria-label="Открыть календарь"
          >
            <FaIcon name={isOpen ? "xmark" : "calendar"} />
          </button>
        </div>
      </label>

      {isOpen && (
        <div className="picker-dropdown">
          <section className="picker-panel" aria-label={label}>
            <div className="picker-title">
              <span>
                <FaIcon name="calendar" />
                календарь
              </span>
              <strong>{monthNames[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}</strong>
            </div>

            <div className="calendar-header">
              <button
                type="button"
                onClick={() => moveMonth(-1)}
                aria-label="Предыдущий месяц"
                disabled={!canMovePrevious}
              >
                <FaIcon name="back" />
              </button>
              <button type="button" onClick={() => moveMonth(1)} aria-label="Следующий месяц">
                <FaIcon name="arrow" />
              </button>
            </div>

            <div className="weekday-grid" aria-hidden="true">
              {weekdays.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className="day-grid-custom">
              {days.map((day) => {
                const dateValue = toDateValue(day);
                const isSelected = dateValue === value;
                const isOutside = day.getMonth() !== visibleMonth.getMonth();
                const isPast = day < today;

                return (
                  <button
                    className={[
                      "day-cell",
                      isSelected ? "selected" : "",
                      isOutside ? "outside" : "",
                    ].filter(Boolean).join(" ")}
                    disabled={isPast}
                    key={dateValue}
                    onClick={() => chooseDate(day)}
                    type="button"
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {isManualInvalid && (
        <p className="picker-hint">Введи дату не раньше сегодняшней: например 27.06.2026</p>
      )}
    </section>
  );
}
