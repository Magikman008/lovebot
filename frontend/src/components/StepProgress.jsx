const stepLabels = ["Вопрос", "План", "Время", "Дресс-код", "Еда", "Итоги"];


export function StepProgress({ current, total }) {
  return (
    <div
      className="step-progress"
      style={{ "--step-count": total }}
      aria-label={`Шаг ${current + 1} из ${total}`}
    >
      {Array.from({ length: total }).map((_, index) => (
        <span
          aria-current={index === current ? "step" : undefined}
          aria-label={stepLabels[index] || `шаг ${index + 1}`}
          className={index <= current ? "step-dot active" : "step-dot"}
          key={index}
        />
      ))}
    </div>
  );
}
