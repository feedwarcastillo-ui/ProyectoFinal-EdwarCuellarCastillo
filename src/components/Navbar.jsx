import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabase/client";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Rutas donde NO se mostrará el botón de cerrar sesión
  const hideLogoutRoutes = ["/", "/login", "/register"];

  // Solo mostrar el botón si NO estamos en esas rutas
  const shouldShowLogout = !hideLogoutRoutes.includes(location.pathname);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2>CMS Noticias</h2>
      <div className="nav-links">
        <Link to="/">Inicio</Link>
        <Link to="/dashboard">Panel</Link>

        {/* 👇 Botón solo visible si no estamos en las rutas ocultas */}
        {shouldShowLogout && (
          <button onClick={handleLogout}>Cerrar sesión</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
