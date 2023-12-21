import React from "react";

type PasswordData = {
    password: string
}

type PasswordDataProps = PasswordData & {
    updateFields: (fields: Partial<PasswordData>) => void
}



export function PasswordForm({password, updateFields} : PasswordDataProps) {
    return <>
        <label htmlFor="password" className="form-group">Password</label>
        <input id="password" type="password" className="form-control mb-2"
               required={true} minLength={10}
               value={password} onChange={e => updateFields({password: e.target.value})}
        />
    </>

}