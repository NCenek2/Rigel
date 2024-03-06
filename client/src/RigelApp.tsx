import React from "react";
import { Route, Routes } from "react-router";
import "./RigelInit.css";
import "./Rigel.css";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Main from "./components/authenticated/Main";
import Login from "./components/Login";
import NotFound from "./components/NotFound";
import RequireAuth from "./components/RequireAuth";
import Register from "./components/Register";

function RigelApp() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route element={<RequireAuth />}>
            <Route path="/main" element={<Main />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <div className="star"></div>
    </>
  );
}

export default RigelApp;
