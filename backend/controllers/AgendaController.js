import { getPool } from "../config/db.js";
import { crearAgendaSvc } from "../services/disponibilidad.service.js";
import { toDateOnly, toTimeHHMM } from "../utils/mysqlMappers.js";

const mapAgenda = (agendaRow, bloquesRows) => ({
  _id: String(agendaRow.id),
  id: String(agendaRow.id),
  especialista: String(agendaRow.especialista),
  fecha: toDateOnly(agendaRow.fecha),
  creadoEn: agendaRow.creadoEn,
  bloques: bloquesRows.map((b) => ({
    horaInicio: toTimeHHMM(b.horaInicio),
    horaFin: toTimeHHMM(b.horaFin),
    disponible: Boolean(b.disponible),
  })),
});

/**
 * Obtener agenda de un especialista por fecha
 * GET /api/agendas/especialista/:especialistaId/:fecha
 */
export const obtenerAgendaEspecialista = async (req, res) => {
  try {
    const pool = getPool();
    const { especialistaId, fecha } = req.params;

    const [agendaRows] = await pool.query(
      `SELECT id, especialista, fecha, creadoEn
       FROM agendas
       WHERE especialista = ? AND fecha = ?
       LIMIT 1`,
      [especialistaId, toDateOnly(fecha)]
    );
    const agenda = agendaRows[0];

    if (!agenda) {
      return res.status(404).json({ mensaje: "Agenda no encontrada" });
    }

    const [bloques] = await pool.query(
      `SELECT horaInicio, horaFin, disponible
       FROM agenda_bloques
       WHERE agenda_id = ?
       ORDER BY horaInicio ASC`,
      [agenda.id]
    );

    res.json(mapAgenda(agenda, bloques));
  } catch (error) {
    console.error("Error obtenerAgendaEspecialista:", error);
    res.status(500).json({ mensaje: "Error al obtener agenda" });
  }
};

/**
 * Obtener días disponibles de un especialista
 * GET /api/agendas/especialista/:especialistaId
 */
export const obtenerDiasDisponibles = async (req, res) => {
  try {
    const pool = getPool();
    const { especialistaId } = req.params;

    const [rows] = await pool.query(
      `SELECT DISTINCT a.fecha
       FROM agendas a
       INNER JOIN agenda_bloques b ON b.agenda_id = a.id
       WHERE a.especialista = ? AND b.disponible = 1
       ORDER BY a.fecha ASC`,
      [especialistaId]
    );

    res.json(rows.map((row) => toDateOnly(row.fecha)));
  } catch (error) {
    console.error("Error obtenerDiasDisponibles:", error);
    res.status(500).json({ mensaje: "Error al obtener días disponibles" });
  }
};

/**
 * Crear una agenda
 * POST /api/agendas
 */
export const crearAgenda = async (req, res) => {
  try {
    const { especialista, fecha, bloques } = req.body;
    if (!especialista || !fecha || !Array.isArray(bloques) || bloques.length === 0) {
      return res.status(400).json({
        mensaje: "Faltan datos obligatorios"
      });
    }

    const nuevaAgenda = await crearAgendaSvc({ especialista, fecha, bloques });

    res.status(201).json({
      mensaje: "Agenda creada correctamente",
      agenda: nuevaAgenda
    });
  } catch (error) {
    console.error("Error crearAgenda:", error);
    res.status(500).json({ mensaje: "Error al crear agenda" });
  }
};

/**
 * Ver disponibilidad de un especialista en una fecha
 * POST /api/agendas/disponible
 */
export const obtenerDisponibilidadEspecialista = async (req, res) => {
  try {
    const pool = getPool();
    const { especialistaId, fecha } = req.body;

    const [agendaRows] = await pool.query(
      `SELECT id
       FROM agendas
       WHERE especialista = ? AND fecha = ?
       LIMIT 1`,
      [especialistaId, toDateOnly(fecha)]
    );

    const agenda = agendaRows[0];

    if (!agenda) {
      return res.json({ disponible: false });
    }

    const [rows] = await pool.query(
      `SELECT 1
       FROM agenda_bloques
       WHERE agenda_id = ? AND disponible = 1
       LIMIT 1`,
      [agenda.id]
    );

    const disponible = rows.length > 0;

    res.json({ disponible });
  } catch (error) {
    console.error("Error obtenerDisponibilidadEspecialista:", error);
    res.status(500).json({ mensaje: "Error al verificar disponibilidad" });
  }
};
