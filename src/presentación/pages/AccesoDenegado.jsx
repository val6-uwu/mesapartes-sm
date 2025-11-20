import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../data/Firebase/firebaseConfig";

const AccesoDenegado = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f8f9fc",
        fontFamily: "Poppins, sans-serif",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "3rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          maxWidth: "500px",
        }}
      >
        <div style={{ fontSize: "80px", marginBottom: "1rem" }}>🚫</div>
        <h1 style={{ fontSize: "2rem", color: "#e53e3e", marginBottom: "1rem" }}>
          Acceso Denegado
        </h1>
        <p style={{ fontSize: "1rem", color: "#666", marginBottom: "2rem" }}>
          No tienes permiso para acceder a esta página. Por favor, contacta al
          administrador del sistema si crees que esto es un error.
        </p>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#4b0000",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer",
            fontWeight: "600",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#700000")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#4b0000")}
        >
          Volver al Login
        </button>
      </div>
    </div>
  );
};

export default AccesoDenegado;