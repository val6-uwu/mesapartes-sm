import React, { useState, useEffect, useMemo } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../Styles/DashboardArea.css";
import DetalleRespuestaFinal from "../components/DetalleRespuestaFinal";
import DetalleRespuesta from "../components/DetalleRespuesta";
import { listenTramites } from "../../core/services/tramitesService";

const DashboardArea = ({ nombreArea }) => {
  const [documentos, setDocumentos] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // FILTROS
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [filtroActivado, setFiltroActivado] = useState(false);

  const handleToggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  const normalize = (txt) =>
    txt
      ?.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  // Obtener documentos del área seleccionada
  useEffect(() => {
    const unsubscribe = listenTramites((data) => {
      const docsFiltrados = data.filter((doc) => {
        const rawArea =
          typeof doc.areaAsignada === "object"
            ? doc.areaAsignada?.area
            : doc.areaAsignada;

        const areaBD = rawArea ? normalize(String(rawArea)) : "";
        const areaProp = normalize(nombreArea);

        return areaBD === areaProp;
      });

      setDocumentos(docsFiltrados);
    });

    return () => unsubscribe();
  }, [nombreArea]);

  const abrirDetalle = (doc) => {
    setSelectedDoc(doc);
    setMostrarDetalle(true);
  };

  const cerrarDetalle = () => {
    setMostrarDetalle(false);
    setSelectedDoc(null);
  };

  // RESUMEN
  const resumen = useMemo(() => {
    const total = documentos.length;

    const pendientes = documentos.filter((d) => {
      const estado = d?.areaAsignada?.eArea;
      return !estado || estado === "" || estado === "Pendiente";
    }).length;

    const completados = documentos.filter(
      (d) => d?.areaAsignada?.eArea === "Completado"
    ).length;

    return { total, pendientes, completados };
  }, [documentos]);

  // DOCUMENTOS VISIBLES → VACÍO al inicio
  const documentosVisibles = useMemo(() => {
    // 👉 Antes de aplicar un filtro, la tabla se muestra vacía
    if (!filtroActivado) return [];

    const normalizarFecha = (value) => {
      if (!value) return null;
      const d = value.toDate ? value.toDate() : new Date(value);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    };

    const inicio = fechaInicio
      ? new Date(`${fechaInicio}T00:00:00`)
      : null;

    const fin = fechaFin
      ? new Date(`${fechaFin}T23:59:59`)
      : null;

    return documentos.filter((doc) => {
      const estado =
        !doc.areaAsignada?.eArea || doc.areaAsignada?.eArea === ""
          ? "Pendiente"
          : doc.areaAsignada?.eArea;

      // FILTRO POR ESTADO
      if (filtroEstado !== "Todos") {
        if (filtroEstado === "Pendiente" && estado !== "Pendiente") return false;
        if (filtroEstado === "Completado" && estado !== "Completado") return false;
      }

      // FILTRO POR FECHA
      if (inicio && fin) {
        const fechaDoc = normalizarFecha(doc.fechaAsignacion);

        // Pendientes sin fecha → se muestran
        if (!fechaDoc) return estado === "Pendiente";

        if (fechaDoc < inicio || fechaDoc > fin) return false;
      }

      return true;
    });
  }, [documentos, filtroEstado, fechaInicio, fechaFin, filtroActivado]);

  // BOTONES
  const aplicarFiltro = () => {
    if (!fechaInicio || !fechaFin) {
      alert("Debe seleccionar ambas fechas");
      return;
    }

    setFiltroActivado(true);
  };

  const limpiarFiltro = () => {
    setFechaInicio("");
    setFechaFin("");
    setFiltroEstado("Todos");
    setFiltroActivado(false); // 👉 tabla vacía nuevamente
  };

  return (
    <div className="dashboard-container">
      <Header onToggleSidebar={handleToggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />

      <main className="dashboard-content">
        <h1 className="page-title">Dashboard - {nombreArea}</h1>

        <section className="summary-cards">
          <div className="card">
            <div className="card-info">
              <p>Total Documentos</p>
              <h2>{resumen.total}</h2>
            </div>
          </div>

          <div className="card">
            <div className="card-info">
              <p>Pendientes</p>
              <h2>{resumen.pendientes}</h2>
            </div>
          </div>

          <div className="card">
            <div className="card-info">
              <p>Completados</p>
              <h2>{resumen.completados}</h2>
            </div>
          </div>
        </section>

        <section className="filters-section">
          <div className="date-filters">
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
            <button className="btn-aplicar" onClick={aplicarFiltro}>
              Filtrar
            </button>
            <button className="btn-limpiar" onClick={limpiarFiltro}>
              Limpiar
            </button>
          </div>

          <select
            className="status-filter"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="Todos">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Completado">Completado</option>
          </select>
        </section>

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
              {documentosVisibles.length > 0 ? (
                documentosVisibles.map((doc) => {
                  const estado =
                    !doc.areaAsignada?.eArea || doc.areaAsignada?.eArea === ""
                      ? "Pendiente"
                      : doc.areaAsignada?.eArea;

                  return (
                    <tr key={doc.id}>
                      <td>Exp-{doc.id}</td>

                      <td>
                        {doc.tipoTramite}
                        <p className="exp">
                          {doc.nExpediente ? `Expediente: ${doc.nExpediente}` : ""}
                        </p>
                      </td>

                      <td>
                        {doc.fechaAsignacion
                          ? doc.fechaAsignacion
                              .toDate()
                              .toLocaleDateString("es-PE", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                          : "—"}
                      </td>

                      <td>
                        <span className={`tag ${doc.prioridad?.toLowerCase()}`}>
                          {doc.prioridad || "Media"}
                        </span>
                      </td>

                      <td>
                        <span className={`status ${estado.toLowerCase()}`}>
                          {estado}
                        </span>
                      </td>

                      <td className="actions">
                        {estado === "Completado" ? (
                          <button 
                            className="btn-tres-puntos"
                            onClick={() => abrirDetalle(doc)}
                          >
                            ...
                          </button>
                        ) : (
                          <button className="btn-ver" onClick={() => abrirDetalle(doc)}>
                            Ver
                          </button>
                        )}
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "2rem" }}>
                    {filtroActivado
                      ? "No hay documentos con este filtro"
                      : "Use los filtros para ver documentos"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>

      {mostrarDetalle && selectedDoc && (
        selectedDoc.areaAsignada?.eArea === "Completado" ? (
          <DetalleRespuestaFinal documento={selectedDoc} onClose={cerrarDetalle} />
        ) : (
          <DetalleRespuesta documento={selectedDoc} onClose={cerrarDetalle} />
        )
      )}
    </div>
  );
};

export default DashboardArea;
