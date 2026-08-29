import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ResumenCita.module.css";
import IconoAtras from "../includes/Back UpiconSvg.co.svg";
import LayoutCliente from "./Layouts/LayoutCliente";

const ResumenCita = () => {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState(null);
    const [servicio , setServicio] = useState(null);
    const [especialista, setEspecialista] = useState(null);
    const [fechaCita, setFechaCita] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFin, setHoraFin] = useState("");

    useEffect(() => {
        const usuarioLS = localStorage.getItem("usuario");
        const servicioLS = localStorage.getItem("servicioSeleccionado");
        const especialistaLS = localStorage.getItem("especialistaSeleccionado");

        const fechaLS = localStorage.getItem("fechaCita");
        const horaInicioLS = localStorage.getItem("horaInicio");
        const horaFinLS = localStorage.getItem("horaFin");

        // Validación general
        if (
            !usuarioLS ||
            !servicioLS ||
            !especialistaLS ||
            !fechaLS ||
            !horaInicioLS ||
            !horaFinLS
        ) {
            alert("Faltan datos para mostrar el resumen de la cita.");
            navigate("/catalogo");
            return;
        }

        setUsuario(JSON.parse(usuarioLS));
        setServicio(JSON.parse(servicioLS));
        setEspecialista(JSON.parse(especialistaLS));

        setFechaCita(fechaLS);
        setHoraInicio(horaInicioLS);
        setHoraFin(horaFinLS);
    }, [navigate]);

    const confirmarCita = async () => {
        navigate("/realizarPago");
    };

    if (!usuario || !servicio || !especialista) {
        return <p className={styles.cargando}>Cargando resumen...</p>;
    }

    

    return (

        <LayoutCliente>
        <div className={styles.contenedor}>
            <div className={styles.headerResumenCita}>
                <button
                    type='button'
                    className={styles.btnAtras}
                    onClick={() => window.history.back()}
                >
                
                    <img src={IconoAtras} alt="Atrás" className={styles.iconAtras} />
                    Atrás
                </button>
                <h1>RESUMEN DE LA CITA</h1>
            </div>
            <hr />

            <div className={styles.card}>
                <h2>Cliente</h2>
                <p><strong>Nombre:</strong> {usuario.nombresApellidos}</p>
                <p><strong>Email:</strong> {usuario.email}</p>
            </div>

            <div className={styles.card}>
                <h2>Servicio</h2>
                <p><strong>Nombre del Servicio:</strong> {servicio.nombreServicio}</p>
                <p><strong>Descripción:</strong> {servicio.descripcionServicio}</p>
                <p><strong>Precio:</strong> ${servicio.precioServicio}</p>
            </div>

            <div className={styles.card}>
                <h2>Especialista</h2>
                <p><strong>Nombre:</strong> {especialista.nombresApellidos}</p>
            </div>

            <div className={styles.card}>
                <h2>Detalles de la Cita</h2>
                <p><strong>Fecha:</strong> {fechaCita}</p>
                <p><strong>Hora:</strong> {horaInicio} - {horaFin}</p>
            </div>

            <button className={styles.botonConfirmar} onClick={confirmarCita}>
                Confirmar y pagar
            </button>
        </div>
        </LayoutCliente>
    );
};

export default ResumenCita;
