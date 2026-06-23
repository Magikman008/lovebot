import { CardShell } from "./CardShell.jsx";
import { DatePicker } from "./DatePicker.jsx";
import { GifPlaceholder } from "./GifPlaceholder.jsx";
import { TimePicker } from "./TimePicker.jsx";
import { FaIcon } from "../lib/faIcons.jsx";


export function DateTimeStep({
  canBack,
  copy,
  date,
  onBack,
  onNext,
  setDate,
  setTime,
  stepIndex,
  time,
  totalSteps,
}) {
  const canContinue = date && time;

  return (
    <CardShell
      canBack={canBack}
      className="date-time-card"
      onBack={onBack}
      stepIndex={stepIndex}
      totalSteps={totalSteps}
    >
      <GifPlaceholder tone="flower" />
      <form
        className="date-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (canContinue) {
            onNext();
          }
        }}
      >
        <p className="form-lead">{copy.lead}</p>
        <h1>{copy.title}</h1>

        <DatePicker label={copy.dateLabel} value={date} onChange={setDate} />
        <TimePicker label={copy.timeLabel} value={time} onChange={setTime} />

        <button className="primary-action" type="submit" disabled={!canContinue}>
          {copy.button}
          <FaIcon name="arrow" />
        </button>
      </form>
    </CardShell>
  );
}
