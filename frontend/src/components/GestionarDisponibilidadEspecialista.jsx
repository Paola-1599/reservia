import { useEffect, useMemo, useState } from "react";
import styles from "../styles/GestionarDisponibilidadEspecialista.module.css";
import LayoutEspecialistas from "./Layouts/LayoutEspecialistas.jsx";
import {
  fetchAgendas,
  crearAgenda,
  actualizarBloque,
  eliminarAgenda,
  eliminarBloque, 
} from "../api/disponibilidadApi.js";

// Generar intervalos de 30 minutos de 8:00 a 20:30
const generarHorarios = () => {
  const horarios = [];
  for (let h = 8; h <= 20; h++) {
    horarios.push(`${h.toString().padStart(2, "0")}:00`);
    if (h < 20) horarios.push(`${h.toString().padStart(2, "0")}:30`);
  }
  return horarios;
};

// Constantes para meses y días
const horarios = generarHorarios();
const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

// Función para convertir fecha a formato YYYY-MM-DD
const toYMD = (date) => {
  const d = new Date(date);
  d.setHours(12, 0, 0, 0);
  return d.toLocaleDateString("en-CA");
};

// Componente principal
export default function GestionarDisponibilidadEspecialistas({ colorPrimario = "#F97316" }) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const id = usuario?.id;
  
  // Estados del componente
  const [fecha, setFecha] = useState("");
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth());
  const [anoSeleccionado, setAnoSeleccionado] = useState(new Date().getFullYear());
  const [rangos, setRangos] = useState([{ inicio: "09:00", fin: "10:00" }]);
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

