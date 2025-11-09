import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) navigate("/dashboard");
    };
    checkUser();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setErrorMsg("Correo o contraseña incorrectos");
    else navigate("/dashboard");
  };

  return (
    <div className="login-page">
      <div className="overlay"></div>
      <div className="login-container">
        <div className="login-box">
          <h1>CMS Noticias</h1>
          <p className="subtitle">Sistema de administración corporativa</p>

          {errorMsg && <p className="error-msg">{errorMsg}</p>}

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Iniciar sesión</button>
          </form>

          <p className="register-text">
            ¿No tienes una cuenta?{" "}
            <a href="/register" className="link">
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

