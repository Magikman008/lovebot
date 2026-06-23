import { CardShell } from "./CardShell.jsx";
import { FaIcon } from "../lib/faIcons.jsx";


export function DressCodeStep({
  canBack,
  copy,
  dressCode,
  dressOptions,
  onBack,
  onDressCodeChange,
  onNext,
  stepIndex,
  totalSteps,
}) {
  return (
    <CardShell
      canBack={canBack}
      className="dress-card"
      onBack={onBack}
      stepIndex={stepIndex}
      totalSteps={totalSteps}
    >
      <div className="copy-block tight">
        <h1>{copy.title}</h1>
        <p>{copy.lead}</p>
      </div>

      <div className="dress-grid">
        {dressOptions.map((option) => (
          <button
            aria-pressed={dressCode === option.value}
            className={[
              "dress-option",
              `dress-option-${option.value}`,
              dressCode === option.value ? "selected" : "",
            ].filter(Boolean).join(" ")}
            type="button"
            onClick={() => onDressCodeChange(option.value)}
            key={option.value}
          >
            <span className="dress-icon" aria-hidden="true">
              <FaIcon name={option.icon} />
            </span>
            <span className="dress-copy">
              <strong>{option.label}</strong>
              <small>{option.caption}</small>
            </span>
            {dressCode === option.value && (
              <span className="dress-check" aria-hidden="true">
                <FaIcon name="check" />
              </span>
            )}
          </button>
        ))}
      </div>

      <button className="primary-action" type="button" onClick={onNext}>
        {copy.button}
        <FaIcon name="arrow" />
      </button>
    </CardShell>
  );
}
