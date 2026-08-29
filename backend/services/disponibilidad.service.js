import { getPool } from "../config/db.js";
import { toDateOnly, toId, toTimeHHMM } from "../utils/mysqlMappers.js";

// Normaliza una fecha a medianoche UTC
const normalizarFecha = (fecha) => {
  const d = toDateOnly(fecha);
  if (!d) throw new Error("Fecha invalida");
  return d;
};

const mapAgendaConBloques = (agendaRow, bloquesRows) => ({
  _id: toId(agendaRow.id),
  id: toId(agendaRow.id),
  especialista: toId(agendaRow.especialista),
  fecha: toDateOnly(agendaRow.fecha),
  creadoEn: agendaRow.creadoEn,
  bloques: bloquesRows.map((b) => ({
    horaInicio: toTimeHHMM(b.horaInicio),
    horaFin: toTimeHHMM(b.horaFin),
    disponible: Boolean(b.disponible),
  })),
});

// Servicio para listar agendas de un especialista
export const listarAgendasSvc = async (especialistaId) => {
  const pool = getPool();
  const [agendas] = await pool.query(
    `SELECT id, especialista, fecha, creadoEn
     FROM agendas
     WHERE especialista = ?
     ORDER BY fecha ASC`,
    [especialistaId]
  );

  if (agendas.length === 0) return [];

  const agendaIds = agendas.map((a) => a.id);
  const [bloques] = await pool.query(
    `SELECT agenda_id, horaInicio, horaFin, disponible
     FROM agenda_bloques
     WHERE agenda_id IN (?)
     ORDER BY horaInicio ASC`,
    [agendaIds]
  );

  return agendas.map((agenda) => {
    const bloquesAgenda = bloques.filter((b) => b.agenda_id === agenda.id);
    return mapAgendaConBloques(agenda, bloquesAgenda);
  });
};

// Servicio para crear una nueva agenda o agregar bloques a una existente
export const crearAgendaSvc = async ({ especialista, fecha, bloques }) => {
  const pool = getPool();
  const especialistaId = especialista;
  if (!especialistaId) throw new Error("especialista es requerido");
  const fechaNormalizada = normalizarFecha(fecha);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [existenteRows] = await conn.query(
      `SELECT id, especialista, fecha, creadoEn
       FROM agendas
       WHERE especialista = ? AND fecha = ?
       LIMIT 1`,
      [especialistaId, fechaNormalizada]
    );

    let agendaRow = existenteRows[0];
    if (!agendaRow) {
      const [insAgenda] = await conn.query(
        `INSERT INTO agendas (especialista, fecha)
         VALUES (?, ?)`,
        [especialistaId, fechaNormalizada]
      );

      const [agendaNuevaRows] = await conn.query(
        `SELECT id, especialista, fecha, creadoEn
         FROM agendas
         WHERE id = ?
         LIMIT 1`,
        [insAgenda.insertId]
      );
      agendaRow = agendaNuevaRows[0];
    }

    for (const b of bloques || []) {
      await conn.query(
        `INSERT INTO agenda_bloques (agenda_id, horaInicio, horaFin, disponible)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE disponible = VALUES(disponible)`,
        [
          agendaRow.id,
          `${toTimeHHMM(b.horaInicio)}:00`,
          `${toTimeHHMM(b.horaFin)}:00`,
          typeof b.disponible === "boolean" ? Number(b.disponible) : 1,
        ]
      );
    }

    const [bloquesRows] = await conn.query(
      `SELECT agenda_id, horaInicio, horaFin, disponible
       FROM agenda_bloques
       WHERE agenda_id = ?
       ORDER BY horaInicio ASC`,
      [agendaRow.id]
    );

    await conn.commit();
    return mapAgendaConBloques(agendaRow, bloquesRows);
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

// Servicio para actualizar un bloque específico en una agenda es decir indicar "disponible" o "no disponible"
export const actualizarBloqueSvc = async (agendaId, bloqueIndex, data) => {
  const pool = getPool();
  const [agendaRows] = await pool.query(
    `SELECT id, especialista, fecha, creadoEn
     FROM agendas
     WHERE id = ?
     LIMIT 1`,
    [agendaId]
  );
  const agenda = agendaRows[0];
  if (!agenda) throw new Error("Agenda no encontrada");

  const [bloques] = await pool.query(
    `SELECT id, horaInicio, horaFin, disponible
     FROM agenda_bloques
     WHERE agenda_id = ?
     ORDER BY horaInicio ASC`,
    [agendaId]
  );
  if (bloqueIndex < 0 || bloqueIndex >= bloques.length) throw new Error("Bloque invalido");

  const bloque = bloques[bloqueIndex];
  const horaInicio = data.horaInicio ? `${toTimeHHMM(data.horaInicio)}:00` : bloque.horaInicio;
  const horaFin = data.horaFin ? `${toTimeHHMM(data.horaFin)}:00` : bloque.horaFin;
  const disponible = typeof data.disponible === "boolean" ? Number(data.disponible) : bloque.disponible;

  await pool.query(
    `UPDATE agenda_bloques
     SET horaInicio = ?, horaFin = ?, disponible = ?
     WHERE id = ?`,
    [horaInicio, horaFin, disponible, bloque.id]
  );

  const [actualizados] = await pool.query(
    `SELECT agenda_id, horaInicio, horaFin, disponible
     FROM agenda_bloques
     WHERE agenda_id = ?
     ORDER BY horaInicio ASC`,
    [agendaId]
  );

  return mapAgendaConBloques(agenda, actualizados);
};


// Servicio para eliminar un bloque específico en una agenda o eliminar toda la agenda si es el último bloque

export const eliminarBloqueSvc = async (agendaId, bloqueIndex) => {
  const pool = getPool();
  const [agendaRows] = await pool.query(
    `SELECT id, especialista, fecha, creadoEn
     FROM agendas
     WHERE id = ?
     LIMIT 1`,
    [agendaId]
  );
  const agenda = agendaRows[0];
  if (!agenda) throw new Error("Agenda no encontrada");

  const [bloques] = await pool.query(
    `SELECT id
     FROM agenda_bloques
     WHERE agenda_id = ?
     ORDER BY horaInicio ASC`,
    [agendaId]
  );

  if (bloqueIndex < 0 || bloqueIndex >= bloques.length) {
    throw new Error("Bloque invalido");
  }

  await pool.query("DELETE FROM agenda_bloques WHERE id = ?", [bloques[bloqueIndex].id]);

  const [restantes] = await pool.query(
    `SELECT agenda_id, horaInicio, horaFin, disponible
     FROM agenda_bloques
     WHERE agenda_id = ?
     ORDER BY horaInicio ASC`,
    [agendaId]
  );

  if (restantes.length === 0) {
    await pool.query("DELETE FROM agendas WHERE id = ?", [agendaId]);
    return { mensaje: "Ultimo bloque eliminado, agenda borrada" };
  }

  return mapAgendaConBloques(agenda, restantes);
};