import React, { ReactNode, createContext, useState } from "react";

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

const useAuthContext = () => {
  const [auth, setAuth] = useState<Token | null>(null);
  return { auth, setAuth };
};

export type UseAuthContextType = ReturnType<typeof useAuthContext>;

const useAuthContextType = {
  auth: null,
  setAuth: () => {},
};

const AuthContext = createContext<UseAuthContextType>(useAuthContextType);

type ChildrenType = {
  children?: ReactNode | ReactNode[];
};

export const AuthProvider = ({ children }: ChildrenType) => {
  return (
    <AuthContext.Provider value={useAuthContext()}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
