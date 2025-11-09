import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabase/client";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data?.session?.user || null;
      if (sessionUser) {
        const { data: userData, error } = await supabase.auth.getUser();
        if (!error && userData?.user) {
          setRole(userData.user.user_metadata?.rol || null);
        }
      }
      setUser(sessionUser);
      setLoading(false);
    }
    getUser();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Cargando...</p>;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles.length > 0 && !allowedRoles.includes(role))
    return (
      <p style={{ textAlign: "center", color: "red" }}>
        No tienes permiso para acceder a esta sección.
      </p>
    );

  return children;
}
export default ProtectedRoute;
