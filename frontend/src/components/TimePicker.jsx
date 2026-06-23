import { useEffect, useRef, useState } from "react";

import { FaIcon } from "../lib/faIcons.jsx";


const hours = Array.from({ length: 10 }, (_, index) => String(index + 14).padStart(2, "0"));
const minutes = ["00", "10", "15", "20", "30", "40", "45", "50"];


function splitTime(value) {
  const [hour = "19", minute = "30"] = (value || "19:30").split(":");
  return { hour, minute };
}


function normalizeManualTime(value) {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) {
    return null;
  }

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) {
    return null;
  }

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}


export function TimePicker({ label, onChange, value }) {
  const { hour, minute } = splitTime(value);
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState(value || "");
  const rootRef = useRef(null);
  const manualTime = normalizeManualTime(draft);
  const isManualInvalid = Boolean(draft.trim()) && !manualTime;

  useEffect(() => {
    setDraft(value || "");
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

  const commitTime = (nextValue, close = false) => {
    onChange(nextValue);
    setDraft(nextValue);
    if (close) {
      setIsOpen(false);
    }
  };

  const setHour = (nextHour) => commitTime(`${nextHour}:${minute}`);
  const setMinute = (nextMinute) => commitTime(`${hour}:${nextMinute}`, true);

  const handleManualChange = (event) => {
    const nextDraft = event.target.value;
    const normalized = normalizeManualTime(nextDraft);
    setDraft(nextDraft);
    if (!nextDraft.trim()) {
      onChange("");
      return;
    }
    if (normalized) {
      onChange(normalized);
      return;
    }
    onChange("");
  };

  return (
    <section className={`picker-shell time-picker ${isOpen ? "is-open" : ""}`} ref={rootRef}>
      <label className="picker-field">
        <span>
          <FaIcon name="clock" />
          {label}
        </span>
        <div className={isManualInvalid ? "picker-control invalid" : "picker-control"}>
          <input
            value={draft}
            onChange={handleManualChange}
            onFocus={() => setIsOpen(true)}
            inputMode="numeric"
            placeholder="19:30"
            aria-invalid={isManualInvalid}
          />
          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            aria-expanded={isOpen}
            aria-label="Открыть выбор времени"
          >
            <FaIcon name={isOpen ? "xmark" : "clock"} />
          </button>
        </div>
      </label>

      {isOpen && (
        <div className="picker-dropdown">
          <section className="picker-panel" aria-label={label}>
            <div className="picker-title">
              <span>
                <FaIcon name="clock" />
                время
              </span>
              <strong>{hour}:{minute}</strong>
            </div>

            <div className="time-columns">
              <div className="time-column" aria-label="Часы">
                {hours.map((option) => (
                  <button
                    className={option === hour ? "time-cell selected" : "time-cell"}
                    type="button"
                    onClick={() => setHour(option)}
                    key={option}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="time-divider" aria-hidden="true">:</div>

              <div className="time-column" aria-label="Минуты">
                {minutes.map((option) => (
                  <button
                    className={option === minute ? "time-cell selected" : "time-cell"}
                    type="button"
                    onClick={() => setMinute(option)}
                    key={option}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {isManualInvalid && <p className="picker-hint">Формат времени: 19:30</p>}
    </section>
  );
}
