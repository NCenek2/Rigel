import React from "react";
import { Route, Routes } from "react-router";
import "./App.css";
import "./Quizlet.css";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Main from "./components/authenticated/Main";
import Login from "./components/Login";
import NotFound from "./components/NotFound";
import RequireAuth from "./components/RequireAuth";
import Register from "./components/Register";

function App() {
  return (
    <React.Fragment>
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
      <div className="star"></div>;
    </React.Fragment>
  );
}

export default App;
