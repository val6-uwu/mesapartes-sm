import React, { useState } from "react";
import "../Styles/DetalleRespuesta.css";
import {
  FaTimes,
  FaFileAlt,
  FaCalendarAlt,
  FaUserCircle,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUpload,
} from "react-icons/fa";

import { db, storage } from "../../data/Firebase/firebaseConfig";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";

const DetalleRespuesta = ({ documento, onClose }) => {
  const [respuestaTexto, setRespuestaTexto] = useState("");
  const [pdfsRespuesta, setPdfsRespuesta] = useState([]);
  const [subiendo, setSubiendo] = useState(false);

  if (!documento) return null;

  const fut = documento.datosFUT || {};

  // 📌 SUBIR PDFs A STORAGE
  const subirPDFs = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("⚠ Debes iniciar sesión para enviar una respuesta");
      return [];
    }

    const urls = [];
    for (let pdf of pdfsRespuesta) {
      const pdfRef = ref(
        storage,
        `respuestas/${user.uid}/respuesta_${Date.now()}_${pdf.name}`
      );

      const subida = await uploadBytes(pdfRef, pdf);
      const url = await getDownloadURL(subida.ref);
      urls.push(url);
    }

    return urls;
  };

  // 📌 GUARDAR RESPUESTA EN FIRESTORE
  const enviarRespuesta = async () => {
    try {
      setSubiendo(true);

      let pdfUrls = [];
      if (pdfsRespuesta.length > 0) {
        pdfUrls = await subirPDFs();
      }

      await updateDoc(doc(db, "tramites", documento.id), {
        respuestaArea: {
          texto: respuestaTexto || null,
          pdfs: pdfUrls,
          fechaRespuesta: serverTimestamp(),
        },
        "areaAsignada.eArea": "Completado", // 🔥 CORRECCIÓN IMPORTANTE
      });

      alert("Respuesta enviada correctamente ✔");
      onClose();
    } catch (error) {
      console.error("Error al enviar respuesta:", error);
      alert("Error al enviar respuesta");
    }

    setSubiendo(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">

        <div className="modal-header">
          <h2>Responder Documento</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-content">
          <div className="info-box">
            <p><FaFileAlt /> <strong>Tipo:</strong> {documento.tipoTramite}</p>
            <p><FaUserCircle /> <strong>DNI:</strong> {fut.dni}</p>
            <p><FaPhone /> <strong>Teléfono:</strong> {fut.telefono}</p>
            <p><FaEnvelope /> <strong>Correo:</strong> {documento.email}</p>
            <p><FaMapMarkerAlt /> <strong>Domicilio:</strong> {fut.domicilio}</p>
            <p><FaCalendarAlt /> <strong>Fecha solicitud:</strong> {fut.fecha}</p>
          </div>

          <div className="adjuntos">
            <h4>Documentos Adjuntos</h4>

            {Object.entries(documento)
              .filter(([key, value]) => key.toLowerCase().includes("url") && value)
              .map(([key, url], index) => {
                const nombre = key.replace(/url/i, "").toUpperCase();

                return (
                  <div key={index} className="adjunto-card">
                    <div className="adjunto-header">
                      <h5>{nombre}</h5>
                      <button
                        className="btn-ver-pdf"
                        onClick={() => window.open(url, "_blank")}
                      >
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

          <div className="respuesta-section">
            <h3>Respuesta del Área</h3>

            <textarea
              placeholder="Escribe la respuesta..."
              value={respuestaTexto}
              onChange={(e) => setRespuestaTexto(e.target.value)}
            />

            <label className="upload-label">
              <FaUpload /> Subir PDFs de respuesta
              <input
                type="file"
                accept="application/pdf"
                multiple
                onChange={(e) => setPdfsRespuesta([...e.target.files])}
              />
            </label>

            {pdfsRespuesta.length > 0 && (
              <ul className="lista-archivos">
                {pdfsRespuesta.map((pdf, idx) => (
                  <li key={idx}>{pdf.name}</li>
                ))}
              </ul>
            )}
          </div>

          <button
            className="btn-guardar"
            onClick={enviarRespuesta}
            disabled={subiendo}
          >
            {subiendo ? "Guardando..." : "Enviar Respuesta"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default DetalleRespuesta;
