import React from "react";

type Password2Data = {
  password2: string;
};

type Password2DataProps = Password2Data & {
  updateFields: (fields: Partial<Password2Data>) => void;
};

export function Password2Form({ password2, updateFields }: Password2DataProps) {
  return (
    <>
      <label htmlFor="password2" className="form-group">
        Re-enter Password
      </label>
      <input
        id="password2"
        type="password"
        className="form-control mb-2"
        required={true}
        minLength={10}
        value={password2}
        onChange={(e) => updateFields({ password2: e.target.value })}
      />
    </>
  );
}
