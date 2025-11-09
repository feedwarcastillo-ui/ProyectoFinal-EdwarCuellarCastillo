import { useState, useEffect } from "react";
import { supabase } from "../supabase/client";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const [noticiasAgrupadas, setNoticiasAgrupadas] = useState({});

  useEffect(() => {
    const obtenerNoticias = async () => {
      const { data, error } = await supabase
        .from("noticias")
        .select(`id, titulo, subtitulo, imagen_url, categoria`)
        .eq("estado", "Publicado")
        .order("fecha_creacion", { ascending: false });

      if (error) {
        console.error("Error cargando noticias:", error);
        return;
      }

     
      const dataConUrls = data.map(noticia => {
        let imageUrl = "";
        if (noticia.imagen_url) {
          const { data: publicData } = supabase
            .storage
            .from('imagenes')
            .getPublicUrl(noticia.imagen_url);
          imageUrl = publicData.publicUrl;
        }
        return { ...noticia, imageUrl };
      });

      const agrupadas = dataConUrls.reduce((acc, noticia) => {
        const categoria = noticia.categoria || "Sin categoría";
        if (!acc[categoria]) acc[categoria] = [];
        acc[categoria].push(noticia);
        return acc;
      }, {});

      setNoticiasAgrupadas(agrupadas);
    };

    obtenerNoticias();
  }, []);

  return (
    <div className="home-page">
      <header className="hero-banner">
        <div className="overlay"></div>
        <h1>Noticias Corporativas</h1>
        <p>La actualidad empresarial en un solo lugar</p>
      </header>

      <main className="content">
        {Object.keys(noticiasAgrupadas).length === 0 ? (
          <p>No hay noticias publicadas.</p>
        ) : (
          Object.entries(noticiasAgrupadas).map(([categoria, noticias]) => (
            <section key={categoria} className="seccion">
              <h2 className="seccion-titulo">{categoria}</h2>
              <div className="noticias-grid">
                {noticias.map(({ id, titulo, subtitulo, imageUrl }) => (
                  <article key={id} className="noticia-card">
                    <div className="imagen-wrapper">
                      {imageUrl && <img src={imageUrl} alt={titulo} />}
                    </div>
                    <div className="noticia-content">
                      <h3>{titulo}</h3>
                      <p>{subtitulo}</p>
                      <Link to={`/noticia/${id}`} className="btn-ver">
                        Leer más →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))
        )}
      </main>
    </div>
  );
}

export default Home;



