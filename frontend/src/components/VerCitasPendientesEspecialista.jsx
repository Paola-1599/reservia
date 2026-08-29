import { useEffect, useState } from "react";
import styles from "../styles/VerCitasPendientesEspecialista.module.css";
import LayoutEspecialistas from "./Layouts/LayoutEspecialistas.jsx";
import InputModal from "./modals/InputModal.jsx";

export default function VerCitasPendientesEspecialistas() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const token = localStorage.getItem("token");
  const id = usuario?.id;

  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [filtro, setFiltro] = useState("todas"); // todas, pendientes, canceladas
  const [mostrarModal, setMostrarModal] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);

  // Cargar citas del especialista
  const cargarCitas = async () => {
    if (!id) {
      setMsg("No se encontró ID del usuario. Inicia sesión.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:4000/api/citas/especialista/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al cargar las citas");
      }

      const data = await response.json();
      setCitas(data || []);
      setMsg("");
    } catch (error) {
      setMsg(`Error: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, [id, token]);

  // Cancelar una cita
  const handleCancelarCita = async (motivo) => {
    if (!citaSeleccionada) return;

    const motivoLimpio = (motivo || "").trim();
    if (!motivoLimpio) {
      setMsg(" Error: Debes ingresar un motivo de cancelación");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/api/citas/${citaSeleccionada}/cancelar`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            motivo: motivoLimpio,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al cancelar la cita");
      }

      setMsg("  Cita cancelada correctamente");
      setMostrarModal(false);
      setCitaSeleccionada(null);
      setTimeout(() => cargarCitas(), 500);
    } catch (error) {
      setMsg(` Error: ${error.message}`);
      console.error(error);
    }
  };

  // Filtrar citas según el estado
  const citasFiltradas = citas.filter((cita) => {
    if (filtro === "pendientes") {
      return cita.estado === "programada";
    } else if (filtro === "canceladas") {
      return cita.estado === "cancelada";
    }
    return true; // todas
  });

  const toSafeDate = (valor) => {
    if (!valor) return null;

    const parsed = new Date(valor);
    if (Number.isNaN(parsed)) return null;

    return new Date(
      parsed.getUTCFullYear(),
      parsed.getUTCMonth(),
      parsed.getUTCDate(),
      12,
      0,
      0,
      0
    );
  };

  // Ordenar citas por fecha descendente
  const citasOrdenadas = [...citasFiltradas].sort((a, b) => {
    const fechaB = toSafeDate(b.fecha);
    const fechaA = toSafeDate(a.fecha);

    return (fechaB?.getTime() ?? 0) - (fechaA?.getTime() ?? 0);
  });

  // Formatear fecha
  const formatearFecha = (fecha) => {
    const normalizada = toSafeDate(fecha);
    if (!normalizada) return "Fecha no disponible";

    return normalizada.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <LayoutEspecialistas> 
    <div className={styles.Contenedor}>
      

      <div className={styles.ContenedorPrincipal}>
        <div className={styles["div-atras"]}>
          <a href="/InicioEspecialista">
            <img src="Atras.svg" alt="" />
            Atrás
          </a>
        </div>

        <h2>VER CITAS PENDIENTES</h2>
        <hr className={styles.hrPersonalizada} />

        <header className={styles.header}>
          <div>
            <h2>Citas de clientes</h2>
            <p>
              Visualiza y gestiona todas las citas agendadas por tus clientes.
            </p>
          </div>
          <span className={styles.badge}>{citasOrdenadas.length} citas</span>
        </header>

        {/* Filtros */}
        
        <div className={styles.filtrosContainer}>
          <button
            className={`${styles.filtroBtn} ${
              filtro === "todas" ? styles.active : ""
            }`}
            onClick={() => setFiltro("todas")}
          >
            Todas ({citas.length})
          </button>
          <button
            className={`${styles.filtroBtn} ${
              filtro === "pendientes" ? styles.active : ""
            }`}
            onClick={() => setFiltro("pendientes")}
          >
            Programadas ({citas.filter((c) => c.estado === "programada").length})
          </button>
          <button
            className={`${styles.filtroBtn} ${
              filtro === "canceladas" ? styles.active : ""
            }`}
            onClick={() => setFiltro("canceladas")}
          >
            Canceladas ({citas.filter((c) => c.estado === "cancelada").length})
          </button>
        </div>

        {/* Mensaje de estado */}
        {msg && (
          <p
            className={`${styles.message} ${
              msg.includes("✅") ? styles.success : styles.error
            }`}
          >
            {msg}
          </p>
        )}

        {/* Listado de citas */}
        <div className={styles.citasListaContainer}>
          {loading && <p className={styles.cargando}>Cargando citas...</p>}

          {!loading && citasOrdenadas.length === 0 && (
            <p className={styles.sinCitas}>
              {filtro === "todas"
                ? "No hay citas agendadas aún."
                : filtro === "pendientes"
                ? "No hay citas programadas pendientes."
                : "No hay citas canceladas."}
            </p>
          )}

          <div className={styles.citasGrid}>
            {citasOrdenadas.map((cita) => (
              <div
                key={cita._id}
                className={`${styles.citaCard} ${
                  cita.estado === "cancelada" ? styles.cancelada : ""
                }`}
              >
                {/* Encabezado de la cita */}
                <div className={styles.citaHeader}>
                  <div className={styles.citaInfo}>
                    <h3 className={styles.clienteName}>
                      {cita.cliente.nombresApellidos}
                    </h3>
                    <p className={styles.estadoCita}>
                      {cita.estado === "programada" ? (
                        <span className={styles.programada}>✓ Programada</span>
                      ) : (
                        <span className={styles.canceladaTag}>✗ Cancelada</span>
                      )}
                    </p>
                  </div>
                </div>

                <hr className={styles.divider} />

                {/* Bloque de información de la cita */}
                <div className={styles.citaDetalles}>
                  <div className={styles.detalleItem}>
                    <span className={styles.label}> Fecha:</span>
                    <span className={styles.value}>
                      {formatearFecha(cita.fecha)}
                    </span>
                  </div>

                  <div className={styles.detalleItem}>
                    <span className={styles.label}>🕒 Horario:</span>
                    <span className={styles.horario}>
                      {cita.horaInicio} - {cita.horaFin}
                    </span>
                  </div>

                  <div className={styles.detalleItem}>
                    <span className={styles.label}> Email cliente:</span>
                    <span className={styles.value}>{cita.cliente.email}</span>
                  </div>

                  <div className={styles.detalleItem}>
                    <span className={styles.label}> Teléfono:</span>
                    <span className={styles.value}>
                      {cita.cliente.telefono}
                    </span>
                  </div>

                  {cita.estado === "cancelada" && cita.motivoCancelacion && (
                    <div className={styles.detalleItem}>
                      <span className={styles.label}>Motivo cancelación:</span>
                      <span className={styles.value}>
                        {cita.motivoCancelacion}
                      </span>
                    </div>
                  )}
                </div>

                {/* Botón de acción */}
                {cita.estado === "programada" && (
                  <button
                    className={styles.cancelarBtn}
                    onClick={() => {
                      setCitaSeleccionada(cita._id);
                      setMostrarModal(true);
                    }}
                  >
                    🗑 Cancelar cita
                  </button>
                )}

                {cita.estado === "cancelada" && (
                  <div className={styles.citaCanceladaInfo}>
                    <p>Cita cancelada</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <InputModal
        isOpen={mostrarModal}
        title="¿Estas seguro que deseas cancelar la cita agendada?"
        label="Indica el motivo de cancelación"
        onConfirm={handleCancelarCita}
        onClose={() => {
          setMostrarModal(false);
          setCitaSeleccionada(null);
        }}
      />
    </div>
    </LayoutEspecialistas>
  );
}
