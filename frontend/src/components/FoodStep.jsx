import { CardShell } from "./CardShell.jsx";
import { FaIcon } from "../lib/faIcons.jsx";


export function FoodStep({
  canBack,
  copy,
  error,
  food,
  foodOptions,
  note,
  onBack,
  onFoodChange,
  onSubmit,
  setNote,
  setWebsite,
  status,
  stepIndex,
  totalSteps,
  website,
}) {
  const selected = foodOptions.find((option) => option.value === food) || foodOptions[0];
  const selectedCaption = copy.captions[selected.value];

  return (
    <CardShell
      canBack={canBack}
      className="food-card"
      onBack={onBack}
      stepIndex={stepIndex}
      totalSteps={totalSteps}
    >
      <div className="copy-block tight">
        <h1>{copy.title}</h1>
        <p>{copy.lead}</p>
      </div>

      <form className="food-form" onSubmit={onSubmit}>
        <div className="food-grid">
          {foodOptions.map((option) => (
            <button
              className={food === option.value ? "food-option selected" : "food-option"}
              type="button"
              onClick={() => onFoodChange(option.value)}
              key={option.value}
            >
              <span className="food-icon" aria-hidden="true">
                <FaIcon name={option.icon} />
              </span>
              <span>{option.label}</span>
              {food === option.value && (
                <span className="selected-mark" aria-hidden="true">
                  <FaIcon name="check" />
                </span>
              )}
            </button>
          ))}
        </div>

        <p className="food-caption">
          {copy.selectedPrefix}: {selected.label}, {selectedCaption}
        </p>

        <label className="note-label">
          <span>Если хочешь что-то добавить</span>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Например: хочу погулять после еды"
          />
        </label>

        <label className="honeypot" aria-hidden="true">
          Website
          <input
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button className="primary-action" type="submit" disabled={status === "sending"}>
          <FaIcon name="plane" />
          {status === "sending" ? "Отправляю..." : copy.button}
        </button>
      </form>
    </CardShell>
  );
}
