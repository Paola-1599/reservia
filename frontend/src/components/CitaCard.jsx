
import styles from "../styles/CitaCard.module.css";


const CitaCard = ({ cita, onCancelar, onReprogramar }) => {

  const fecha = cita.fecha.slice(0, 10).split("-").reverse().join("/");
  
  return (
    <div className={styles.card}>
      <h3>Cita programada</h3>

      <p>
        <strong>Especialista:</strong> {cita.especialista.nombresApellidos}
      </p>
      <p>
        <strong>Fecha:</strong> {fecha}
      </p>
      <p>
        <strong>Hora:</strong> {cita.horaInicio} - {cita.horaFin}
      </p>

      {cita.estado === "programada" && (
        <button className={styles.cancelar} type="button" onClick={onCancelar}>
          Cancelar cita
        </button>
      )}

      {cita.estado === "cancelada" && (
        <button className={styles.reprogramar} type="button" onClick={onReprogramar}>
          Reprogramar cita
        </button>
      )}
    </div>
  );
};

export default CitaCard;