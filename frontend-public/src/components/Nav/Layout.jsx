// src/components/layout/Layout.jsx
import React from "react";
import Nav from "../Nav/Nav";

const Layout = ({ children }) => {
  return (
    <>
      <Nav />
      <main style={{ marginTop: "70px" }}>
        {children}
      </main>
    </>
  );
};

export default Layout;
