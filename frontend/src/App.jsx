import { useMemo, useState } from "react";

import { ConfirmStep } from "./components/ConfirmStep.jsx";
import { ConfettiRain } from "./components/ConfettiRain.jsx";
import { DateTimeStep } from "./components/DateTimeStep.jsx";
import { FoodStep } from "./components/FoodStep.jsx";
import { FloatingDecor } from "./components/FloatingDecor.jsx";
import { QuestionStep } from "./components/QuestionStep.jsx";
import { SuccessStep } from "./components/SuccessStep.jsx";
import { inviteCopy } from "./content.js";
import { errorText } from "./lib/errors.js";
import { formatDateRu } from "./lib/format.js";


const steps = ["question", "confirm", "dateTime", "food"];
const totalSteps = steps.length;


function App() {
  const [stepIndex, setStepIndex] = useState(0);
  const [noClicks, setNoClicks] = useState(0);
  const [date, setDate] = useState(inviteCopy.defaultDate);
  const [time, setTime] = useState(inviteCopy.defaultTime);
  const [food, setFood] = useState(inviteCopy.foodOptions[0].value);
  const [note, setNote] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const selectedFood = useMemo(
    () => inviteCopy.foodOptions.find((option) => option.value === food) || inviteCopy.foodOptions[0],
    [food],
  );

  const goToStep = (index) => {
    const nextIndex = Math.max(0, Math.min(totalSteps - 1, index));
    setStepIndex(nextIndex);
  };

  const goNext = () => {
    goToStep(stepIndex + 1);
  };

  const goBack = () => {
    goToStep(stepIndex - 1);
  };

  const playNo = () => {
    setNoClicks((current) => current + 1);
  };

  const chooseFood = (value) => {
    setFood(value);
  };

  const submit = async (event) => {
    event.preventDefault();
    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/response/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answer: "yes",
          date,
          time,
          food: selectedFood.label,
          note,
          website,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "send_failed");
      }

      setStatus("sent");
    } catch (sendError) {
      setStatus("idle");
      setError(errorText(sendError.message));
    }
  };

  return (
    <main className="app-shell">
      <div className="pink-noise" aria-hidden="true" />
      <FloatingDecor />
      <ConfettiRain active={status === "sent"} />

      {status === "sent" ? (
        <SuccessStep
          copy={inviteCopy}
          dateText={formatDateRu(date)}
          food={selectedFood}
          time={time}
        />
      ) : (
        <>
          {steps[stepIndex] === "question" && (
            <QuestionStep
              canBack={stepIndex > 0}
              copy={inviteCopy.ask}
              noClicks={noClicks}
              onBack={goBack}
              onNo={playNo}
              onYes={goNext}
              stepIndex={stepIndex}
              totalSteps={totalSteps}
            />
          )}
          {steps[stepIndex] === "confirm" && (
            <ConfirmStep
              canBack={stepIndex > 0}
              copy={inviteCopy.confirm}
              onBack={goBack}
              onConfirm={goNext}
              stepIndex={stepIndex}
              totalSteps={totalSteps}
            />
          )}
          {steps[stepIndex] === "dateTime" && (
            <DateTimeStep
              canBack={stepIndex > 0}
              copy={inviteCopy.dateTime}
              date={date}
              onBack={goBack}
              setDate={setDate}
              setTime={setTime}
              stepIndex={stepIndex}
              time={time}
              totalSteps={totalSteps}
              onNext={goNext}
            />
          )}
          {steps[stepIndex] === "food" && (
            <FoodStep
              canBack={stepIndex > 0}
              copy={inviteCopy.food}
              error={error}
              food={food}
              foodOptions={inviteCopy.foodOptions}
              note={note}
              onBack={goBack}
              onFoodChange={chooseFood}
              setNote={setNote}
              setWebsite={setWebsite}
              status={status}
              stepIndex={stepIndex}
              totalSteps={totalSteps}
              website={website}
              onSubmit={submit}
            />
          )}
        </>
      )}
    </main>
  );
}


export default App;
