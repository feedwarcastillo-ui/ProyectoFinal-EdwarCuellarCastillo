import React, { useEffect } from "react";
import "./Notificaciones.css";

function Notificaciones({ mensaje, tipo = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Notificación visible por 4 segundos

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notificacion notificacion-${tipo}`}>
      <span>{mensaje}</span>
      <button onClick={onClose} aria-label="Cerrar notificación">
        &times;
      </button>
    </div>
  );
}

export default Notificaciones;
