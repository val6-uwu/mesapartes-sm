// src/pages/ModalRechazo.jsx
import React, { useState } from "react";
import "../Styles/ModalRechazo.css";

const ModalRechazo = ({ documento, onClose, onConfirm }) => {
  const [observacion, setObservacion] = useState("");

  return (
    <div className="modal-overlay">
      <div className="modal-rechazo">
        {/* Encabezado */}
        <div className="modal-header">
          <div className="header-left">
            <h2>Rechazar Documento</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Texto descriptivo */}
        <p className="mensaje">
          Está a punto de rechazar el documento{" "}
          <strong>{documento.codigo}</strong> de{" "}
          <strong>{documento.nombres || ""} {documento.apellidos || ""}</strong>.{""} Por favor, indique el motivo del rechazo.
        </p>

        {/* Campo de observación */}
        <label>Observación</label>
        <textarea
          placeholder="Ej: Documentación incompleta, falta documentación ..."
          value={observacion}
          onChange={(e) => setObservacion(e.target.value)}
        />

        <p className="nota">
          Esta observación será visible para el solicitante y quedará registrada
          en el sistema.
        </p>

        {/* Botones */}
        <div className="acciones-modal">
          <button className="cancelar-btn" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="confirmar-btn"
            onClick={() => onConfirm(observacion)}
          >
            Confirmar Rechazo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalRechazo;
