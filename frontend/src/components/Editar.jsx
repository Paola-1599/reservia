import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LayoutAdmin from "./Layouts/LayoutAdmin";
import styles from "../styles/Editar.module.css";
import IconAtras from "../includes/Back UpiconSvg.co.svg";

function Editar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [usuario, setUsuario] = useState({
    nombresApellidos: "",
    email: "",
    telefono: "",
    direccion: "",
    estadoUsuario: "activo",
  });

  // Cargar datos del usuario
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const token = localStorage.getItem("token");
        
        const res = await fetch(`http://localhost:4000/api/usuarios/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Usuario no encontrado");
        }

        const data = await res.json();
        
        setUsuario({
          nombresApellidos: data.nombresApellidos || "",
          email: data.email || "",
          telefono: data.telefono || "",
          direccion: data.direccion || "",
          estadoUsuario: data.estadoUsuario || "activo",
        });
      } catch (error) {
        console.error("Error al cargar usuario:", error);
        setError("Error al cargar los datos del usuario");
      } finally {
        setLoading(false);
      }
    };

    cargarUsuario();
  }, [id]);

  // Manejar cambios en los inputs
  function handleChange(e) {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
  }

  // Actualizar usuario
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      console.log("Datos a enviar:", usuario);

      const res = await fetch(`http://localhost:4000/api/usuarios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(usuario),
      });

      const data = await res.json();
      console.log("Respuesta del servidor:", data);

      if (!res.ok) {
        throw new Error(data.mensaje || "Error al actualizar usuario");
      }

      setSuccess("Usuario actualizado correctamente");
      
      // Redirigir después de 1.5 segundos
      setTimeout(() => {
        navigate("/TablaUsuarios");
      }, 1500);
    } catch (error) {
      console.error("Error al actualizar:", error);
      setError(error.message || "Error del servidor. Por favor, intente nuevamente más tarde.");
    }
  }

  if (loading) {
    return (
      <LayoutAdmin>
        <div className={styles.wrapper}>
          <div className={styles.loadingMessage}>
            <h2>Cargando...</h2>
          </div>
        </div>
      </LayoutAdmin>
    );
  }

  return (
    <LayoutAdmin>
      <div className={styles.wrapper}>
        <div className={styles.headerWrapper}>
          <button className={styles.btnAtras} onClick={() => navigate("/TablaUsuarios")}>
            <img className={styles.iconAtras} src={IconAtras} alt="Atrás" />
            Atrás
          </button>

          <h1 className={styles.title}>ACTUALIZAR USUARIO</h1>
        </div>

        <hr className={styles.hr} />

        <div className={styles.formContainer}>
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          {success && (
            <div className={styles.successMessage}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Nombre Completo:
              </label>
              <input
                type="text"
                name="nombresApellidos"
                value={usuario.nombresApellidos}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={usuario.email}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Teléfono:
              </label>
              <input
                type="tel"
                name="telefono"
                value={usuario.telefono}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Dirección:
              </label>
              <input
                type="text"
                name="direccion"
                value={usuario.direccion}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Estado:
              </label>
              <select
                name="estadoUsuario"
                value={usuario.estadoUsuario}
                onChange={handleChange}
                required
                className={styles.select}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="submit"
                className={styles.btnActualizar}
              >
                Actualizar
              </button>
              <button
                type="button"
                onClick={() => navigate("/TablaUsuarios")}
                className={styles.btnCancelar}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </LayoutAdmin>
  );
}

export default Editar;
