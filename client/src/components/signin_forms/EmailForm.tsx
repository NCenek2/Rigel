import React from "react";
import { EMAIL_MAX_LENGTH } from "../../constants";

type EmailData = {
  email: string;
};

type EmailDataProps = EmailData & {
  updateFields: (fields: Partial<EmailData>) => void;
};

export function EmailForm({ email, updateFields }: EmailDataProps) {
  return (
    <>
      <label htmlFor="email" className="form-group">
        Email
      </label>
      <input
        id="email"
        type="email"
        className="form-control mb-2 signup-input"
        required={true}
        maxLength={EMAIL_MAX_LENGTH}
        value={email}
        onChange={(e) => updateFields({ email: e.target.value })}
      />
    </>
  );
}
