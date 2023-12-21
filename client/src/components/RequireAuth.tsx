import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { AuthContextType } from "../contexts/AuthContext";
import useAuth from "../hooks/useAuth";

const RequireAuth = () => {
  const { auth } = useAuth() as AuthContextType;
  const location = useLocation();

  return auth ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
