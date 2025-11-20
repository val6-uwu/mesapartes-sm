import React, { useState, useEffect, useMemo } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../Styles/DashboardPrinc.css";
import TarjetRes from "../components/TarjetasResumen";
import { FaEye, FaEllipsisH } from "react-icons/fa";
import DetalleDocumento from "../components/DetalleDocumento";
import DetalleFinal from "../components/DetalleFinal";
import { listenTramites } from "../../core/services/tramitesService";
import BarraBusqueda from "../components/BarraBusqueda";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../data/Firebase/firebaseConfig";
import ModalEnviarAviso from "../components/ModalEnviarAviso";

const DashboardPrinc = () => {
  const [documentos, setDocumentos] = useState([]);              
  const [documentosFiltrados, setDocumentosFiltrados] = useState([]); 
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [modalActivo, setModalActivo] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [ordenFechaAsc, setOrdenFechaAsc] = useState(true);

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [filtroAplicado, setFiltroAplicado] = useState(false); // 🔥 NUEVO
  const [primeraCarga, setPrimeraCarga] = useState(true); // 🔥 Declarar aquí, arriba del useEffect


  const toDate = (f) => f?.toDate?.() || null;

  const handleToggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
  const unsubscribe = listenTramites((data) => {
    // Ordenar para que los que tengan respuestaArea aparezcan primero
    const ordenados = data.sort((a, b) => {
      const aCampana = a.respuestaArea ? 1 : 0;
      const bCampana = b.respuestaArea ? 1 : 0;
      return bCampana - aCampana; // los con respuestaArea primero
    });

    setDocumentos(ordenados);

    // Mostrar alerta si hay documentos con respuestaArea
    if (primeraCarga) {
      const tieneCampana = ordenados.some(doc => doc.respuestaArea);
      if (tieneCampana) {
        alert("¡Tienes documentos con respuesta!");
        setDocumentosFiltrados(ordenados.filter(doc => doc.respuestaArea));
        setFiltroAplicado(true); // activa la tabla solo con los que tienen respuestaArea
      }
      setPrimeraCarga(false);
    }
  });

  return () => unsubscribe();
}, []);


  // 🔥 Aplicar filtro de fechas
  const aplicarFiltroFechas = () => {
    if (!fechaInicio || !fechaFin) {
      setDocumentosFiltrados([]);
      setFiltroAplicado(false);
      return;
    }

    const inicio = new Date(fechaInicio + "T00:00:00");
    const fin = new Date(fechaFin + "T23:59:59");

    const filtrados = documentos.filter((doc) => {
      const fecha = toDate(doc.fechaCreacion);
      return fecha && fecha >= inicio && fecha <= fin;
    });

    setDocumentosFiltrados(filtrados);
    setFiltroAplicado(true); // 🔥 activa la tabla recién aquí
  };

  useEffect(() => {
    if (fechaInicio && fechaFin && filtroAplicado) {
      aplicarFiltroFechas();
    }
  }, [documentos]);

  // Registrar movimiento
  const registrarMovimiento = async (accion, doc, observaciones = "") => {
    try {
      const usuario = auth.currentUser?.email || "Usuario desconocido";
      await addDoc(collection(db, "historial"), {
        accion,
        usuario,
        fecha: serverTimestamp(),
        tramite: doc?.id || null,
        estado: doc?.estado || null,
        prioridad: doc?.prioridad || null,
        areaAsignada: doc?.areaAsignada || null,
        expediente: doc?.nExpediente || doc?.expediente || null,
        observaciones,
      });
    } catch (err) {
      console.error("Error al registrar movimiento:", err);
    }
  };

  // Ordenar por fecha
  const ordenarPorFecha = (lista) => {
    return [...lista].sort((a, b) => {
      const fechaA = toDate(a?.fechaCreacion) || new Date(0);
      const fechaB = toDate(b?.fechaCreacion) || new Date(0);
      return ordenFechaAsc ? fechaA - fechaB : fechaB - fechaA;
    });
  };

  const handleOrdenarFecha = () => setOrdenFechaAsc(!ordenFechaAsc);

  // Filtrar + ordenar
  const documentosVisibles = useMemo(() => {
    if (!filtroAplicado) return []; // 🔥 tabla vacía antes del filtro

    const filtrados = documentosFiltrados.filter((doc) => {
      return filtroEstado === "Todos" || doc.estado === filtroEstado;
    });

    return ordenarPorFecha(filtrados);
  }, [documentosFiltrados, filtroEstado, ordenFechaAsc, filtroAplicado]);

  const abrirModal = (tipo, doc) => {
    setSelectedDoc(doc);
    setModalActivo(tipo);
  };

  const cerrarModal = () => {
    setModalActivo(null);
    setSelectedDoc(null);
  };

  return (
    <div className="dashboard-container">
      <Header onToggleSidebar={handleToggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />

      <main className="dashboard-content">
        <TarjetRes />

        {/* FILTRO DE FECHAS */}
        <div className="filter-dates">
          <div className="desde-date">
            <label>Desde:</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>

          <div className="hasta-date">
            <label>Hasta:</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </div>

          <div className="btn-aplicar-filtro">
            <button className="btn-filtrar" onClick={aplicarFiltroFechas}>
              Aplicar filtro
            </button>
          </div>
        </div>

        {/* BUSCADOR Y ESTADO */}
        <div className="barra-busqueda-container">
          <BarraBusqueda
            documentos={documentosFiltrados}
            onFiltrar={setDocumentosFiltrados}
          />

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
        </div>

        {/* TABLA */}
        <section className="table-section">
          <table className="doc-table">
            <thead>
              <tr>
                <th>CÓDIGO</th>
                <th>TIPO DE DOCUMENTO</th>
                <th onClick={handleOrdenarFecha} style={{ cursor: "pointer" }}>
                  FECHA {ordenFechaAsc ? "▲" : "▼"}
                </th>
                <th>PRIORIDAD</th>
                <th>ESTADO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>

            <tbody>
              {!filtroAplicado ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                    Seleccione un rango de fechas para ver resultados.
                  </td>
                </tr>
              ) : documentosVisibles.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                    No hay resultados en este rango de fechas.
                  </td>
                </tr>
              ) : (
                documentosVisibles.map((doc) => {
                  const fecha = toDate(doc.fechaCreacion);
                  return (
                    <tr key={doc.id}>
                      <td>SM-{doc.id}</td>

                      <td>
                        {doc.tipoTramite || "—"}
                        <p className="obs">{doc.mensaje ? `Observaciones: ${doc.mensaje}` : ""}</p>
                        <p className="exp">{doc.nExpediente ? `Expediente: ${doc.nExpediente}` : ""}</p>
                        <p className="area">{doc.areaAsignada ? `Área: ${doc.areaAsignada.area}` : ""}</p>
                      </td>

                      <td>
                        {fecha
                          ? fecha.toLocaleDateString("es-PE", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "—"}
                      </td>

                      <td>
                        <span className={`tag ${doc.prioridad?.toLowerCase() || "asignar"}`}>
                          {doc.prioridad || "Asignar"}
                        </span>
                      </td>

                      <td>
                        <span className={`status ${doc.estado?.toLowerCase()}`}>
                          {doc.estado}
                        </span>
                      </td>

                      <td className="actions">
                        {doc.estado === "Pendiente" ? (
                          <button className="view-btn" onClick={() => abrirModal("detalle", doc)}>
                            <FaEye /> Ver
                          </button>
                        ) : (
                          <button className="btn-opciones" onClick={() => abrirModal("detalleFinal", doc)}>
                            <FaEllipsisH className="menu-icon" />
                          </button>
                        )}
                        {doc.respuestaArea && doc.estado !== "Completado" && (
                          <button
                            className="btn-aviso"
                            onClick={() => abrirModal("aviso", doc)}
                            title="Enviar aviso al usuario"
                          >
                            🔔
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </section>
      </main>

      {/* MODALES */}
      {modalActivo === "detalle" && selectedDoc && (
        <DetalleDocumento
          documento={selectedDoc}
          onClose={cerrarModal}
          onActualizarEstado={(docActualizado, accion, observaciones) =>
            registrarMovimiento(accion, docActualizado, observaciones)
          }
        />
      )}

      {modalActivo === "detalleFinal" && selectedDoc && (
        <DetalleFinal
          documento={selectedDoc}
          onClose={cerrarModal}
          onActualizarEstado={(docActualizado, accion, observaciones) =>
            registrarMovimiento(accion, docActualizado, observaciones)
          }
        />
      )}

      {modalActivo === "aviso" && selectedDoc && (
        <ModalEnviarAviso
          documento={selectedDoc}
          onClose={cerrarModal}
        />
      )}

    </div>
  );
};

export default DashboardPrinc;
