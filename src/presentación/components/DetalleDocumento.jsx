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
import ModalAceptar from "./ModalAceptar";

const DetalleDocumento = ({ documento, onClose, onActualizarEstado }) => {
  const [mostrarAceptar, setMostrarAceptar] = useState(false);
  const [mostrarRechazo, setMostrarRechazo] = useState(false);
  const [nExpediente, setNExpediente] = useState("");
  const [prioridad, setPrioridad] = useState("");

  if (!documento) return null;

  const fut = documento.datosFUT || {};
  const handleAceptar = async ()=>{
    if (!nExpediente || !prioridad) {
    alert("Por favor ingrese el N° de expediente y seleccione una prioridad antes de aceptar.");
    return;
  }

  try {
    const docRef = doc(db, "tramites", documento.id);
    await updateDoc(docRef, {
      estado: "Aceptado",
      nExpediente: nExpediente || "",
      prioridad: prioridad || "",
    });

    const docActualizado = {
      ...documento,
      estado: "Aceptado",
      nExpediente: nExpediente || "",
      prioridad: prioridad || "",
    };

    if (onActualizarEstado) onActualizarEstado(docActualizado);

    setMostrarAceptar(false);
    onClose();

    console.log("✅ Documento aceptado, datos guardados en Firestore");
  } catch (error) {
    console.error("❌ Error al aceptar el documento:", error);
  }
}

  const handleRechazar = async (observacion) => {
    try {
      const docRef = doc(db, "tramites", documento.id);
      await updateDoc(docRef, {
        mensaje: observacion || "",
        estado: "Rechazado",
      });

      const docActualizado = {
        ...documento,
        mensaje: observacion || "",
        estado: "Rechazado",
      };

      if (onActualizarEstado) onActualizarEstado(docActualizado);

      setMostrarRechazo(false);
      onClose();

      console.log("✅ Documento rechazado y mensaje guardado en Firestore");
    } catch (error) {
      console.error("❌ Error al guardar el mensaje:", error);
    }
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
                <FaEnvelope /> <strong>Correo:</strong>{" "}
                {documento.email}
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
                <FaCalendarAlt /> <strong>Fecha de Solicitud:</strong>{" "}
                {fut.fecha}
              </p>
            </div>
          </div>

          <div className="tipoDoc">
            <h4>Tipo de Documento: {documento.tipoTramite}</h4>
          </div>

          <div className="estado">
            <h4>Estado</h4>
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

          {/* === SECCIÓN: DOCUMENTOS ADJUNTOS === */}
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
                      <button
                        className="btn-ver-pdf"
                        onClick={() => window.open(url, "_blank")}
                      >
                        Ver PDF
                      </button>
                    </div>
                    <div className="adjunto-box">
                      <iframe src={url} title={nombreLimpio}></iframe>
                    </div>
                  </div>
                );
              })}
              <div className="asignacion">
            <h4># Asignación de Documento</h4>
            <div className="asignacion-box">
              <input 
                type="number" 
                placeholder="N° de expediente"
                value={nExpediente}
                onChange={(e) => setNExpediente(e.target.value)}/>
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
          </div>

          <div className="acciones">
            <button
              className="btn-rechazar"
              onClick={() => setMostrarRechazo(true)}
            >
              Rechazar Documento
            </button>
            <button className="btn-aceptar"
            onClick={() => setMostrarAceptar(true)}
            >
              Aceptar Documento
            </button>
          </div>
          {mostrarAceptar && (
            <ModalAceptar
              documento={documento}
              onClose={() => setMostrarAceptar(false)}
              onConfirm={handleAceptar}
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
