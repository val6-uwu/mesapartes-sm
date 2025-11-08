import React, { useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa";

const BarraBusqueda = ({ documentos = [], onFiltrar = () => {} }) => {
  const [busqueda, setBusqueda] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");

  useEffect(() => {
    let filtrados = documentos;

    if (busqueda.trim()) {
      const texto = busqueda.toLowerCase();
      filtrados = filtrados.filter((doc) => {
        const codigo = (doc.uid || "").toLowerCase();
        return codigo.includes(texto);
      });
    }

    if (fechaFiltro) {
      filtrados = filtrados.filter((doc) => {
        const fut = doc.datosFUT || {};
        const fechaTexto = fut.fecha || "";

        // Convertir "06/11/2025" → "2025-11-06"
        const partes = fechaTexto.split("/");
        if (partes.length === 3) {
          const fechaNormalizada = `${partes[2]}-${partes[1]}-${partes[0]}`;
          return fechaNormalizada === fechaFiltro;
        }
        return false;
      });
    }

    onFiltrar(filtrados);
  }, [busqueda, fechaFiltro, documentos]);

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Busca por código..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <input
        type="date"
        value={fechaFiltro}
        onChange={(e) => setFechaFiltro(e.target.value)}
      />
      <button className="filter-btn">
        <FaFilter />
      </button>
    </div>
  );
};

export default BarraBusqueda;
