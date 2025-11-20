// src/pages/DetalleDocumento.jsx
import React from "react";
import "../Styles/DetalleFinal.css";
import {
  FaTimes,
  FaEnvelope,
  FaCalendarAlt,
  FaPhone,
  FaUserCircle,
  FaMapMarkerAlt,
} from "react-icons/fa";

const DetalleDocumento = ({ documento, onClose }) => {
  if (!documento) return null;

  const fut = documento.datosFUT || {};

  const estado = documento.estado || "En proceso";
  const expediente = documento.nExpediente || "Sin asignar";
  const estadoClase = estado.toLowerCase().replace(/\s+/g, "-");

  const areaDerivacion =
    typeof documento.areaAsignada === "object"
      ? documento.areaAsignada?.area
      : documento.areaAsignada;

  const estadoArea =
    typeof documento.areaAsignada === "object"
      ? documento.areaAsignada?.eArea
      : "";

  /* 🟩 Normalizar RESPUESTA DEL ÁREA */
  const respuestaArea = documento.respuestaArea || {};

  const tieneRespuesta =
    (respuestaArea.texto && respuestaArea.texto.trim() !== "") ||
    respuestaArea.pdfs;

  // Normalizar PDFs (string → array)
  const pdfsRespuesta = respuestaArea.pdfs
    ? Array.isArray(respuestaArea.pdfs)
      ? respuestaArea.pdfs
      : [respuestaArea.pdfs]
    : [];

  return (
    <div className="modal-overlay">
      <div className="modal-container">

        {/* HEADER */}
        <div className="modal-header">
          <h2>Detalle Final del Documento</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-content">

          {/* INFO PRINCIPAL */}
          <div className="info-box">
            <p><strong>Código:</strong> {documento.uid}</p>
            <p><FaEnvelope /> <strong>Correo:</strong> {documento.email}</p>
            <p><FaUserCircle /> <strong>DNI:</strong> {fut.dni}</p>
            <p><FaPhone /> <strong>Teléfono:</strong> {fut.telefono}</p>
            <p><FaMapMarkerAlt /> <strong>Domicilio:</strong> {fut.domicilio}</p>
            <p><FaCalendarAlt /> <strong>Fecha:</strong> {fut.fecha}</p>
          </div>

          {/* TIPO */}
          <div className="tipoDoc">
            <h4>Tipo de Documento</h4>
            <p>{documento.tipoTramite}</p>
          </div>

          {/* ESTADO */}
          <div className="estado">
            <h4>Estado del Documento</h4>
            <span className={`estado-tag ${estadoClase}`}>{estado}</span>
          </div>

          {/* EXPEDIENTE */}
          <div className="estado">
            <h4>N° Expediente</h4>
            <span className={`estado-tag ${estadoClase}`}>{expediente}</span>
          </div>

          {/* ÁREA ASIGNADA */}
          {estado.toLowerCase() === "aceptado" && (
            <div className="asignacion">
              <h4>Área de Derivación</h4>
              <p>{areaDerivacion || "Área no especificada."}</p>

              {estadoArea && (
                <p><strong>Estado del Área:</strong> {estadoArea}</p>
              )}
            </div>
          )}

          {/* OBSERVACIÓN SI FUE RECHAZADO */}
          {estado.toLowerCase() === "rechazado" && (
            <div className="observacion">
              <h4>Motivo del Rechazo</h4>
              <p>{documento.mensaje || "Sin observación registrada."}</p>
            </div>
          )}

          {/* DESCRIPCIÓN */}
          <div className="descripcion">
            <h4>Descripción</h4>
            <textarea readOnly value={fut.fundamentos || ""} />
          </div>

          {/* DOCUMENTOS ADJUNTOS DEL USUARIO */}
          <div className="adjuntos">
            <h4>Documentos Adjuntos</h4>

            {Object.entries(documento)
              .filter(([key, value]) => key.toLowerCase().includes("url") && value)
              .map(([key, url], i) => {
                const nombre = key
                  .replace(/url/gi, "")
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())
                  .trim();

                return (
                  <div key={i} className="adjunto-card">
                    <div className="adjunto-header">
                      <h5>{nombre}</h5>
                      <button className="btn-ver-pdf" onClick={() => window.open(url)}>
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

          {/* 🟩 RESPUESTA FINAL (solo si existe) */}
          {tieneRespuesta && (
            <div className="respuesta-final">
              <h4>Respuesta Final del Área</h4>

              {/* TEXTO FINAL */}
              {respuestaArea.texto && (
                <textarea
                  readOnly
                  className="respuesta-area-text"
                  value={respuestaArea.texto}
                />
              )}

              {/* PDFs de respuesta */}
              {pdfsRespuesta.length > 0 && (
                <div className="adjuntos">
                  <h4>PDFs Adjuntos del Área</h4>

                  {pdfsRespuesta.map((url, idx) => (
                    <div key={idx} className="adjunto-card">
                      <div className="adjunto-header">
                        <h5>PDF Respuesta {idx + 1}</h5>
                        <button className="btn-ver-pdf" onClick={() => window.open(url)}>
                          Ver PDF
                        </button>
                      </div>
                      <div className="adjunto-box">
                        <iframe src={url} title={`pdf-respuesta-${idx}`}></iframe>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default DetalleDocumento;
