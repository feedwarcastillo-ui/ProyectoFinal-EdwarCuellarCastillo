import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import FormularioNoticias from "../components/FormularioNoticias";
import NoticiasListado from "../components/NoticiasListado";
import SeccionesPanel from "../components/SeccionesPanel";
import FormularioSecciones from "../components/FormularioSecciones";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [rol, setRol] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserAndRole() {
    
      const { data } = await supabase.auth.getSession();
      const authUser = data?.session?.user;
      setUser(authUser);

      if (authUser) {
       
        const { data: userRow, error } = await supabase
          .from("usuarios")
          .select("rol")
          .eq("id_auth", authUser.id)
          .single();

        if (userRow?.rol) setRol(userRow.rol);
        else if (authUser.user_metadata?.rol) setRol(authUser.user_metadata.rol);
        else setRol(null);
      }

      setLoading(false);
    }
    fetchUserAndRole();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (!user) return <p>No autenticado.</p>;

  return (
    <div className="dashboard-container">
      <h1>Panel Administrativo</h1>
      <p>Bienvenido, {user.email} <b>[{rol || "Sin rol"}]</b></p>

      <SeccionesPanel />
      <FormularioSecciones />

     
      {rol === "reportero" && (
        <>
          <FormularioNoticias user={user} />
          <NoticiasListado user={user} role={rol} soloPropias={true} />
        </>
      )}
      {rol === "editor" && (
        <>
          <FormularioNoticias user={user} />
          <NoticiasListado user={user} role={rol} soloPropias={false} />
        </>
      )}
    </div>
  );
}

export default Dashboard;
