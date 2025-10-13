// src/pages/DashboardPrinc.jsx
import React from "react";
import Header from "../components/Header";
import "../Styles/DashboardPrinc.css"

const DashboardPrinc = () => {
  return (
    <div>
      <Header></Header>
      <h1>Bienvenido al Dashboard</h1>
      <p>Has iniciado sesión correctamente 🎉</p>
    </div>
  );
};

export default DashboardPrinc;
