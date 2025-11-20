import React from "react";
import "../Styles/DetalleRespuesta.css";
import {
  FaTimes,
  FaFileAlt,
  FaCalendarAlt,
  FaUserCircle,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const DetalleRespuestaFinal = ({ documento, onClose }) => {
  if (!documento) return null;

  const fut = documento.datosFUT || {};
  const respuesta = documento.respuestaArea || {};

  return (
    <div className="modal-overlay">
      <div className="modal-container">

        {/* HEADER */}
        <div className="modal-header">
          <h2>Detalle del Trámite</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-content">

          {/* 🔵 DATOS DEL FUT DEL USUARIO */}
          <div className="info-box">
            <p><FaFileAlt /> <strong>Tipo:</strong> {documento.tipoTramite}</p>
            <p><FaUserCircle /> <strong>DNI:</strong> {fut.dni}</p>
            <p><FaPhone /> <strong>Teléfono:</strong> {fut.telefono}</p>
            <p><FaEnvelope /> <strong>Correo:</strong> {documento.email}</p>
            <p><FaMapMarkerAlt /> <strong>Domicilio:</strong> {fut.domicilio}</p>
            <p><FaCalendarAlt /> <strong>Fecha solicitud:</strong> {fut.fecha}</p>
          </div>

          {/* 📎 DOCUMENTOS ENVIADOS POR EL USUARIO */}
          <div className="adjuntos">
            <h3>Documentos Enviados</h3>

            {Object.entries(documento)
              .filter(([key, value]) => key.toLowerCase().includes("url") && value)
              .map(([key, url], index) => {
                const nombre = key.replace(/url/i, "").toUpperCase();

                return (
                  <div key={index} className="adjunto-card">
                    <div className="adjunto-header">
                      <h5>{nombre}</h5>
                      <button className="btn-ver-pdf" onClick={() => window.open(url, "_blank")}>
                        Ver PDF
                      </button>
                    </div>

                    <div className="adjunto-box">
                      <iframe src={url} title={nombre}></iframe>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* 🟩 RESPUESTA DEL ÁREA */}
          <div className="respuesta-section">
            <h3>Respuesta Emitida por el Área</h3>

            <div className="respuesta-card">
              <p style={{ whiteSpace: "pre-wrap" }}>
                {respuesta.texto ? respuesta.texto : "No se registró texto de respuesta."}
              </p>
            </div>

            {/* PDFs emitidos por el área */}
            {respuesta.pdfs && respuesta.pdfs.length > 0 && (
              <div className="adjuntos" style={{ marginTop: "15px" }}>
                <h4>PDFs Adjuntos por el Área</h4>

                {respuesta.pdfs.map((url, idx) => (
                  <div key={idx} className="adjunto-card">
                    <div className="adjunto-header">
                      <h5>PDF RESPUESTA {idx + 1}</h5>
                      <button className="btn-ver-pdf" onClick={() => window.open(url, "_blank")}>
                        Ver PDF
                      </button>
                    </div>

                    <div className="adjunto-box">
                      <iframe src={url} title={`respuesta-${idx}`}></iframe>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DetalleRespuestaFinal;
