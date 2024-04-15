import { useState } from "react";

export const useFormStatus = (initialStage = "") => {
  const [stage, setStage] = useState(initialStage);
  const [isSubmitting, setSubmitting] = useState(false);

  const updateStage = (newStage) => {
    setStage(newStage);
  };

  const setSubmittingState = (value) => {
    setSubmitting(value);
  };

  const resetFormStatus = () => {
    setStage(initialStage);
    setSubmitting(false);
  };

  return {
    stage,
    isSubmitting,
    updateStage,
    setSubmittingState,
    resetFormStatus,
  };
};
