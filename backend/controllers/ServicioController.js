import { getPool } from "../config/db.js";
import { toId } from "../utils/mysqlMappers.js";

const mapServicio = (row) => ({
    _id: toId(row.id),
    id: toId(row.id),
    nombreServicio: row.nombreServicio,
    descripcionServicio: row.descripcionServicio,
    precioServicio: Number(row.precioServicio),
    imagenServicio: row.imagenServicio,
    estadoServicio: row.estadoServicio,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
});

// Obtener todos los servicios activos
export const obtenerServicios = async (req, res) => {
    try {
        const pool = getPool();
        const [rows] = await pool.query(
          `SELECT id, nombreServicio, descripcionServicio, precioServicio, imagenServicio, estadoServicio, createdAt, updatedAt
           FROM servicios
           WHERE estadoServicio = 'Activo'
           ORDER BY createdAt DESC`
        );
        const servicios = rows.map(mapServicio);
        res.json(servicios);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los servicios", error });
    }
};

//obtener servicio por id
export const obtenerServicioPorId = async (req, res) => {
    try {
                const pool = getPool();
                const [rows] = await pool.query(
                    `SELECT id, nombreServicio, descripcionServicio, precioServicio, imagenServicio, estadoServicio, createdAt, updatedAt
                     FROM servicios
                     WHERE id = ?
                     LIMIT 1`,
                    [req.params.id]
                );

                const servicio = rows[0] ? mapServicio(rows[0]) : null;
        if (!servicio) {
            return res.status(404).json({ message: "Servicio no encontrado" });
        }
        res.json(servicio);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error al obtener el servicio" });
    }
};

// CREAR un nuevo servicio
export const crearServicio = async (req, res) => {
    try {
                const pool = getPool();
        const {
            nombreServicio,
            descripcionServicio,
            precioServicio
        } = req.body;

                const [result] = await pool.query(
                    `INSERT INTO servicios (
                        nombreServicio, descripcionServicio, precioServicio, imagenServicio, estadoServicio
                    ) VALUES (?, ?, ?, ?, 'Activo')`,
                    [
                        nombreServicio,
                        descripcionServicio,
                        precioServicio,
                        req.file ? req.file.filename : "",
                    ]
                );

                const [rows] = await pool.query(
                    `SELECT id, nombreServicio, descripcionServicio, precioServicio, imagenServicio, estadoServicio, createdAt, updatedAt
                     FROM servicios
                     WHERE id = ?
                     LIMIT 1`,
                    [result.insertId]
                );

                res.status(201).json({ nuevoServicio: mapServicio(rows[0]) });
    } catch (error) {
        console.error("ERROR CREAR SERVICIO", error);
        res.status(500).json({ message: "Error al crear el servicio", error });
    }
};

// ACTUALIZAR un servicio existente
export const actualizarServicio = async (req, res) => {
    try {
        const pool = getPool();
        const { id } = req.params;

        const datosActualizados = {
            nombreServicio: req.body.nombreServicio,
            descripcionServicio: req.body.descripcionServicio,
            precioServicio: req.body.precioServicio,
            estadoServicio: req.body.estadoServicio
        };


        // Si se subió una nueva imagen, actualizar el campo imagenServicio
        if (req.file) {
            datosActualizados.imagenServicio = req.file.filename;
        }

                await pool.query(
                                `UPDATE servicios
                                 SET nombreServicio = ?,
                                     descripcionServicio = ?,
                                     precioServicio = ?,
                                     estadoServicio = COALESCE(?, estadoServicio),
                                     imagenServicio = COALESCE(?, imagenServicio)
                                 WHERE id = ?`,
                        [
                            datosActualizados.nombreServicio,
                            datosActualizados.descripcionServicio,
                            datosActualizados.precioServicio,
                                    datosActualizados.estadoServicio || null,
                            req.file ? req.file.filename : null,
                            id,
                        ]
        );

                const [rows] = await pool.query(
                    `SELECT id, nombreServicio, descripcionServicio, precioServicio, imagenServicio, estadoServicio, createdAt, updatedAt
                     FROM servicios
                     WHERE id = ?
                     LIMIT 1`,
                    [id]
                );

                const servicioActualizado = rows[0] ? mapServicio(rows[0]) : null;

        res.json({ servicioActualizado });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el servicio" });
    }
};

// ELIMINAR un servicio (cambiar estado a Inactivo)
export const eliminarServicio = async (req, res) => {
    try {
        const pool = getPool();
        const { id } = req.params;
        await pool.query("UPDATE servicios SET estadoServicio = 'Inactivo' WHERE id = ?", [id]);

        res.json({ message: "Servicio eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el servicio", error });
    }
};