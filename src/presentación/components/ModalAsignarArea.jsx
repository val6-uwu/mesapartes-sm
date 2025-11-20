import React, { useState } from "react";
import "../Styles/ModalAsignarArea.css";
import { FaTimes } from "react-icons/fa";

const ModalAsignarArea = ({ onClose, onGuardar }) => {
  const [area, setArea] = useState("");
  const [eArea, setEArea] = useState("");

  const handleSelectArea = (e) => {
    const value = e.target.value;
    setArea(value);

    if (value) {
      setEArea("Pendiente");
    }
  };

  const handleGuardar = () => {
    if (!area) {
      alert("Por favor seleccione un área.");
      return;
    }

    onGuardar({ area, eArea });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Asignar Área</h3>
          <button className="close-btn" onClick={onClose}><FaTimes /></button>
        </div>
        <div className="modal-content">
          <select
            value={area}
            onChange={handleSelectArea}
            className="area-select"
          >
            <option value="">Seleccione un área</option>
            <option value="Secretaría">Secretaría</option>
            <option value="Subdirección">Subdirección</option>
          </select>

          <div className="modal-actions">
            <button className="btn-cancelar" onClick={onClose}>Cancelar</button>
            <button className="btn-guardar" onClick={handleGuardar}>Guardar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAsignarArea;
