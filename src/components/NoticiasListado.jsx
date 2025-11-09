import { useState, useEffect } from "react";
import { supabase } from "../supabase/client";
import "./NoticiasListado.css";

function NoticiasListado({ user, role }) {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNoticias = async () => {
      setLoading(true);

      let query = supabase
        .from("noticias")
        .select("*")
        .order("fecha_creacion", { ascending: false });

      if (role === "reportero") {
        query = query
          .eq("autor_id", user.id)
          .in("estado", ["Edición", "Terminado"]); 
      }

      const { data, error } = await query;
      if (error) alert("Error cargando noticias");
      else setNoticias(data);

      setLoading(false);
    };

    fetchNoticias();
  }, [user, role]);

  const cambiarEstado = async (id, nuevoEstado) => {
    const { error } = await supabase
      .from("noticias")
      .update({ estado: nuevoEstado })
      .eq("id", id);
    if (error) alert("Error al actualizar el estado");
    else
      setNoticias((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, estado: nuevoEstado } : n
        )
      );
  };

  const eliminarNoticia = async (id) => {
    if (window.confirm("¿Deseas eliminar esta noticia?")) {
      const { error } = await supabase.from("noticias").delete().eq("id", id);
      if (error) alert("Error al eliminar la noticia");
      else setNoticias((prev) => prev.filter((n) => n.id !== id));
    }
  };

  if (loading) return <p>Cargando noticias...</p>;

  return (
    <div>
      <h2>Noticias</h2>
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {noticias.map((n) => (
            <tr key={n.id}>
              <td>{n.titulo}</td>
              <td>{n.estado}</td>
              <td>
                {(role === "editor" || (role === "reportero" && n.estado !== "Publicado")) && (
                  <>
                    {(n.estado === "Edición" || n.estado === "Terminado") && role === "reportero" && (
                      <button onClick={() => cambiarEstado(n.id, "Terminado")}>Terminar</button>
                    )}

                    {role === "editor" && (
                      <>
                        <button onClick={() => cambiarEstado(n.id, "Publicado")}>Publicar</button>
                        <button onClick={() => cambiarEstado(n.id, "Desactivado")}>Desactivar</button>
                      </>
                    )}

                    <button onClick={() => eliminarNoticia(n.id)}>Eliminar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default NoticiasListado;
