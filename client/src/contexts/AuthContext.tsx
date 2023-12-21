import React, { createContext, useState } from "react";

type User = {
  user_id: number;
  email: string;
};

export type Token = {
  userInfo: User;
  accessToken: string;
};

export type AuthContextType = {
  auth: Token | null;
  setAuth: React.Dispatch<React.SetStateAction<Token | null>>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [auth, setAuth] = useState<Token | null>(null);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
