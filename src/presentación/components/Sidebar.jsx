// src/components/Sidebar.jsx
import React from "react";
import "../Styles/Sidebar.css";
import { FaTimes, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../data/Firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import logo from "../../assets/logo-san-miguel.jpg"

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const user = auth.currentUser;

    try {
      // 🔹 Guardar el evento en tu colección "historial"
      if (user) {
        await addDoc(collection(db, "historial"), {
          accion: "cierre de sesion",
          usuario: user.email || "Usuario desconocido",
          fecha: serverTimestamp(),
          tramite: null,
          estado: null,
          prioridad: null,
          areaAsignada: null,
          expediente: null,
          observaciones: "El usuario cerró sesión",
        });
      }

      // 🔹 Cerrar sesión
      await signOut(auth);

      // 🔹 Redirigir al login y bloquear navegación atrás
      navigate("/", { replace: true });
      window.history.pushState(null, "", "/");
      window.onpopstate = () => navigate("/", { replace: true });
    } catch (error) {
      console.error("Error al registrar o cerrar sesión:", error);
    }
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <div className="Logo">
          <img src={logo} alt="Logo San Miguel" className="logo" />
        </div>
        <div className="Logo-nombre">
          <h3>Mesa de Partes - San Miguel</h3>
          <FaTimes className="close-icon" onClick={onClose} />
        </div>
      </div>
      <ul className="sidebar-menu">
        <li><Link to="/DashboardPrinc" onClick={onClose}>Inicio</Link></li>
        <li><Link to="/Reportes" onClick={onClose}>Reportes</Link></li>
        <li><Link to="/HistorialMov" onClick={onClose}>Historial</Link></li>
      </ul>

      <div className="logout-section">
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
