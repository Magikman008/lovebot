import { useMemo, useState } from "react";

import { ConfirmStep } from "./components/ConfirmStep.jsx";
import { ConfettiRain } from "./components/ConfettiRain.jsx";
import { DateTimeStep } from "./components/DateTimeStep.jsx";
import { DressCodeStep } from "./components/DressCodeStep.jsx";
import { FoodStep } from "./components/FoodStep.jsx";
import { FloatingDecor } from "./components/FloatingDecor.jsx";
import { QuestionStep } from "./components/QuestionStep.jsx";
import { ReviewStep } from "./components/ReviewStep.jsx";
import { SecretHeart } from "./components/SecretHeart.jsx";
import { SuccessStep } from "./components/SuccessStep.jsx";
import { inviteCopy } from "./content.js";
import { errorText } from "./lib/errors.js";
import { formatDateRu } from "./lib/format.js";


const steps = ["question", "confirm", "dateTime", "dressCode", "food", "review"];
const totalSteps = steps.length;


function App() {
  const [stepIndex, setStepIndex] = useState(0);
  const [noClicks, setNoClicks] = useState(0);
  const [date, setDate] = useState(inviteCopy.defaultDate);
  const [time, setTime] = useState(inviteCopy.defaultTime);
  const [dressCode, setDressCode] = useState(inviteCopy.dressOptions[0].value);
  const [food, setFood] = useState(inviteCopy.foodOptions[0].value);
  const [note, setNote] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const selectedFood = useMemo(
    () => inviteCopy.foodOptions.find((option) => option.value === food) || inviteCopy.foodOptions[0],
    [food],
  );
  const selectedDressCode = useMemo(
    () => inviteCopy.dressOptions.find((option) => option.value === dressCode) || inviteCopy.dressOptions[0],
    [dressCode],
  );
  const dateText = formatDateRu(date);

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
          dressCode: selectedDressCode.label,
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
      {status !== "sent" && <SecretHeart copy={inviteCopy.secret} />}

      {status === "sent" ? (
        <SuccessStep
          copy={inviteCopy}
          dateText={dateText}
          dressCode={selectedDressCode}
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
          {steps[stepIndex] === "dressCode" && (
            <DressCodeStep
              canBack={stepIndex > 0}
              copy={inviteCopy.dressCode}
              dressCode={dressCode}
              dressOptions={inviteCopy.dressOptions}
              onBack={goBack}
              onDressCodeChange={setDressCode}
              onNext={goNext}
              stepIndex={stepIndex}
              totalSteps={totalSteps}
            />
          )}
          {steps[stepIndex] === "food" && (
            <FoodStep
              canBack={stepIndex > 0}
              copy={inviteCopy.food}
              food={food}
              foodOptions={inviteCopy.foodOptions}
              note={note}
              onBack={goBack}
              onFoodChange={chooseFood}
              setNote={setNote}
              setWebsite={setWebsite}
              stepIndex={stepIndex}
              totalSteps={totalSteps}
              website={website}
              onNext={goNext}
            />
          )}
          {steps[stepIndex] === "review" && (
            <ReviewStep
              canBack={stepIndex > 0}
              copy={inviteCopy.review}
              dateText={dateText}
              dressCode={selectedDressCode}
              error={error}
              food={selectedFood}
              note={note}
              onBack={goBack}
              onSubmit={submit}
              status={status}
              stepIndex={stepIndex}
              time={time}
              totalSteps={totalSteps}
            />
          )}
        </>
      )}
    </main>
  );
}


export default App;
