import { useState } from "react";
import { useNavigate } from "react-router-dom";
import stylesRecuperar from "../styles/RecuperarContraseña.module.css";

const logoReservia = "/LogoReservia.png";

function RecuperarContraseña() {
  const navigate = useNavigate();

  // Estado para capturar el email
  const [email, setEmail] = useState("");

  // Función para enviar la solicitud de recuperación
  const handleRecuperar = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!email.trim()) {
      alert("Por favor ingresa tu correo electrónico.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/auth/recuperar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.mensaje || "Error al enviar la solicitud de recuperación");
        return;
      }

      alert("Se ha enviado un enlace de recuperación a tu correo electrónico.");

      // Redirigir al login
      navigate("/");

    } catch (error) {
      console.error("Error al recuperar contraseña:", error);
      alert("Error en el servidor.");
    }
  };

  return (
    <div className={stylesRecuperar["contenedor"]}>
      <div className={stylesRecuperar["div-padre"]}>
        <form className={stylesRecuperar["div-1"]} onSubmit={handleRecuperar}>
          <div className={stylesRecuperar["logo-reservia"]}>
            <img src={logoReservia} alt="Logo Reservia" />
          </div>

          <div className={stylesRecuperar["div-titulos"]}>
            <h1>Recupera tu contraseña</h1>
            <h3>
              Ingresa tu correo electrónico registrado para recibir un enlace de recuperación 
              para reestablecer tu contraseña.
            </h3>
          </div>

          <div className={stylesRecuperar["div-hijo-1"]}>
            <span>Correo Electrónico</span>
            <input
              type="email"
              placeholder="Escribe tu correo de registro aquí"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={stylesRecuperar["div-hijo-2"]}>
            <div className={stylesRecuperar["div-enlaces"]}>
              <a href="/RegistroCliente">¿Aún no estás registrado?</a>

              {/* Botón del formulario */}
              <button type="submit">Enviar</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecuperarContraseña;