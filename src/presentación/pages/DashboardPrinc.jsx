import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import "../Styles/DashboardPrinc.css";
import TarjetRes from "../components/TarjetasResumen";
import { FaEye, FaEllipsisH } from "react-icons/fa";
import DetalleDocumento from "../components/DetalleDocumento";
import ModalRechazo from "../components/ModalRechazo";
import { listenTramites, updateTramite } from "../../core/services/tramitesService";
import BarraBusqueda from "../components/BarraBusqueda";

const DashboardPrinc = () => {
  const [documentos, setDocumentos] = useState([]);
  const [documentosFiltrados, setDocumentosFiltrados] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [mostrarRechazo, setMostrarRechazo] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  // 🔹 Cargar documentos desde Firestore
  useEffect(() => {
  const unsubscribe = listenTramites((data) => {
    setDocumentos(data);
  });
  return () => unsubscribe();
}, []);


  // 🔹 Rechazar documento
  const handleConfirmar = async (observacionTexto) => {
    if (selectedDoc) {
      await updateTramite(selectedDoc.id, {
        estado: "Rechazado",
        observacion: observacionTexto || "",
      });
    }
    setMostrarRechazo(false);
    setSelectedDoc(null);
  };

  // 🔹 Abrir modal de rechazo
  const handleAbrirRechazo = (doc) => {
    setSelectedDoc(doc);
    setMostrarRechazo(doc);
  };

  // 🔹 Filtrar por estado (aplicado sobre los documentos filtrados por búsqueda)
  const documentosVisibles = documentosFiltrados.filter((doc) => {
    if (filtroEstado === "Todos") return true;
    if (filtroEstado === "Pendiente") return doc.estado === "Pendiente";
    return doc.estado === filtroEstado;
  });

  return (
    <div className="dashboard-container">
      <Header />

      <main className="dashboard-content">
        {/* Tarjetas resumen dinámicas */}
        <TarjetRes documentos={documentos} />

        {/* Barra de búsqueda y filtro por estado */}
        <section className="filters-section">
          <BarraBusqueda documentos={documentos} onFiltrar={setDocumentosFiltrados} />

          <select
            className="status-filter"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="Todos">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Aceptado">Aceptado</option>
            <option value="Rechazado">Rechazado</option>
          </select>
        </section>

        {/* Tabla de documentos */}
        <section className="table-section">
          <table className="doc-table">
            <thead>
              <tr>
                <th>CÓDIGO</th>
                <th>TIPO DE DOCUMENTO</th>
                <th>FECHA</th>
                <th>PRIORIDAD</th>
                <th>ESTADO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>

            <tbody>
              {documentosVisibles.map((doc) => {
                const fut = doc.datosFUT || {};
                return (
                  <tr key={doc.id}>
                    <td>SM-{doc.id || "—"}</td>
                    <td>{doc.tipoTramite || "—"}</td>
                    <td>{fut.fecha || "—"}</td>
                    <td>
                      <span className={`tag ${(doc.prioridad || "Asignar")
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                      }`}
                      >
                        {doc.prioridad || "Asignar"}</span>
                    </td>
                    <td>
                      <span
                        className={`status ${
                          (doc.estado || "Pendiente")
                            .toLowerCase()
                            .replace(/\s+/g, "-")
                        }`}
                      >
                        {doc.estado || "Pendiente"}
                      </span>
                    </td>
                    <td className="actions">
                      {doc.estado !== "Rechazado" && doc.estado !=="Aceptado" && (
                        <button
                          className="view-btn"
                          onClick={() => setSelectedDoc(doc)}
                        >
                          <FaEye className="view-icon" /> Ver
                        </button>
                      )}
                      <button
                        className="btn-opciones"
                        onClick={() => handleAbrirRechazo(doc)}
                      >
                        <FaEllipsisH className="menu-icon" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </main>

      {/* Modal Detalle */}
      {selectedDoc && !mostrarRechazo && (
        <DetalleDocumento
          documento={selectedDoc}
          onClose={() => setSelectedDoc(null)}
        />
      )}

      {/* Modal Rechazo */}
      {mostrarRechazo && (
        <ModalRechazo
          documento={selectedDoc}
          onClose={() => setMostrarRechazo(false)}
          onConfirm={handleConfirmar}
        />
      )}
    </div>
  );
};

export default DashboardPrinc;
