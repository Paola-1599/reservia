import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import stylesLogin from "../styles/Login.module.css";

const logoReservia = "/LogoReservia.png";

function Login() {
  const navigate = useNavigate();

  // Estados para capturar inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // FUNCION PARA INICIAR SESION
  const handleLogin = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!email.trim() || !password.trim()) {
      alert("Por favor completa todos los campos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.mensaje || "Error al iniciar sesión");
        return;
      }

      // Guardar usuario
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      // Redirección según rol con pantalla de bienvenida
      navigate(`/bienvenida/${data.usuario.rol}`);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error en el servidor.");
    }
  };

  return (
    <div className={stylesLogin["contenedor"]}>
      <div className={stylesLogin["div-padre"]}>
        <form className={stylesLogin["div-1"]} onSubmit={handleLogin}>
          <div className={stylesLogin["logo-reservia"]}>
            <img src={logoReservia} alt="Logo Reservia" />
          </div>

          <div className={stylesLogin["div-titulos"]}>
            <h1>¡Te damos la bienvenida!</h1>
            <h3>
              Ingresa tus datos para acceder a{" "}
              <span className={stylesLogin.palabraVerde}>Reservia</span>
            </h3>
          </div>

          <div className={stylesLogin["div-hijo-1"]}>
            <span>Correo Electrónico</span>
            <input
              type="email"
              placeholder="Escribe tu correo de registro aquí"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <span>Contraseña</span>
            <div className={stylesLogin["password-field"]}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Escribe tu contraseña aquí"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className={stylesLogin["password-toggle"]}
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className={stylesLogin["div-hijo-2"]}>
            <div className={stylesLogin["div-check"]}>
              <input
                className={stylesLogin["input-recuerdame"]}
                type="checkbox"
              />
              <span>Recuérdame</span>
            </div>

            <div className={stylesLogin["div-enlaces"]}>
              <a href="/RegistroCliente">¿Aún no estás registrado?</a>
              <a href="/RecuperarContraseña">¿Olvidaste tu contraseña?</a>

              <button type="submit">Iniciar sesión</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;