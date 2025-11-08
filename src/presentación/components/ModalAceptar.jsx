import React from "react";
import "../Styles/ModalAceptar.css";

const ModalAceptar = ({ onClose, onConfirm }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Confirmar Aceptación</h3>
        <p>¿Desea aceptar este documento con los datos ingresados?</p>
        <div className="modal-actions">
          <button className="btn-cancelar" onClick={onClose}>Cancelar</button>
          <button className="btn-confirmar" onClick={onConfirm}>Aceptar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalAceptar;
