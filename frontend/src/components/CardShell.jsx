import { StepProgress } from "./StepProgress.jsx";
import { StepNavigator } from "./StepNavigator.jsx";


export function CardShell({
  canBack = false,
  children,
  className = "",
  onBack,
  stepIndex,
  totalSteps,
}) {
  return (
    <section className={`date-card ${className}`.trim()}>
      {typeof stepIndex === "number" && (
        <StepProgress current={stepIndex} total={totalSteps} />
      )}
      {children}
      {canBack && (
        <StepNavigator
          canBack={canBack}
          onBack={onBack}
        />
      )}
    </section>
  );
}
