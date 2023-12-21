import React from "react";
import { Link } from "react-router-dom";
import { AuthContextType } from "../contexts/AuthContext";
import useAuth from "../hooks/useAuth";

const Header = () => {
  const { auth, setAuth } = useAuth() as AuthContextType;

  return (
    <nav className="navbar navbar-dark header-color sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Rigel
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasDarkNavbar"
          aria-controls="offcanvasDarkNavbar"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="offcanvas offcanvas-end sidebar-color"
          tabIndex={-1}
          id="offcanvasDarkNavbar"
          aria-labelledby="offcanvasDarkNavbarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">
              Details
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li className="nav-item">
                <Link
                  className="nav-link white-smoke"
                  aria-current="page"
                  to="/"
                >
                  Home
                </Link>
              </li>
              {auth && (
                <li className="nav-item">
                  <Link
                    className="nav-link white-smoke"
                    aria-current="page"
                    to="/main"
                  >
                    Main
                  </Link>
                </li>
              )}
              <li className="nav-item">
                {auth ? (
                  <Link
                    className="nav-link white-smoke"
                    onClick={() => setAuth(null)}
                    to="/login"
                  >
                    Log Out
                  </Link>
                ) : (
                  <Link className="nav-link white-smoke" to="/login">
                    Login
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
