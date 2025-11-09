import { useState } from "react";
import { supabase } from "../supabase/client";
import "./Register.css";


function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("reportero"); 

  const handleRegister = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { rol },
      },
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Usuario registrado correctamente");
    }
  };

  return (
    <div className="register-container">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleRegister} className="register-form">
        <input
          type="email"
          placeholder="Correo electrónico"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        
        <select onChange={(e) => setRol(e.target.value)}>
          <option value="reportero">Reportero</option>
          <option value="editor">Editor</option>
        </select>

        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}

export default Register;
