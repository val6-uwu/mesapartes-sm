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

const DetalleDocumento = ({ documento, onClose, onActualizarEstado }) => {
  const [mostrarRechazo, setMostrarRechazo] = useState(false);

  if (!documento) return null;

  const fut = documento.datosFUT || {};

  const handleConfirmar = (observacion) => {
    const docActualizado = {
      ...documento,
      estado: "Rechazado",
      observacion: observacion || "",
    };

    if (onActualizarEstado) onActualizarEstado(docActualizado);

    setMostrarRechazo(false);
    onClose();
  };

  // ✅ Normalizamos el estado para el CSS
  const estadoClase = (documento.estado || "En proceso")
    .toLowerCase()
    .replace(/\s+/g, "-");

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
          <div className="doc-info">
            <div className="info-box">
              <p>
                <FaFileAlt /> <strong>Código:</strong> {documento.uid}
              </p>
              <p>
                <FaEnvelope /> <strong>Correo Electrónico:</strong> {documento.email}
              </p>
              <p>
                <FaUserCircle /> <strong>DNI:</strong> {fut.dni}
              </p>
              <p>
                <FaPhone /> <strong>Teléfono:</strong> {fut.telefono}
              </p>
              <p>
                <FaMapMarkerAlt /> <strong>Domicilio:</strong> {fut.domicilio}
              </p>
              <p>
                <FaCalendarAlt /> <strong>Fecha de Solicitud:</strong> {fut.fecha}
              </p>
            </div>
          </div>

          <div className="tipoDoc">
            <h4>Tipo de Documento: {documento.tipoTramite}</h4>
          </div>

          <div className="estado">
            <h4>Estado</h4>
            {/* ✅ Clase dinámica segura */}
            <span className={`estado-tag ${estadoClase}`}>
              {documento.estado || "En proceso"}
            </span>
          </div>

          <div className="cantidadDoc">
            <h4>Cantidad de documentos</h4>
            <textarea type="text" value={fut.documentos || ""} readOnly />
          </div>

          <div className="descripcion">
            <h4>Descripción</h4>
            <textarea type="text" value={fut.fundamentos || ""} readOnly />
          </div>

          <div className="adjunto">
            <h4>Vaucher</h4>
            <div className="adjunto-box">
              <iframe src={documento.vaucherUrl || documento.solicitudUrl}></iframe>
            </div>
          </div>

          <div className="adjunto">
            <h4>Solicitud</h4>
            <div className="adjunto-box">
              <iframe src={documento.solicitudUrl}></iframe>
            </div>
          </div>

          <div className="adjunto">
            <h4>DNI Remitente</h4>
            <div className="adjunto-box">
              <iframe src={documento.dniApoderadoUrl}></iframe>
            </div>
          </div>

          <div className="asignacion">
            <h4># Asignación de Documento</h4>
            <div className="asignacion-box">
              <input type="text" placeholder="N° de expediente" />
              <select>
                <option>Asignar prioridad</option>
                <option>Alta</option>
                <option>Media</option>
                <option>Baja</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleDocumento;
