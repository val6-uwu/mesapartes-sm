import React from "react";
import "../Styles/ModalAviso.css";
import { FaTimes, FaUserCircle, FaPhone, FaEnvelope, FaCalendarAlt } from "react-icons/fa";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../data/Firebase/firebaseConfig";

const ModalEnviarAviso = ({ documento, onClose }) => {
  if (!documento) return null;

  const fut = documento.datosFUT || {};
  const respuesta = documento.respuestaArea || {};
  const expediente = documento.nExpediente || "Sin asignar";

  // 🟩 FUNCIÓN QUE GUARDA EL AVISO Y CAMBIA EL ESTADO
  const enviarAviso = async () => {
    const avisoTexto = `
Los documentos solicitados están listos para recoger, acérquese a mesa de partes.
Horario de atención: 8:00am - 15:00pm.
N° Expediente: ${expediente}
    `.trim();

    try {
      await updateDoc(doc(db, "tramites", documento.id), {
        estado: "Completado",
        aviso: avisoTexto,
        fechaAviso: new Date(),
      });

      alert("Aviso enviado correctamente");
      onClose();
    } catch (error) {
      console.error("Error al enviar aviso:", error);
      alert("Hubo un error actualizando el aviso");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">

        {/* HEADER */}
        <div className="modal-header">
          <h2>Enviar Aviso al Remitente</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-content">

          {/* DATOS DEL REMITENTE */}
          <div className="info-box">
            <p><FaUserCircle /> <strong>Nombre:</strong> {fut.nombres} {fut.apellidos}</p>
            <p><FaEnvelope /> <strong>Correo:</strong> {documento.email}</p>
            <p><FaPhone /> <strong>Teléfono:</strong> {fut.telefono}</p>
            <p><FaCalendarAlt /> <strong>Fecha de Solicitud:</strong> {fut.fecha}</p>
            <p><strong>N° Expediente:</strong> {expediente}</p>
          </div>

          {/* RESPUESTA DEL ÁREA */}
          <div className="respuesta-section">
            <h3>Respuesta del Área</h3>

            <div className="respuesta-card">
              <p style={{ whiteSpace: "pre-wrap" }}>
                {respuesta.texto || "El área no registró texto de respuesta."}
              </p>
            </div>

            {/* PDFs RESPUESTA */}
            {respuesta.pdfs?.length > 0 && (
              <div className="adjuntos">
                <h4>PDFs de Respuesta</h4>

                {respuesta.pdfs.map((url, idx) => (
                  <div key={idx} className="adjunto-card">
                    <div className="adjunto-header">
                      <h5>PDF RESPUESTA {idx + 1}</h5>
                      <button className="btn-ver-pdf" onClick={() => window.open(url, "_blank")}>
                        Ver PDF
                      </button>
                    </div>

                    <div className="adjunto-box">
                      <iframe src={url} title={`pdf-${idx}`} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* BOTÓN ENVIAR */}
          <button className="btn-enviar-aviso" onClick={enviarAviso}>
            Enviar Aviso al Remitente
          </button>

        </div>
      </div>
    </div>
  );
};

export default ModalEnviarAviso;
