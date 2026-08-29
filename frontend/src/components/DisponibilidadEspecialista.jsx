import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import IconoAtras from "../includes/Back UpiconSvg.co.svg";
import { DayPicker } from 'react-day-picker';
import { es } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';
import { useSearchParams } from "react-router-dom";
import LayoutCliente from './Layouts/LayoutCliente';
import styles from '../styles/DisponibilidadEspecialista.module.css';

const DisponibilidadEspecialistas = () => {
    const { especialistaId } = useParams();
    const navigate = useNavigate();

    // Estados
    const [diasDisponibles, setDiasDisponibles] = useState([]);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
    const [bloquesDisponibles, setBloquesDisponibles] = useState([]);
    const [bloqueSeleccionado, setBloqueSeleccionado] = useState(null);
    const [cargando, setCargando] = useState(true);

    // Para reprogramación
    const [searchParams] = useSearchParams();
    const esReprogramacion = searchParams.get("reprogramar") === "true";
    const citaId = searchParams.get("citaId");

    //parsear fecha sin zona horaria
    const parseFechaLocal =(fechaISO) => {
        const [year, month, day] = fechaISO.split("-");
        return new Date(year, month - 1, day);
    };

    // Obtener días disponibles
    useEffect(() => {
        setCargando(true);

        fetch(`http://localhost:4000/api/agendas/especialista/${especialistaId}`)
            .then(res => res.json())
            .then(data => {
                setDiasDisponibles(data);
                setCargando(false);
            })
            .catch(err => {
                console.error(err);
                setCargando(false);
            });
    }, [especialistaId]);

    // Obtener bloques disponibles al seleccionar una fecha
    const seleccionarFecha = (fecha) => {
        setFechaSeleccionada(fecha);
        setBloqueSeleccionado(null);

        fetch(`http://localhost:4000/api/agendas/especialista/${especialistaId}/${fecha}`)
            .then(res => res.json())
            .then(data => {
                const disponibles = data.bloques.filter(b => b.disponible);
                setBloquesDisponibles(disponibles);
            })
            .catch(err => console.error(err));
    };

    // Continuar al resumen de la cita
    const continuar = async () => {
    if (!fechaSeleccionada || !bloqueSeleccionado) return;
    
   // Si es reprogramación
    if (esReprogramacion) {
        await fetch(`http://localhost:4000/api/citas/${citaId}/reprogramar`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
            fecha: fechaSeleccionada,
            horaInicio: bloqueSeleccionado.horaInicio,
            horaFin: bloqueSeleccionado.horaFin,
        }),
        });

        navigate("/InicioCliente");
    } else {
        // flujo normal
        localStorage.setItem("fechaCita", fechaSeleccionada);
        localStorage.setItem("horaInicio", bloqueSeleccionado.horaInicio);
        localStorage.setItem("horaFin", bloqueSeleccionado.horaFin);
        navigate("/resumenCita");
    }
    };

    // Convertir las fechas a objetos Date
    const fechasDisponibles = Array.isArray(diasDisponibles)
        ? diasDisponibles.map(f => parseFechaLocal(f.slice(0, 10)))
        : [];

    // Función para comparar fechas sin la hora
    const esMismaFecha = (a, b) =>
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();



    return (

        <LayoutCliente>
        <div className={styles.CajaPadre}>
            <div className={styles.headerSeleccionarEspecialistas}>
                <button
                    type='button'
                    className={styles.btnAtras}
                    onClick={() => window.history.back()}
                >
                    <img src={IconoAtras} alt="Atrás" className={styles.iconAtras} />
                    Atrás
                </button>
                <h1>SELECCIONAR FECHA Y HORA</h1>
            </div>
            <hr />

            <div className={styles.contenedor}>
                {/* Calendario */}
                <div className={styles.calendario}>
                    <DayPicker mode="single"
                     selected={fechaSeleccionada ? 
                        parseFechaLocal(fechaSeleccionada) : undefined} 
                     onSelect={(date) => { if (!date) return; const fechaISO = date.toLocaleDateString("sv-SE"); seleccionarFecha(fechaISO); }} 
                     disabled={(date) => !fechasDisponibles.some( d => d.toDateString() === date.toDateString() ) } 
                     modifiers={{ disponible: fechasDisponibles }} 
                     modifiersClassNames={{ disponible: styles.diaDisponible, selected: styles.diaActivo }} 
                     locale={es} />
                </div>

                {/* Bloques de hora */}
                {fechaSeleccionada && (
                    <div className={styles.bloques}>
                        <h2>Horarios disponibles</h2>

                        {bloquesDisponibles.length === 0 && (
                            <p>No hay bloques disponibles para esta fecha</p>
                        )}

                        <div className={styles.bloquesGrid}>
                            {bloquesDisponibles.map((bloque, index) => (
                                <button
                                    key={index}
                                    className={`${styles.bloque} ${
                                        bloqueSeleccionado === bloque ? styles.bloqueActivo : ""
                                    }`}
                                    onClick={() => setBloqueSeleccionado(bloque)}
                                >
                                    {bloque.horaInicio} - {bloque.horaFin}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Botón continuar */}
                <button
                    className={styles.botonContinuar}
                    disabled={!bloqueSeleccionado}
                    onClick={continuar}
                >
                    Continuar
                </button>
            </div>
        </div>
        </LayoutCliente>
    );
};

export default DisponibilidadEspecialistas;