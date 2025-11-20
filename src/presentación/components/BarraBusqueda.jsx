import React, { useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa";

const BarraBusqueda = ({ documentos = [], onFiltrar = () => {} }) => {
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    // Si no hay texto → devolver TODOS los documentos
    if (!busqueda.trim()) {
      onFiltrar(documentos); 
      return;
    }

    const texto = busqueda.toLowerCase();

    const filtrados = documentos.filter((doc) => {
      const codigo = (doc.id || "").toLowerCase();
      return codigo.includes(texto);
    });

    onFiltrar(filtrados);
  }, [busqueda, documentos]); // ← documentos sí puede cambiar por el filtro de tiempo

  return (
      <input
        className="barra-busqueda"
        type="text"
        placeholder="Busca por código..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
  );
};

export default BarraBusqueda;
