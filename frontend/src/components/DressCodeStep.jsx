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
            className={dressCode === option.value ? "dress-option selected" : "dress-option"}
            type="button"
            onClick={() => onDressCodeChange(option.value)}
            key={option.value}
          >
            <span className="dress-icon" aria-hidden="true">
              <FaIcon name={option.icon} />
            </span>
            <span>{option.label}</span>
            <small>{option.caption}</small>
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
