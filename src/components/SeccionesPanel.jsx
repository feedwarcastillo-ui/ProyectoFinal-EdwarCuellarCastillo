import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import "./SeccionesPanel.css";

function SeccionesPanel() {
  const [secciones, setSecciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const obtenerSecciones = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("secciones").select("*");
    if (!error) setSecciones(data);
    setLoading(false);
  };

  useEffect(() => {
    obtenerSecciones();
  }, []);

  return (
    <div className="panel-secciones">
      <h2>Gestión de Secciones</h2>
      <p className="descripcion">
        secciones registradas en el sistema.
      </p>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando secciones...</p>
        </div>
      ) : secciones.length === 0 ? (
        <div className="no-secciones">
          <p>No hay secciones registradas actualmente.</p>
        </div>
      ) : (
        <div className="lista-secciones">
          <ul>
            {secciones.map((s) => (
              <li key={s.id} className="item-seccion">
                <div className="info-seccion">
                  <span className="nombre-seccion">{s.nombre}</span>
                  {s.descripcion && (
                    <p className="descripcion-seccion">{s.descripcion}</p>
                  )}
                </div>
                
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SeccionesPanel;