// Función para cargar agendas

  const cargar = async () => {
    if (!id) {
      setMsg(" No se encontró ID del usuario. Inicia sesión.");
      return;
    }

  // Cargar agendas desde la API

    setLoading(true);
    try {
      const data = await fetchAgendas(id);
      setAgendas(data);
      setMsg("");
    } catch (e) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, [id]);

  // Manejadores de eventos

  const handleAddRango = () => setRangos([...rangos, { inicio: "10:00", fin: "11:00" }]);
  
  const handleRemoveRango = (idx) => {
    if (rangos.length === 1) return;
    setRangos(rangos.filter((_, i) => i !== idx));
  };

  const handleRangoChange = (idx, field, value) => {
    setRangos(rangos.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  };

  // Crear nueva agenda
  const handleCrearAgenda = async (e) => {
    e.preventDefault();
    if (!fecha || !rangos.length || !id) {
      setMsg("Completa todos los campos e inicia sesión");
      return;
    }
    setLoading(true);
    try {
      const bloques = rangos.map(r => ({ horaInicio: r.inicio, horaFin: r.fin, disponible: true }));
      await crearAgenda({ especialista: id, fecha, bloques });
      setMsg("Agenda creada exitosamente");
      setRangos([{ inicio: "09:00", fin: "10:00" }]);
      setFecha("");
      setTimeout(() => cargar(), 500);
    } catch (e) {
      setMsg(` ${e.message}`);
    } finally {
      setLoading(false);
    }
  };


  // Actualizar disponibilidad de un bloque, se puede deshabilitar para que sea invisible al cliente pero sin eliminarla.
  
  const handleToggleDisponible = async (agendaId, id, disponible) => {
    try {
      await actualizarBloque(agendaId, id, { disponible });
      await cargar();
      setMsg("Bloque actualizado");
    } catch (e) {
      setMsg(` ${e.message}`);
    }
  };


  // Eliminar un bloque horario específico de una agenda y también eliminar la agenda si queda sin bloques.

  const handleEliminarBloque = async (agendaId, bloqueIndex) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este bloque horario?")) return;
    try {
      await eliminarBloque(agendaId, bloqueIndex); 
      await cargar();
      setMsg("Bloque horario eliminado");
    } catch (e) {
      setMsg(` ${e.message}`);
    }
  };

  // Crear un objeto calendario para acceso rápido a las agendas por fecha
  const calendario = useMemo(() => {
    return agendas.reduce((acc, ag) => {
      const key = (ag.fecha || "").split("T")[0];
      acc[key] = ag;
      return acc;
    }, {});
  }, [agendas]);


  // Generar calendario del mes seleccionado

  const generarCalendario = () => {
    const primerDia = new Date(anoSeleccionado, mesSeleccionado, 1);
    const ultimoDia = new Date(anoSeleccionado, mesSeleccionado + 1, 0);
    const diasAnterior = primerDia.getDay();
    const diasDelMes = ultimoDia.getDate();
    const diasSiguiente = 6 - ultimoDia.getDay();

    const diasArray = [];
    const ultimoDiaAnterior = new Date(anoSeleccionado, mesSeleccionado, 0).getDate();
    
    for (let i = diasAnterior - 1; i >= 0; i--) {
      diasArray.push({ dia: ultimoDiaAnterior - i, actual: false });
    }
    for (let i = 1; i <= diasDelMes; i++) {
      diasArray.push({ dia: i, actual: true });
    }
    for (let i = 1; i <= diasSiguiente; i++) {
      diasArray.push({ dia: i, actual: false });
    }
    return diasArray;
  };

  // Seleccionar día del calendario

  const handleSelectDia = (dia) => {
    const mes = String(mesSeleccionado + 1).padStart(2, "0");
    const diaStr = String(dia).padStart(2, "0");
    const fechaFormato = `${anoSeleccionado}-${mes}-${diaStr}`;
    setFecha(fechaFormato);
  };


 
  // Cambiar mes en el calendario VAMOS AQUI

  const handleCambiarMes = (direccion) => {
    if (direccion === -1) {
      if (mesSeleccionado === 0) {
        setMesSeleccionado(11);
        setAnoSeleccionado(anoSeleccionado - 1);
      } else {
        setMesSeleccionado(mesSeleccionado - 1);
      }
    } else {
      if (mesSeleccionado === 11) {
        setMesSeleccionado(0);
        setAnoSeleccionado(anoSeleccionado + 1);
      } else {
        setMesSeleccionado(mesSeleccionado + 1);
      }
    }
  };


  // Generar días del calendario para el mes seleccionado 

  const diasCalendario = generarCalendario();

  // Agrupar bloques por fecha y hora
  const bloquesIndividuales = useMemo(() => {
    const lista = [];
    agendas.forEach(ag => {
      const fechaKey = (ag.fecha || "").split("T")[0];
      ag.bloques.forEach((b, idx) => {
        lista.push({
          agendaId: ag._id,
          bloqueIndex: idx,
          fecha: fechaKey,
          ...b
        });
      });
    });

    // Ordenar por fecha descendente, luego por hora
    return lista.sort((a, b) => {
      if (b.fecha !== a.fecha) return b.fecha.localeCompare(a.fecha);
      return a.horaInicio.localeCompare(b.horaInicio);
    });
  }, [agendas]);

  // estructura del componente
  return (
    <LayoutEspecialistas> 
    <div className={styles.Contenedor}>
      
      
      <div className={styles.ContenedorCalendario}>
        <div className={styles["div-atras"]}>
          <img src="Atras.svg" alt="" />
          <a href="/InicioEspecialista">Atras</a>
        </div>
        
        <h2>GESTIONAR DISPONIBILIDAD</h2>
        <hr className={styles.hrPersonalizada} />
        
        <header className={styles.header} style={{ borderColor: colorPrimario }}>
          <div>
            <h2>Disponibilidad</h2>
            <p>Abre, edita o elimina tu agenda por bloque horario.</p>
          </div>
          <span className={styles.badge} style={{ background: colorPrimario }}>
            {usuario?.rol === "especialista" ? "Especialista" : "Usuario"}
          </span>
        </header>

        <section className={styles.formCard}>
          <h3>Abrir agenda</h3>
          <form className={styles.form} onSubmit={handleCrearAgenda}>
            
            <div className={styles.calendarSelector}>
              <div className={styles.calendarHeader}>
                <button type="button" onClick={() => handleCambiarMes(-1)}>←</button>
                <span>{meses[mesSeleccionado]} {anoSeleccionado}</span>
                <button type="button" onClick={() => handleCambiarMes(1)}>→</button>
              </div>

              <div className={styles.daysOfWeek}>
                {dias.map(d => <div key={d}>{d}</div>)}
              </div>

              <div className={styles.calendarDays}>
                {diasCalendario.map((d, idx) => {
                  const mesStr = String(mesSeleccionado + 1).padStart(2, "0");
                  const diaStr = String(d.dia).padStart(2, "0");
                  const fechaCheck = `${anoSeleccionado}-${mesStr}-${diaStr}`;
                  const tieneAgenda = calendario[fechaCheck];
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`${styles.dayBtn} ${!d.actual ? styles.disabled : ""} ${fecha === fechaCheck ? styles.selected : ""} ${tieneAgenda ? styles.hasAgenda : ""}`}
                      onClick={() => d.actual && handleSelectDia(d.dia)}
                      disabled={!d.actual}
                    >
                      {d.dia}
                    </button>
                  );
                })}
              </div>

              {fecha && <p className={styles.fechaSeleccionada}>Fecha seleccionada: <strong>{new Date(`${fecha}T12:00:00`).toLocaleDateString("es-ES")}</strong></p>}
            </div>

            <div className={styles.field}>
              <div className={styles.rangosHeader}>
                <span>Franjas horarias (30 min mínimo)</span>
                <button type="button" onClick={handleAddRango}>+ Añadir franja</button>
              </div>
              {rangos.map((r, idx) => (
                <div key={idx} className={styles.rangoRow}>
                  <select value={r.inicio} onChange={e => handleRangoChange(idx, "inicio", e.target.value)}>
                    {horarios.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                  <span>a</span>
                  <select value={r.fin} onChange={e => handleRangoChange(idx, "fin", e.target.value)}>
                    {horarios.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                  {rangos.length > 1 && (
                    <button type="button" className={styles.removeBtn} onClick={() => handleRemoveRango(idx)}>✕</button>
                  )}
                </div>
              ))}
            </div>

            <button className={styles.primary} type="submit" disabled={loading || !fecha || !id}>
              {loading ? "Guardando..." : "Guardar agenda"}
            </button>
          </form>
          {msg && <p className={`${styles.message} ${msg.includes("✅") ? styles.success : styles.error}`}>{msg}</p>}
        </section>

        <section className={styles.listCard}>
          <h3>Agenda abierta</h3>
          {loading && <p>Cargando...</p>}
          {!loading && bloquesIndividuales.length === 0 && <p>No hay bloques horarios abiertos.</p>}
          <div className={styles.bloquesLista}>
            {bloquesIndividuales.map((b, idx) => (
              <div key={`${b.agendaId}-${b.bloqueIndex}`} className={styles.bloqueCard}>
                <div className={styles.bloqueHeader}>
                  <div className={styles.bloqueInfo}>
                    <strong>{new Date(`${b.fecha}T12:00:00`).toLocaleDateString("es-ES", { weekday: 'short', month: 'short', day: 'numeric' })}</strong>
                    <span className={styles.bloqueHora}>🕒 {b.horaInicio} - {b.horaFin}</span>
                  </div>
                  <button 
                    className={styles.dangerSmall} 
                    onClick={() => handleEliminarBloque(b.agendaId, b.bloqueIndex)}
                  >
                    🗑 Eliminar
                  </button>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={b.disponible}
                    onChange={e => handleToggleDisponible(b.agendaId, b.bloqueIndex, e.target.checked)}
                  />
                  <span className={b.disponible ? styles.disponible : styles.noDisponible}>
                    {b.disponible ? "Disponible" : " No disponible"}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.calendarCard}>
          <h3>Calendario rápido (próximos 28 días)</h3>
          <div className={styles.calendarGrid}>
            {Array.from({ length: 28 }, (_, i) => {
              const day = new Date();
              day.setHours(12, 0, 0, 0);
              day.setDate(day.getDate() + i);
              const key = toYMD(day);
              const ag = calendario[key];
              return (
                <div key={key} className={`${styles.day} ${ag ? styles.dayWithAgenda : ""}`}>
                  <span>{day.toLocaleDateString("es-ES")}</span>
                  {ag && <small>{ag.bloques.length} bloques</small>}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
    </LayoutEspecialistas>
  );
}