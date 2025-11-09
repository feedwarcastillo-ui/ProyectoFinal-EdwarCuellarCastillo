import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabase/client";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();


  const hideLogoutRoutes = ["/", "/login", "/register"];

 
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

      
        {shouldShowLogout && (
          <button onClick={handleLogout}>Cerrar sesión</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
