import { useState, useEffect } from "react";
import { supabase } from "../supabase/client";
import Notificaciones from "./Notificaciones";
import "./FormularioSecciones.css";

function FormularioSecciones() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [secciones, setSecciones] = useState([]);
  const [editando, setEditando] = useState(null);
  const [notificacion, setNotificacion] = useState(null);

  const mostrarNotificacion = (mensaje, tipo = "info") => {
    setNotificacion({ mensaje, tipo });
  };

  const obtenerSecciones = async () => {
    const { data, error } = await supabase.from("secciones").select("*");
    if (!error) setSecciones(data);
  };

  useEffect(() => {
    obtenerSecciones();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        const { error } = await supabase
          .from("secciones")
          .update({ nombre, descripcion })
          .eq("id", editando);
        if (error) throw error;
        mostrarNotificacion("Sección actualizada correctamente", "success");
      } else {
        const { error } = await supabase
          .from("secciones")
          .insert([{ nombre, descripcion }]);
        if (error) throw error;
        mostrarNotificacion("Sección creada correctamente", "success");
      }
      setNombre("");
      setDescripcion("");
      setEditando(null);
      obtenerSecciones();
    } catch (error) {
      mostrarNotificacion(`Error: ${error.message}`, "error");
    }
  };

  const eliminarSeccion = async (id) => {
    if (confirm("¿Deseas eliminar esta sección?")) {
      const { error } = await supabase.from("secciones").delete().eq("id", id);
      if (!error) {
        mostrarNotificacion("Sección eliminada", "success");
        obtenerSecciones();
      } else {
        mostrarNotificacion("Error al eliminar la sección", "error");
      }
    }
  };

  const editarSeccion = (sec) => {
    setNombre(sec.nombre);
    setDescripcion(sec.descripcion);
    setEditando(sec.id);
  };

  return (
    <div className="secciones-container">
      <h2>Gestión de Secciones</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre de la sección"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <button type="submit">
          {editando ? "Actualizar Sección" : "Crear Sección"}
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {secciones.map((sec) => (
            <tr key={sec.id}>
              <td>{sec.nombre}</td>
              <td>{sec.descripcion}</td>
              <td>
                <button onClick={() => editarSeccion(sec)}>Editar</button>
                <button onClick={() => eliminarSeccion(sec.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {notificacion && (
        <Notificaciones
          mensaje={notificacion.mensaje}
          tipo={notificacion.tipo}
          onClose={() => setNotificacion(null)}
        />
      )}
    </div>
  );
}

export default FormularioSecciones;

