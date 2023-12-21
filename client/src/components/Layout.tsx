import React from "react";
import { Outlet } from "react-router";
import Header from "./Header";

const Layout = () => {
  return (
    <React.Fragment>
      <Header />
      <Outlet />
    </React.Fragment>
  );
};

export default Layout;
