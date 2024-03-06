import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuthService from "../hooks/services/useAuthService";
import { ROUTE_PREFIX } from "../constants";

export type LoginInfo = {
  email: string;
  password: string;
};

const LOGIN_DATA: LoginInfo = {
  email: "",
  password: "",
};

const Login = () => {
  const { login } = useAuthService();

  const [loginInfo, setLoginInfo] = useState<LoginInfo>(LOGIN_DATA);

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
    await login(loginInfo);
  };

  return (
    <>
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
          <Link
            to={`${ROUTE_PREFIX}/register`}
            className="btn btn-link text-decoration-none"
          >
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
