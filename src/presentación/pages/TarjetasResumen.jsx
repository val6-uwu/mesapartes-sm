import React, { useMemo } from "react";
import "../Styles/Header.css";
import { FaFileAlt, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const TarjetRes = ({ documentos = [] }) => {
  // ✅ useMemo evita recalcular en cada render
  const { total, pendientes, aceptados, rechazados } = useMemo(() => {
    const total = documentos.length;
    const pendientes = documentos.filter(doc => doc.estado === "En proceso" || !doc.estado).length;
    const aceptados = documentos.filter(doc => doc.estado === "Completado" || doc.estado === "Aprobado").length;
    const rechazados = documentos.filter(doc => doc.estado === "Rechazado").length;

    return { total, pendientes, aceptados, rechazados };
  }, [documentos]);

  return (
    <section className="summary-cards">
      <div className="card">
        <div className="card-info">
          <p>Total Documentos</p>
          <h2>{total}</h2>
        </div>
        <FaFileAlt className="card-icon blue" />
      </div>

      <div className="card">
        <div className="card-info">
          <p>Pendientes</p>
          <h2>{pendientes}</h2>
        </div>
        <FaClock className="card-icon orange" />
      </div>

      <div className="card">
        <div className="card-info">
          <p>Aceptados</p>
          <h2>{aceptados}</h2>
        </div>
        <FaCheckCircle className="card-icon green" />
      </div>

      <div className="card">
        <div className="card-info">
          <p>Rechazados</p>
          <h2>{rechazados}</h2>
        </div>
        <FaTimesCircle className="card-icon red" />
      </div>
    </section>
  );
};

export default TarjetRes;
