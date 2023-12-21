import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMultistepForm } from "../hooks/useMultistepForm";
import { EmailForm } from "./signin_forms/EmailForm";
import { PasswordForm } from "./signin_forms/PasswordForm";
import { Password2Form } from "./signin_forms/Password2Form";
import axios from "../api/axios";
import ErrorAlert from "./authenticated/ErrorAlert";

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
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLastStep) {
      return next();
    }

    if (data.password !== data.password2) {
      setErrorMessage("Passwords do not match");
      setShowErrorMessage(true);
      return;
    }

    if (data.password.length < 10) {
      setErrorMessage("Password is less than 10 character");
      setShowErrorMessage(true);
      return;
    }

    setShowErrorMessage(false);
    register();
  };

  const register = async (): Promise<any> => {
    const { email, password } = data;

    try {
      const result = await axios({
        url: "/register",
        method: "post",
        data: { email, password },
      });

      if (result?.status === 201) {
        navigate("/login");
      }
    } catch (err: any) {
      if (err?.response?.status) {
        setShowErrorMessage(true);
        if (err?.response?.status === 409) {
          setErrorMessage("User with that email alreadye exists");
        } else {
          setErrorMessage("Server is having problems. Try again later!");
        }
      } else {
        setErrorMessage("Cannot Connect to the Server! Check Connection.");
      }
      return err.response;
    }
  };

  return (
    <>
      {showErrorMessage && (
        <ErrorAlert
          errorMessage={errorMessage}
          setShowErrorMessage={setShowErrorMessage}
        />
      )}
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
