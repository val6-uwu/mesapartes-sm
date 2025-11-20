import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { db } from "../../data/Firebase/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp,
} from "firebase/firestore";
import "../Styles/HistorialMov.css";

const HistorialMov = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [movimientos, setMovimientos] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const handleToggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  // 🔹 Función para obtener historial con filtro opcional de fechas
  const obtenerHistorial = async () => {
    try {
      let q;
      const historialRef = collection(db, "historial");

      if (fechaInicio && fechaFin) {
        const inicio = Timestamp.fromDate(new Date(fechaInicio + "T00:00:00"));
        const fin = Timestamp.fromDate(new Date(fechaFin + "T23:59:59"));

        q = query(
          historialRef,
          where("fecha", ">=", inicio),
          where("fecha", "<=", fin),
          orderBy("fecha", "desc")
        );
      } else {
        q = query(historialRef, orderBy("fecha", "desc"));
      }

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMovimientos(data);
    } catch (error) {
      console.error("Error al obtener historial:", error);
    }
  };

  // 🔹 Cargar historial inicialmente y cada vez que cambian las fechas
  useEffect(() => {
    obtenerHistorial();
  }, [fechaInicio, fechaFin]);

  return (
    <div className="historial-page">
      <Header onToggleSidebar={handleToggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />

      <main className="historial-content">
        <h2>Historial de Movimientos</h2>

        {/* Filtro por fecha */}
        <div className="filtro-fechas">
          <label>
            Desde:{" "}
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </label>
          <label>
            Hasta:{" "}
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </label>
          <button onClick={obtenerHistorial}>Filtrar</button>
        </div>

        <table className="tabla-historial">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Usuario</th>
              <th>Acción</th>
              <th>Área Asignada</th>
              <th>Prioridad</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.length > 0 ? (
              movimientos.map((mov) => (
                <tr key={mov.id}>
                  <td>
                    {mov.fecha?.toDate
                      ? mov.fecha.toDate().toLocaleString()
                      : "—"}
                  </td>
                  <td>{mov.usuario || "—"}</td>
                  <td>{mov.accion || "—"}</td>
                  <td>
                    {mov.areaAsignada
                      ? `${mov.areaAsignada.area || "—"}${
                          mov.areaAsignada.eArea
                            ? ` (${mov.areaAsignada.eArea})`
                            : ""
                        }`
                      : "—"}
                  </td>
                  <td>{mov.prioridad || "—"}</td>
                  <td>{mov.observaciones || "—"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No hay movimientos registrados aún
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default HistorialMov;
