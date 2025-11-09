import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import NoticiaDetalle from "./pages/NoticiaDetalle";
import Footer from "./components/Footer";
function App() {
  return (
    <div className="App">
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["editor", "reportero"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/noticia/:id" element={<NoticiaDetalle />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <footer className="footer">
        <p>© 2025 Noticias Corporativas | Desarrollado por el equipo CMS</p>
      </footer>
    </div>
  );
}

export default App;



