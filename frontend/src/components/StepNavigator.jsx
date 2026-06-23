import { FaIcon } from "../lib/faIcons.jsx";


export function StepNavigator({ canBack, onBack }) {
  return (
    <div className="step-navigator" aria-label="Навигация по шагам">
      <button type="button" onClick={onBack} disabled={!canBack}>
        <FaIcon name="back" />
        Назад
      </button>
    </div>
  );
}
