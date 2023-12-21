import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="not-found">
      <h1>Not Found</h1>
      <Link className="btn btn-ddark" to="/">
        To Home
      </Link>
    </section>
  );
};

export default NotFound;
