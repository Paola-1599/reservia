import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowRight, FaCircleCheck } from "react-icons/fa6";
import styles from "../styles/Bienvenida.module.css";

const roleConfig = {
  cliente: {
    title: "Bienvenida, cliente",
    subtitle: "Tu panel está listo. Aquí puedes revisar tus citas, servicios y seguimiento.",
    destination: "/InicioCliente",
  },
  especialista: {
    title: "Bienvenida, especialista",
    subtitle: "Ya puedes gestionar tu agenda, revisar citas y organizar tu jornada.",
    destination: "/InicioEspecialista",
  },
  admin: {
    title: "Bienvenida, administrador",
    subtitle: "Tu panel central te espera para administrar servicios, usuarios y métricas.",
    destination: "/InicioAdmin",
  },
};

function Bienvenida() {
  const navigate = useNavigate();
  const { rol } = useParams();
  const rolNormalizado = rol;
  const config = roleConfig[rolNormalizado] || roleConfig.cliente;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(config.destination, { replace: true });
    }, 2200);

    return () => clearTimeout(timer);
  }, [config.destination, navigate]);

  return (
    <div className={styles.page}>
      <div className={styles.orbOne} />
      <div className={styles.orbTwo} />
      <div className={styles.card}>
        <div className={styles.badge}>
          <FaCircleCheck />
          <span>Acceso confirmado</span>
        </div>

        <h1>{config.title}</h1>
        <p>{config.subtitle}</p>

        <div className={styles.progressTrack}>
          <div className={styles.progressBar} />
        </div>

        <button type="button" onClick={() => navigate(config.destination, { replace: true })}>
          Ir al panel <FaArrowRight />
        </button>
      </div>
    </div>
  );
}

export default Bienvenida;