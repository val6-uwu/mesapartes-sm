import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../presentación/pages/Login";
import DashboardPrinc from "../presentación/pages/DashboardPrinc";
import HistorialMov from "./pages/HistorialMov";
import Reportes from "./pages/Reportes";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardArea from "./pages/DashboardArea";
import AccesoDenegado from "./pages/AccesoDenegado";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {/* Rutas protegidas para Admin (Mesa de Partes) */}
      <Route
        path="/DashboardPrinc"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardPrinc />
          </ProtectedRoute>
        }
      />
      <Route
        path="/HistorialMov"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <HistorialMov />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Reportes"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Reportes />
          </ProtectedRoute>
        }
      />
      {/* Rutas protegidas para cada área */}
      <Route
        path="/dashboard-secretaria"
        element={
          <ProtectedRoute allowedRoles={["secretaria"]}>
            <DashboardArea nombreArea="Secretaría" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard-subdireccion"
        element={
          <ProtectedRoute allowedRoles={["subdireccion"]}>
            <DashboardArea nombreArea="Subdirección" />
          </ProtectedRoute>
        }
      />

      {/* Ruta de acceso denegado */}
      <Route path="/acceso-denegado" element={<AccesoDenegado />} />
    </Routes>
  );
}

export default App;
