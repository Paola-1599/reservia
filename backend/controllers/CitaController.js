import { getPool } from "../config/db.js";
import { toDateOnly, toId, toTimeHHMM } from "../utils/mysqlMappers.js";

const mapCitaConEspecialista = (row) => ({
  _id: toId(row.id),
  id: toId(row.id),
  cliente: toId(row.cliente),
  especialista: {
    _id: toId(row.especialista),
    id: toId(row.especialista),
    nombresApellidos: row.especialistaNombre,
  },
  fecha: toDateOnly(row.fecha),
  horaInicio: toTimeHHMM(row.horaInicio),
  horaFin: toTimeHHMM(row.horaFin),
  estado: row.estado,
  motivoCancelacion: row.motivoCancelacion,
  canceladaPor: row.canceladaPor,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

const mapCitaConClienteYEspecialista = (row) => ({
  _id: toId(row.id),
  id: toId(row.id),
  cliente: {
    _id: toId(row.cliente),
    id: toId(row.cliente),
    nombresApellidos: row.clienteNombre,
    email: row.clienteEmail,
    telefono: row.clienteTelefono,
  },
  especialista: {
    _id: toId(row.especialista),
    id: toId(row.especialista),
    nombresApellidos: row.especialistaNombre,
  },
  fecha: toDateOnly(row.fecha),
  horaInicio: toTimeHHMM(row.horaInicio),
  horaFin: toTimeHHMM(row.horaFin),
  estado: row.estado,
  motivoCancelacion: row.motivoCancelacion,
  canceladaPor: row.canceladaPor,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

// Obtener citas de un cliente

// Obtener citas pendientes del cliente
export const obtenerCitaCliente = async (req, res) => {
  try {
    const pool = getPool();
    const { cliente } = req.params;

    const [rows] = await pool.query(
      `SELECT c.id, c.cliente, c.especialista, c.fecha, c.horaInicio, c.horaFin, c.estado,
              c.motivoCancelacion, c.canceladaPor, c.createdAt, c.updatedAt,
              e.nombresApellidos AS especialistaNombre
       FROM citas c
       INNER JOIN usuarios e ON e.id = c.especialista
       WHERE c.cliente = ?
         AND c.estado IN ('programada', 'cancelada')
       ORDER BY c.fecha DESC`,
      [cliente]
    );

    res.json(rows.map(mapCitaConEspecialista));
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener las citas" });
  }
}


// Obtener todas las citas de un especialista
export const obtenerCitasEspecialista = async (req, res) => {
  try {
    const pool = getPool();
    const { especialista } = req.params;

    const [rows] = await pool.query(
      `SELECT c.id, c.cliente, c.especialista, c.fecha, c.horaInicio, c.horaFin, c.estado,
              c.motivoCancelacion, c.canceladaPor, c.createdAt, c.updatedAt,
              cl.nombresApellidos AS clienteNombre, cl.email AS clienteEmail, cl.telefono AS clienteTelefono,
              e.nombresApellidos AS especialistaNombre
       FROM citas c
       INNER JOIN usuarios cl ON cl.id = c.cliente
       INNER JOIN usuarios e ON e.id = c.especialista
       WHERE c.especialista = ?
         AND c.estado IN ('programada', 'cancelada')
       ORDER BY c.fecha DESC`,
      [especialista]
    );

    res.json(rows.map(mapCitaConClienteYEspecialista));
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener las citas del especialista" });
  }
};


// Cancelar una cita
export const cancelarCita = async (req, res) => {
  const pool = getPool();
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const { id } = req.params;
    const { motivo } = req.body;

    const [citaRows] = await conn.query(
      `SELECT id, especialista, fecha, horaInicio
       FROM citas
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    const cita = citaRows[0];

    if (!cita) {
      throw new Error("Cita no encontrada");
    }

    const rol = req.usuario?.rol;
    const canceladaPor = rol === "especialista" ? "especialista" : "cliente";

    await conn.query(
      `UPDATE citas
       SET estado = 'cancelada', motivoCancelacion = ?, canceladaPor = ?
       WHERE id = ?`,
      [motivo || null, canceladaPor, id]
    );

    // liberar agenda
    const [agendaRows] = await conn.query(
      `SELECT id
       FROM agendas
       WHERE especialista = ? AND fecha = ?
       LIMIT 1`,
      [cita.especialista, toDateOnly(cita.fecha)]
    );

    if (agendaRows[0]) {
      await conn.query(
        `UPDATE agenda_bloques
         SET disponible = 1
         WHERE agenda_id = ? AND horaInicio = ?
         LIMIT 1`,
        [agendaRows[0].id, `${toTimeHHMM(cita.horaInicio)}:00`]
      );
    }

    await conn.commit();

    const [rows] = await pool.query(
      `SELECT c.id, c.cliente, c.especialista, c.fecha, c.horaInicio, c.horaFin, c.estado,
              c.motivoCancelacion, c.canceladaPor, c.createdAt, c.updatedAt,
              e.nombresApellidos AS especialistaNombre
       FROM citas c
       INNER JOIN usuarios e ON e.id = c.especialista
       WHERE c.id = ?
       LIMIT 1`,
      [id]
    );

    res.json(mapCitaConEspecialista(rows[0]));

  } catch (error) {
    await conn.rollback();
    res.status(500).json({ mensaje: error.message });
  } finally {
    conn.release();
  }
};
// Reprogramar una cita
export const reprogramarCita = async (req, res) => {
  const pool = getPool();
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const { id } = req.params;
    const { fecha, horaInicio, horaFin } = req.body;

    const [citaRows] = await conn.query(
      `SELECT id, especialista, fecha, horaInicio
       FROM citas
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    const cita = citaRows[0];
    if (!cita) throw new Error("Cita no encontrada");

    const fechaAnterior = toDateOnly(cita.fecha);
    const nuevaFecha = toDateOnly(fecha);
    const horaAnterior = `${toTimeHHMM(cita.horaInicio)}:00`;
    const nuevaHoraInicio = `${toTimeHHMM(horaInicio)}:00`;
    const nuevaHoraFin = `${toTimeHHMM(horaFin)}:00`;

    // liberar bloque anterior
    const [agendaAnteriorRows] = await conn.query(
      `SELECT id FROM agendas WHERE especialista = ? AND fecha = ? LIMIT 1`,
      [cita.especialista, fechaAnterior]
    );
    if (agendaAnteriorRows[0]) {
      await conn.query(
        `UPDATE agenda_bloques
         SET disponible = 1
         WHERE agenda_id = ? AND horaInicio = ?
         LIMIT 1`,
        [agendaAnteriorRows[0].id, horaAnterior]
      );
    }

    // ocupar nuevo bloque
    const [agendaNuevaRows] = await conn.query(
      `SELECT id FROM agendas WHERE especialista = ? AND fecha = ? LIMIT 1`,
      [cita.especialista, nuevaFecha]
    );

    if (!agendaNuevaRows[0]) {
      throw new Error("No existe agenda para la nueva fecha");
    }

    const [ocupado] = await conn.query(
      `SELECT id, disponible
       FROM agenda_bloques
       WHERE agenda_id = ? AND horaInicio = ?
       LIMIT 1`,
      [agendaNuevaRows[0].id, nuevaHoraInicio]
    );

    if (!ocupado[0] || !ocupado[0].disponible) {
      throw new Error("El nuevo bloque ya no esta disponible");
    }

    await conn.query(
      `UPDATE agenda_bloques
       SET disponible = 0
       WHERE id = ?`,
      [ocupado[0].id]
    );

    await conn.query(
      `UPDATE citas
       SET fecha = ?, horaInicio = ?, horaFin = ?, estado = 'programada'
       WHERE id = ?`,
      [nuevaFecha, nuevaHoraInicio, nuevaHoraFin, id]
    );

    await conn.commit();

    const [rows] = await pool.query(
      `SELECT c.id, c.cliente, c.especialista, c.fecha, c.horaInicio, c.horaFin, c.estado,
              c.motivoCancelacion, c.canceladaPor, c.createdAt, c.updatedAt,
              e.nombresApellidos AS especialistaNombre
       FROM citas c
       INNER JOIN usuarios e ON e.id = c.especialista
       WHERE c.id = ?
       LIMIT 1`,
      [id]
    );

    res.json(mapCitaConEspecialista(rows[0]));

  } catch (error) {
    await conn.rollback();
    res.status(500).json({ mensaje: error.message });
  } finally {
    conn.release();
  }
};
