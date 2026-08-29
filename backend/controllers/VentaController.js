import { getPool } from "../config/db.js";
import { toDateOnly, toId, toTimeHHMM } from "../utils/mysqlMappers.js";

export const obtenerVentas = async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      `SELECT v.id, v.idFactura, v.cita, v.pago, v.cliente, v.especialista, v.servicio, v.valor, v.createdAt, v.updatedAt,
              c.fecha AS citaFecha, c.horaInicio AS citaHoraInicio, c.horaFin AS citaHoraFin,
              ucl.nombresApellidos AS clienteNombre, ucl.documentoIdentidad AS clienteDocumento,
              ues.nombresApellidos AS especialistaNombre,
              s.nombreServicio
       FROM ventas v
       INNER JOIN citas c ON c.id = v.cita
       INNER JOIN usuarios ucl ON ucl.id = v.cliente
       INNER JOIN usuarios ues ON ues.id = v.especialista
       INNER JOIN servicios s ON s.id = v.servicio
       ORDER BY v.createdAt DESC`
    );

    const ventas = rows.map((row) => ({
      _id: toId(row.id),
      id: toId(row.id),
      idFactura: row.idFactura,
      cita: {
        _id: toId(row.cita),
        id: toId(row.cita),
        fecha: toDateOnly(row.citaFecha),
        horaInicio: toTimeHHMM(row.citaHoraInicio),
        horaFin: toTimeHHMM(row.citaHoraFin),
      },
      pago: toId(row.pago),
      cliente: {
        _id: toId(row.cliente),
        id: toId(row.cliente),
        nombresApellidos: row.clienteNombre,
        documentoIdentidad: row.clienteDocumento,
      },
      especialista: {
        _id: toId(row.especialista),
        id: toId(row.especialista),
        nombresApellidos: row.especialistaNombre,
      },
      servicio: {
        _id: toId(row.servicio),
        id: toId(row.servicio),
        nombreServicio: row.nombreServicio,
      },
      valor: Number(row.valor),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));

    res.status(200).json(ventas);
  } catch (error) {
    console.error("Error al obtener ventas:", error);
    res.status(500).json({ mensaje: "Error al obtener las ventas" });
  }
};