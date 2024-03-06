import React from "react";
import { Link } from "react-router-dom";
import { ROUTE_PREFIX } from "../constants";

const Home = () => {
  return (
    <div className="home-container">
      <h2>Welcome to Rigel</h2>
      <div className="home-btn-container">
        <Link to={`${ROUTE_PREFIX}/login`} className="btn btn-green">
          Login
        </Link>
        <Link to={`${ROUTE_PREFIX}/register`} className="btn add-color">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Home;
