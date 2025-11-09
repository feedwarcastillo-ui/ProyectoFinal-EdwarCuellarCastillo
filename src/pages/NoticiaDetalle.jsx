import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabase/client";
import "./NoticiaDetalle.css";

function NoticiaDetalle() {
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const obtenerNoticia = async () => {
      const { data, error } = await supabase
        .from("noticias")
        .select(`id, titulo, subtitulo, contenido, imagen_url, categoria, fecha_creacion`)
        .eq("id", id)
        .single();

      if (error) {
        setErrorMsg("Error al cargar la noticia.");
      } else {
        setNoticia(data);
        if (data?.imagen_url) {
          const { data: publicData } = supabase
            .storage
            .from('imagenes')
            .getPublicUrl(data.imagen_url); 
          setImageUrl(publicData.publicUrl);
        }
      }
    };

    obtenerNoticia();
  }, [id]);

  if (errorMsg) return <p>{errorMsg}</p>;
  if (!noticia) return <p>Cargando noticia...</p>;

  return (
    <div className="detalle-container">
      <Link to="/" className="btn-volver">← Volver</Link>
      <h1>{noticia.titulo}</h1>
      {noticia.subtitulo && <h3>{noticia.subtitulo}</h3>}
      <p className="fecha">
        {new Date(noticia.fecha_creacion).toLocaleDateString()} — {noticia.categoria || "Sin categoría"}
      </p>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={noticia.titulo}
          className="detalle-img"
        />
      )}
      <p className="contenido">{noticia.contenido}</p>
    </div>
  );
}

export default NoticiaDetalle;


