import { getPool } from "../config/db.js";
import crypto from "crypto";
import { toDateOnly, toId, toTimeHHMM } from "../utils/mysqlMappers.js";

export const procesarPago = async (req, res) => {
  const pool = getPool();
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const { id: clienteId } = req.usuario;
    const { especialista: especialistaId, servicio, metodo, valor, fecha, horaInicio, horaFin } = req.body;
    const fechaAgenda = toDateOnly(fecha);
    const horaInicioSql = `${toTimeHHMM(horaInicio)}:00`;
    const horaFinSql = `${toTimeHHMM(horaFin)}:00`;

    const [agendaRows] = await conn.query(
      `SELECT id
       FROM agendas
       WHERE especialista = ? AND fecha = ?
       LIMIT 1`,
      [especialistaId, fechaAgenda]
    );

    if (!agendaRows[0]) {
      throw new Error("No existe agenda para esa fecha");
    }

    const [bloqueRows] = await conn.query(
      `SELECT id, disponible
       FROM agenda_bloques
       WHERE agenda_id = ? AND horaInicio = ?
       LIMIT 1`,
      [agendaRows[0].id, horaInicioSql]
    );

    if (!bloqueRows[0] || !bloqueRows[0].disponible) {
      throw new Error("El bloque horario no esta disponible");
    }

    const referenciaPasarela = crypto.randomUUID();
    const [pagoInsert] = await conn.query(
      `INSERT INTO pagos (
        cliente, especialista, servicio, metodo, valor, estado, referenciaPasarela, fechaPago
      ) VALUES (?, ?, ?, ?, ?, 'aprobado', ?, NOW())`,
      [clienteId, especialistaId, servicio, metodo, valor, referenciaPasarela]
    );

    const [citaInsert] = await conn.query(
      `INSERT INTO citas (
        cliente, especialista, fecha, horaInicio, horaFin, estado
      ) VALUES (?, ?, ?, ?, ?, 'programada')`,
      [clienteId, especialistaId, fechaAgenda, horaInicioSql, horaFinSql]
    );

    await conn.query(
      `UPDATE agenda_bloques
       SET disponible = 0
       WHERE id = ?`,
      [bloqueRows[0].id]
    );

    const idFactura = crypto.randomUUID();
    await conn.query(
      `INSERT INTO ventas (
        idFactura, cita, pago, cliente, especialista, servicio, valor
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [idFactura, citaInsert.insertId, pagoInsert.insertId, clienteId, especialistaId, servicio, valor]
    );

    await conn.commit();

    const [pagoRows] = await pool.query(
      `SELECT id, cliente, especialista, servicio, metodo, valor, estado, referenciaPasarela, fechaPago, createdAt, updatedAt
       FROM pagos
       WHERE id = ?
       LIMIT 1`,
      [pagoInsert.insertId]
    );

    const [citaRows] = await pool.query(
      `SELECT id, cliente, especialista, fecha, horaInicio, horaFin, estado, motivoCancelacion, canceladaPor, createdAt, updatedAt
       FROM citas
       WHERE id = ?
       LIMIT 1`,
      [citaInsert.insertId]
    );

    const pago = {
      _id: toId(pagoRows[0].id),
      id: toId(pagoRows[0].id),
      cliente: toId(pagoRows[0].cliente),
      especialista: toId(pagoRows[0].especialista),
      servicio: toId(pagoRows[0].servicio),
      metodo: pagoRows[0].metodo,
      valor: Number(pagoRows[0].valor),
      estado: pagoRows[0].estado,
      referenciaPasarela: pagoRows[0].referenciaPasarela,
      fechaPago: pagoRows[0].fechaPago,
      createdAt: pagoRows[0].createdAt,
      updatedAt: pagoRows[0].updatedAt,
    };

    const cita = {
      _id: toId(citaRows[0].id),
      id: toId(citaRows[0].id),
      cliente: toId(citaRows[0].cliente),
      especialista: toId(citaRows[0].especialista),
      fecha: toDateOnly(citaRows[0].fecha),
      horaInicio: toTimeHHMM(citaRows[0].horaInicio),
      horaFin: toTimeHHMM(citaRows[0].horaFin),
      estado: citaRows[0].estado,
      motivoCancelacion: citaRows[0].motivoCancelacion,
      canceladaPor: citaRows[0].canceladaPor,
      createdAt: citaRows[0].createdAt,
      updatedAt: citaRows[0].updatedAt,
    };

    res.status(200).json({
      mensaje: "Pago procesado y cita creada con éxito",
      pago,
      cita,
    });

  } catch (error) {
    await conn.rollback();
    console.error("Error al procesar el pago:", error);
    res.status(500).json({
      mensaje: "Error al procesar el pago",
      error: error.message,
    });
  } finally {
    conn.release();
  }
};
