import React, { useState } from "react";
import "../Styles/DetalleDocumento.css";
import {
  FaTimes,
  FaEnvelope,
  FaFileAlt,
  FaCalendarAlt,
  FaPhone,
  FaUserCircle,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../data/Firebase/firebaseConfig";
import ModalRechazo from "./ModalRechazo";
import ModalAsignarArea from "./ModalAsignarArea";

const DetalleDocumento = ({ documento, onClose, onActualizarEstado }) => {
  const [mostrarAsignar, setMostrarAsignar] = useState(false);
  const [mostrarRechazo, setMostrarRechazo] = useState(false);
  const [nExpediente, setNExpediente] = useState(documento.nExpediente || "");
  const [prioridad, setPrioridad] = useState(documento.prioridad || "");

  if (!documento) return null;

  const fut = documento.datosFUT || {};

  // ✅ GUARDAR ÁREA ASIGNADA — CORREGIDO
  const handleGuardarArea = async ({ area, eArea }) => {
    if (!nExpediente || !prioridad) {
      alert("Por favor ingrese el N° de expediente y seleccione una prioridad antes de asignar un área.");
      return;
    }

    try {
      const docRef = doc(db, "tramites", documento.id);

      await updateDoc(docRef, {
        estado: "Aceptado",
        nExpediente,
        prioridad,
        areaAsignada: {
          area,
          eArea
        },
        fechaAsignacion: new Date(),
      });

      const docActualizado = {
        ...documento,
        estado: "Aceptado",
        nExpediente,
        prioridad,
        areaAsignada: { area, eArea },
      };

      if (onActualizarEstado) {
        onActualizarEstado(
          docActualizado,
          "asignar_area",
          `Documento SM-${documento.id} asignado al área ${area}`
        );
      }

      setMostrarAsignar(false);
      onClose();

    } catch (error) {
      console.error("❌ Error al asignar el área:", error);
    }
  };

  // ❌ RECHAZAR DOCUMENTO (no cambia)
  const handleRechazar = async (observacion) => {
    try {
      const docRef = doc(db, "tramites", documento.id);
      await updateDoc(docRef, {
        estado: "Rechazado",
        prioridad: "Rechazado",
        mensaje: observacion,
      });

      const docActualizado = {
        ...documento,
        estado: "Rechazado",
        prioridad: "Rechazado",
        mensaje: observacion,
      };

      if (onActualizarEstado) {
        onActualizarEstado(docActualizado, "rechazar_tramite", observacion);
      }

      setMostrarRechazo(false);
      onClose();
    } catch (error) {
      console.error("❌ Error al rechazar el documento:", error);
    }
  };

  const estadoClase = (documento.estado || "En proceso").toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Detalles del Documento</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-content">
          
          {/* INFORMACIÓN DEL FUT */}
          <div className="doc-info">
            <div className="info-box">
              <p><FaFileAlt /> <strong>Código:</strong> {documento.uid}</p>
              <p><FaEnvelope /> <strong>Correo:</strong> {documento.email}</p>
              <p><FaUserCircle /> <strong>DNI:</strong> {fut.dni}</p>
              <p><FaPhone /> <strong>Teléfono:</strong> {fut.telefono}</p>
              <p><FaMapMarkerAlt /> <strong>Domicilio:</strong> {fut.domicilio}</p>
              <p><FaCalendarAlt /> <strong>Fecha de Solicitud:</strong> {fut.fecha}</p>
            </div>
          </div>

          <div className="tipoDoc">
            <h4>Tipo de Documento: {documento.tipoTramite}</h4>
          </div>

          <div className="estado">
            <h4>Estado</h4>
            <span className={`estado-tag ${estadoClase}`}>{documento.estado || "En proceso"}</span>
          </div>

          <div className="cantidadDoc">
            <h4>Cantidad de documentos</h4>
            <textarea value={fut.documentos || ""} readOnly />
          </div>

          <div className="descripcion">
            <h4>Descripción</h4>
            <textarea value={fut.fundamentos || ""} readOnly />
          </div>

          {/* ADJUNTOS */}
          <div className="adjuntos-section">
            <h4>Documentos adjuntos</h4>
            {Object.entries(documento)
              .filter(([key, value]) => key.toLowerCase().includes("url") && value)
              .map(([key, url], index) => {
                const nombreLimpio = key
                  .replace(/url/gi, "")
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())
                  .trim();

                return (
                  <div key={index} className="adjunto-card">
                    <div className="adjunto-header">
                      <h5>{nombreLimpio}</h5>
                      <button className="btn-ver-pdf" onClick={() => window.open(url, "_blank")}>
                        Ver PDF
                      </button>
                    </div>
                    <div className="adjunto-box">
                      <iframe src={url} title={nombreLimpio}></iframe>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* ASIGNACIÓN */}
          <div className="asignacion">
            <h4># Asignación de Documento</h4>
            <div className="asignacion-box">
              <input
                type="number"
                placeholder="N° de expediente"
                value={nExpediente}
                onChange={(e) => setNExpediente(e.target.value)}
              />
              <select
                value={prioridad}
                onChange={(e) => setPrioridad(e.target.value)}
              >
                <option value="">Asignar prioridad</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
          </div>

          <div className="acciones">
            <button className="btn-rechazar" onClick={() => setMostrarRechazo(true)}>
              Rechazar Documento
            </button>
            <button className="btn-aceptar" onClick={() => setMostrarAsignar(true)}>
              Asignar Área
            </button>
          </div>

          {mostrarAsignar && (
            <ModalAsignarArea
              onClose={() => setMostrarAsignar(false)}
              onGuardar={handleGuardarArea}
            />
          )}

          {mostrarRechazo && (
            <ModalRechazo
              documento={documento}
              onClose={() => setMostrarRechazo(false)}
              onConfirm={handleRechazar}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalleDocumento;
