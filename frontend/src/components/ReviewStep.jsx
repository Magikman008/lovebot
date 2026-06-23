import { CardShell } from "./CardShell.jsx";
import { FaIcon } from "../lib/faIcons.jsx";


export function ReviewStep({
  canBack,
  copy,
  dateText,
  dressCode,
  error,
  food,
  note,
  onBack,
  onSubmit,
  status,
  stepIndex,
  time,
  totalSteps,
}) {
  const rows = [
    { icon: "calendar", label: "Дата", value: dateText },
    { icon: "clock", label: "Время", value: time },
    { icon: dressCode.icon, label: "Дресс-код", value: dressCode.label },
    { icon: food.icon, label: "Еда", value: food.label },
  ];

  return (
    <CardShell
      canBack={canBack}
      className="review-card"
      onBack={onBack}
      stepIndex={stepIndex}
      totalSteps={totalSteps}
    >
      <div className="copy-block tight">
        <h1>{copy.title}</h1>
        <p>{copy.lead}</p>
      </div>

      <div className="review-list">
        {rows.map((row) => (
          <div className="review-row" key={row.label}>
            <span aria-hidden="true">
              <FaIcon name={row.icon} />
            </span>
            <div>
              <small>{row.label}</small>
              <strong>{row.value}</strong>
            </div>
          </div>
        ))}
        <div className="review-note">
          <small>Комментарий</small>
          <p>{note.trim() || copy.emptyNote}</p>
        </div>
      </div>

      <form className="review-actions" onSubmit={onSubmit}>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-action" type="submit" disabled={status === "sending"}>
          <FaIcon name="plane" />
          {status === "sending" ? copy.sending : copy.button}
        </button>
      </form>
    </CardShell>
  );
}
