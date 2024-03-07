import React, { useState } from "react";
import { useMultistepForm } from "../hooks/useMultistepForm";
import { EmailForm } from "./signin_forms/EmailForm";
import { PasswordForm } from "./signin_forms/PasswordForm";
import { Password2Form } from "./signin_forms/Password2Form";
import { useAlert } from "../hooks/useAlert";
import useUserService from "../hooks/services/useUserService";
import { DECK_MIN_LENGTH } from "../constants";

type FormData = {
  email: string;
  password: string;
  password2: string;
};

const INITIAL_DATA: FormData = {
  email: "",
  password: "",
  password2: "",
};

const SignUp = () => {
  const [data, setData] = useState(INITIAL_DATA);
  const { setAlert } = useAlert();
  const { register } = useUserService();

  function updateFields(fields: Partial<FormData>) {
    setData((prev) => {
      return { ...prev, ...fields };
    });
  }

  const { steps, currentStepIndex, step, isFirstStep, back, next, isLastStep } =
    useMultistepForm([
      <EmailForm {...data} updateFields={updateFields} />,
      <PasswordForm {...data} updateFields={updateFields} />,
      <Password2Form {...data} updateFields={updateFields} />,
    ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLastStep) {
      return next();
    }

    const { email, password, password2 } = data;

    if (email.trim() === "") {
      setAlert("Email cannot be empty");
      return;
    }

    if (password.trim() !== password2.trim()) {
      setAlert("Passwords do not match");
      return;
    }

    if (password.length < DECK_MIN_LENGTH) {
      setAlert(`Password is must be at least ${DECK_MIN_LENGTH} character`);
      return;
    }

    await register(email.trim(), password.trim());
  };

  return (
    <>
      <div className="form-container">
        <div
          style={{
            position: "relative",
            background: "transparent",
            border: "1px solid white",
            padding: "2rem",
            borderRadius: "0.5rem",
            fontFamily: "Ariel",
            color: "white",
          }}
        >
          <form onSubmit={handleSubmit}>
            <div
              style={{
                position: "absolute",
                top: "0.5rem",
                right: "0.5rem",
              }}
            >
              {currentStepIndex + 1} / {steps.length}
            </div>
            {step}
            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                gap: "0.5rem",
                justifyContent: "flex-end",
              }}
            >
              {!isFirstStep && (
                <button
                  type="button"
                  onClick={back}
                  className="btn btn-sm btn-outline-light"
                >
                  Back
                </button>
              )}
              <button type="submit" className="btn btn-sm btn-outline-light">
                {isLastStep ? "Submit" : "Next"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
