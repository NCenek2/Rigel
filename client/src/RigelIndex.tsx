import React from "react";
import { AlertProvider } from "./contexts/AlertContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Route, Routes } from "react-router";
import RigelApp from "./RigelApp";

const RigelIndex = () => {
  return (
    <AlertProvider>
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<RigelApp />} />
        </Routes>
      </AuthProvider>
    </AlertProvider>
  );
};

export default RigelIndex;
