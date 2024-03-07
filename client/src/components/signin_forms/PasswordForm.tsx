import React from "react";
import { DECK_MIN_LENGTH } from "../../constants";

type PasswordData = {
  password: string;
};

type PasswordDataProps = PasswordData & {
  updateFields: (fields: Partial<PasswordData>) => void;
};

export function PasswordForm({ password, updateFields }: PasswordDataProps) {
  return (
    <>
      <label htmlFor="password" className="form-group">
        Password
      </label>
      <input
        id="password"
        type="password"
        className="form-control mb-2"
        required={true}
        minLength={DECK_MIN_LENGTH}
        value={password}
        onChange={(e) => updateFields({ password: e.target.value })}
      />
    </>
  );
}
