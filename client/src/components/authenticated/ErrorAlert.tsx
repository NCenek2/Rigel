import React, { Dispatch, SetStateAction } from "react";

type ErrorAlertProps = {
  errorMessage: string;
  setShowErrorMessage: Dispatch<SetStateAction<boolean>>;
};

const ErrorAlert = ({ errorMessage, setShowErrorMessage }: ErrorAlertProps) => {
  return (
    <div
      className="alert alert-danger text-center alert-dismissible fade show error-alert"
      role="alert"
    >
      {errorMessage}
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        onClick={() => setShowErrorMessage(false)}
      ></button>
    </div>
  );
};

export default ErrorAlert;
