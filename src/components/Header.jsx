import React from "react";
import "../Styles/Header.css";
import logo from "../assets/logo-san-miguel.jpg";

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <img src={logo} alt="Logo San Miguel" className="header-logo" />
        {/* separador vertical */}
        <div className="divider" />
        <div className="header-text">
          <h1>SAN MIGUEL</h1>
          <p>Sistema de Gestión Documental<br />Mesa de Partes</p>
        </div>
      </div>
    </header>
  );
};

export default Header;