import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "../api/axios";
import { AuthContextType } from "../contexts/AuthContext";
import useAuth from "../hooks/useAuth";
import ErrorAlert from "./authenticated/ErrorAlert";

type LoginInfo = {
  email: string;
  password: string;
};

const LOGIN_DATA: LoginInfo = {
  email: "",
  password: "",
};

const Login = () => {
  const { setAuth } = useAuth() as AuthContextType;

  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const [loginInfo, setLoginInfo] = useState<LoginInfo>(LOGIN_DATA);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/main";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setLoginInfo((data) => {
      return {
        ...data,
        [id]: value,
      };
    });
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    login();
  };

  const login = async () => {
    try {
      const result = await axios({
        url: "/auth/login",
        method: "post",
        data: loginInfo,
      });

      if (result?.status === 200) {
        setShowErrorMessage(false);
        setAuth(result.data);
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      if (err?.response?.status) {
        setShowErrorMessage(true);
        if (err?.response?.status === 400) {
          setErrorMessage("Missing Username or Password!");
        } else if (err?.response?.status === 401) {
          setErrorMessage("Unauthorized!");
        } else {
          setErrorMessage("Login Failed!");
        }
      } else {
        setErrorMessage("Cannot Connect to the Server!");
      }
      return err.response;
    }
  };
  return (
    <>
      {showErrorMessage && (
        <ErrorAlert
          errorMessage={errorMessage}
          setShowErrorMessage={setShowErrorMessage}
        />
      )}
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            value={loginInfo.email}
            onChange={handleChange}
          />
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="form-control mb-2"
            placeholder="Password"
            minLength={10}
            value={loginInfo.password}
            onChange={handleChange}
          />
          <button
            className="btn btn-outline-light w-100 mb-1"
            disabled={!loginInfo.email || !loginInfo.password}
          >
            Login
          </button>
        </form>
        <div className="login-links">
          <Link to="/register" className="btn btn-link text-decoration-none">
            Register
          </Link>
          <Link to="" className="btn btn-link text-decoration-none">
            Forgot Password
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
