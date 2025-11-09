import { useState, useEffect } from "react";
import { supabase } from "../supabase/client";
import "./FormularioNoticias.css";
import Notificaciones from "./Notificaciones";

function FormularioNoticias({ user, noticiaEdicion, onEditComplete, role }) {
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagen, setImagen] = useState(null);
  const [estado, setEstado] = useState("Edición"); // Estado inicial
  const [loading, setLoading] = useState(false);
  const [notificacion, setNotificacion] = useState(null);

  const mostrarNotificacion = (mensaje, tipo = "info") => {
    setNotificacion({ mensaje, tipo });
  };

  useEffect(() => {
    if (noticiaEdicion) {
      setTitulo(noticiaEdicion.titulo || "");
      setSubtitulo(noticiaEdicion.subtitulo || "");
      setContenido(noticiaEdicion.contenido || "");
      setCategoria(noticiaEdicion.categoria || "");
      setEstado(noticiaEdicion.estado || "Edición");
      setImagen(null);
    } else {
      setTitulo("");
      setSubtitulo("");
      setContenido("");
      setCategoria("");
      setEstado("Edición");
      setImagen(null);
    }
  }, [noticiaEdicion]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        mostrarNotificacion("Solo se permiten imágenes JPG y PNG", "error");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        mostrarNotificacion("La imagen debe pesar menos de 2MB", "error");
        return;
      }
      setImagen(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imagenUrl = noticiaEdicion?.imagen_url || null;

      if (imagen) {
        const { data, error } = await supabase.storage
          .from("imagenes")
          .upload(`noticias/${Date.now()}-${imagen.name}`, imagen);
        if (error) throw error;

        const { data: urlData } = supabase.storage.from("imagenes").getPublicUrl(data.path);
        imagenUrl = urlData.publicUrl;
      }

      let nuevoEstado = estado;
      if (!noticiaEdicion) {
        nuevoEstado = "Edición";
      } else {
        if (role === "reportero" && (estado === "Publicado" || estado === "Desactivado")) {
          nuevoEstado = noticiaEdicion.estado;
        }
      }

      if (noticiaEdicion) {
        const { error } = await supabase
          .from("noticias")
          .update({ titulo, subtitulo, contenido, categoria, imagen_url: imagenUrl, estado: nuevoEstado })
          .eq("id", noticiaEdicion.id);
        if (error) throw error;
        mostrarNotificacion("Noticia actualizada correctamente", "success");
      } else {
        const { error } = await supabase.from("noticias").insert([
          {
            titulo,
            subtitulo,
            contenido,
            categoria,
            imagen_url: imagenUrl,
            estado: nuevoEstado,
            autor_id: user.id,
          },
        ]);
        if (error) throw error;
        mostrarNotificacion("Noticia creada correctamente", "success");
      }

      if (onEditComplete) onEditComplete();

      if (!noticiaEdicion) {
        setTitulo("");
        setSubtitulo("");
        setContenido("");
        setCategoria("");
        setEstado("Edición");
        setImagen(null);
      }
    } catch (error) {
      mostrarNotificacion(` Error: ${error.message}`, "error");
    }
    setLoading(false);
  };

  return (
    <div className="formulario-container">
      <h2>{noticiaEdicion ? "Editar noticia" : "Crear nueva noticia"}</h2>
      <form onSubmit={handleSubmit} className="form-noticia">
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Subtítulo"
          value={subtitulo}
          onChange={(e) => setSubtitulo(e.target.value)}
        />
        <textarea
          placeholder="Contenido"
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Categoría"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        />

        {role === "editor" && noticiaEdicion && (
          <select value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="Edición">Edición</option>
            <option value="Terminado">Terminado</option>
            <option value="Publicado">Publicado</option>
            <option value="Desactivado">Desactivado</option>
          </select>
        )}

        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : noticiaEdicion ? "Actualizar Noticia" : "Guardar Noticia"}
        </button>
      </form>

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

export default FormularioNoticias;
