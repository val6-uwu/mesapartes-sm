import React, { useState, useEffect } from "react";

const FiltroEstado = () => {
    const [filtroEstado, setFiltroEstado] = useState("Todos");
    return (
        <div>
            <select
                className="status-filter"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
            >
                <option value="Todos">Todos los estados</option>
                <option value="En proceso">En proceso</option>
                <option value="Completado">Completado</option>
                <option value="Rechazado">Rechazado</option>
            </select>
        </div>
  );
};

export default FiltroEstado;