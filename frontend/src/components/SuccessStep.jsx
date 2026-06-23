import { FaIcon } from "../lib/faIcons.jsx";


export function SuccessStep({ copy, dateText, food, time }) {
  return (
    <section className="date-card success-card" aria-live="polite">
      <span className="success-badge">
        <FaIcon name="check" />
        {copy.success.badge}
      </span>
      <div className="success-visual" aria-hidden="true">
        <FaIcon name={food.icon} />
        <span>
          <FaIcon name="heart" />
        </span>
      </div>
      <div className="copy-block">
        <h1>{copy.success.title}</h1>
        <p>
          {copy.success.leadPrefix} {dateText} в {time}, {copy.success.leadSuffix}
        </p>
        <p className="success-food">
          {copy.success.foodPrefix}: {food.label.toLowerCase()}
        </p>
      </div>
    </section>
  );
}
