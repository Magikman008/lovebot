import { CardShell } from "./CardShell.jsx";
import { GifPlaceholder } from "./GifPlaceholder.jsx";
import { FaIcon } from "../lib/faIcons.jsx";


export function ConfirmStep({
  canBack,
  copy,
  onBack,
  onConfirm,
  stepIndex,
  totalSteps,
}) {
  return (
    <CardShell
      canBack={canBack}
      className="compact-card"
      onBack={onBack}
      stepIndex={stepIndex}
      totalSteps={totalSteps}
    >
      <GifPlaceholder tone="hug" />
      <div className="copy-block">
        <h1>{copy.title}</h1>
        <p>{copy.lead}</p>
      </div>
      <button className="primary-action" type="button" onClick={onConfirm}>
        <FaIcon name="check" />
        {copy.button}
      </button>
    </CardShell>
  );
}
