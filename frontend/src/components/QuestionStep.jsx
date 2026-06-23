import { useState } from "react";

import { CardShell } from "./CardShell.jsx";
import { GifPlaceholder } from "./GifPlaceholder.jsx";
import { FaIcon } from "../lib/faIcons.jsx";


export function QuestionStep({
  canBack,
  copy,
  noClicks,
  onBack,
  onNo,
  onYes,
  stepIndex,
  totalSteps,
}) {
  const [dodgeIndex, setDodgeIndex] = useState(0);
  const reply = copy.noReplies[Math.min(noClicks - 1, copy.noReplies.length - 1)];
  const noTurnsIntoYes = noClicks >= 3;
  const noButtonText = noTurnsIntoYes ? "Ладно, да" : reply || copy.no;

  const dodgeMouse = (event) => {
    if (event.pointerType === "mouse" && !noTurnsIntoYes) {
      setDodgeIndex((current) => (current % 5) + 1);
    }
  };

  return (
    <CardShell
      canBack={canBack}
      className="compact-card"
      onBack={onBack}
      stepIndex={stepIndex}
      totalSteps={totalSteps}
    >
      <GifPlaceholder tone="flower" />
      <div className="copy-block">
        <h1>{copy.title}</h1>
        <p>{copy.lead}</p>
      </div>
      <p className="fine-print">{copy.finePrint}</p>
      <div className="decision-buttons">
        <button className="primary-action" type="button" onClick={onYes}>
          <FaIcon name="heart" />
          {copy.yes}
        </button>
        <button
          className={[
            "secondary-action",
            "no-button",
            `no-try-${Math.min(noClicks, 3)}`,
            `no-dodge-${dodgeIndex}`,
          ].join(" ")}
          type="button"
          onPointerEnter={dodgeMouse}
          onClick={noTurnsIntoYes ? onYes : onNo}
        >
          <FaIcon name={noTurnsIntoYes ? "check" : "xmark"} />
          <span>{noButtonText}</span>
        </button>
      </div>
    </CardShell>
  );
}
