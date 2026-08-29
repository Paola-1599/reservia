import { getPool } from "../config/db.js";
import bcrypt from "bcryptjs";
import { toId } from "../utils/mysqlMappers.js";

const normalizeRole = (rol = "") => {
    return String(rol || "").trim().toLowerCase();
};


//POST para registrar un nuevo usuario
export const registrarUsuario = async (req, res) => {
    try {
        const pool = getPool();

        const { 
            nombresApellidos, 
            documentoIdentidad,
            tipoDocumento,
            email, 
            password, 
            direccion, 
            telefono, 
            fechaNacimiento, 
            rol
         } = req.body;

        const rolNormalizado = normalizeRole(rol);

        if (!["cliente", "especialista", "admin"].includes(rolNormalizado)) {
            return res.status(400).json({ mensaje: "Rol inválido." });
        }

        //Validar campos obligatorios
        if (
            !nombresApellidos ||  
            !documentoIdentidad ||
            !tipoDocumento ||
            !email || 
            !password || 
            !direccion || 
            !telefono || 
            !fechaNacimiento || 
            !rolNormalizado
        ) {   
        return res.status(400).json({ mensaje: 'Complete todos los campos obligatorios.' });
        }
        //Verificar si el usuario ya existe
        const [existentes] = await pool.query(
            "SELECT id FROM usuarios WHERE email = ? OR documentoIdentidad = ? LIMIT 1",
            [email, documentoIdentidad]
        );
        if (existentes.length > 0) {
            return res.status(400).json({ mensaje: "El correo o documento ya está registrado." });
        }

    //Hashear la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            `INSERT INTO usuarios (
                nombresApellidos, documentoIdentidad, tipoDocumento, email, password,
                direccion, telefono, fechaNacimiento, rol, estadoUsuario
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'activo')`,
            [
                nombresApellidos,
                documentoIdentidad,
                tipoDocumento,
                email,
                passwordHash,
                direccion,
                telefono,
                fechaNacimiento,
                rolNormalizado,
            ]
        );

    return res.status(201).json({ mensaje: 'Usuario registrado correctamente.',
        usuario: {
            _id: toId(result.insertId),
            id: toId(result.insertId),
            nombresApellidos,
            email,
            rol: rolNormalizado,
            estadoUsuario: 'activo',
        }
     });
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        return res.status(500).json({ mensaje: 'Error del servidor. Por favor, intente nuevamente más tarde.' });
    }
};

//DELETE para eliminar un usuario por su ID
export const eliminarUsuario = async (req, res) => {
    try {
        const pool = getPool();
        const { id } = req.params;

        const [result] = await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
        }

        res.status(200).json({ mensaje: 'Usuario eliminado correctamente.' 
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar cuenta. Por favor, intente nuevamente más tarde.',
            error: error.message
        });
    }
};

//GET para obtener solo especialistas
export const obtenerEspecialistas = async (req, res) => {
    try {
                const pool = getPool();
                const [rows] = await pool.query(
                    `SELECT id, nombresApellidos
                     FROM usuarios
                     WHERE rol = 'especialista' AND estadoUsuario = 'activo'`
                );

                const especialistas = rows.map((row) => ({
                    _id: toId(row.id),
                    id: toId(row.id),
                    nombresApellidos: row.nombresApellidos,
                }));

        res.json(especialistas);
    } catch (error) {
        console.error('Error al obtener especialistas:', error);
        res.status(500).json({ mensaje: 'Error del servidor. Por favor, intente nuevamente más tarde.' });
    }
};

//GET para obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
    try {
                const pool = getPool();
                const [rows] = await pool.query(
                    `SELECT id, nombresApellidos, documentoIdentidad, email, rol, estadoUsuario, telefono, fechaRegistro
                     FROM usuarios
                     ORDER BY fechaRegistro DESC`
                );

                const usuarios = rows.map((row) => ({
                    _id: toId(row.id),
                    id: toId(row.id),
                    nombresApellidos: row.nombresApellidos,
                    documentoIdentidad: row.documentoIdentidad,
                    email: row.email,
                    rol: row.rol,
                    estadoUsuario: row.estadoUsuario,
                    telefono: row.telefono,
                    createdAt: row.fechaRegistro,
                }));

        res.json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ mensaje: 'Error del servidor. Por favor, intente nuevamente más tarde.' });
    }
};

//GET para obtener un usuario por ID
export const obtenerUsuarioPorId = async (req, res) => {
    try {
                const pool = getPool();
        const { id } = req.params;

                const [rows] = await pool.query(
                    `SELECT id, nombresApellidos, documentoIdentidad, email, rol, estadoUsuario, telefono, direccion
                     FROM usuarios
                     WHERE id = ?
                     LIMIT 1`,
                    [id]
                );

                const usuario = rows[0];

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
        }

                res.json({
                    _id: toId(usuario.id),
                    id: toId(usuario.id),
                    nombresApellidos: usuario.nombresApellidos,
                    documentoIdentidad: usuario.documentoIdentidad,
                    email: usuario.email,
                    rol: usuario.rol,
                    estadoUsuario: usuario.estadoUsuario,
                    telefono: usuario.telefono,
                    direccion: usuario.direccion,
                });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ mensaje: 'Error del servidor. Por favor, intente nuevamente más tarde.' });
    }
};

//PUT para actualizar un usuario
export const actualizarUsuario = async (req, res) => {
  try {
        const pool = getPool();
    const { id } = req.params;
    let { nombresApellidos, email, telefono, direccion, estadoUsuario } = req.body;

    //  Normalizar enum
    if (estadoUsuario) {
      estadoUsuario = estadoUsuario.toLowerCase();
    }
        await pool.query(
            `UPDATE usuarios
             SET nombresApellidos = ?, email = ?, telefono = ?, direccion = ?, estadoUsuario = ?
             WHERE id = ?`,
            [nombresApellidos, email, telefono, direccion, estadoUsuario, id]
    );

        const [rows] = await pool.query(
            `SELECT id, nombresApellidos, email, telefono, direccion, estadoUsuario
             FROM usuarios WHERE id = ? LIMIT 1`,
            [id]
        );

        const usuarioActualizado = rows[0];

    if (!usuarioActualizado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    res.status(200).json({ 
      mensaje: 'Usuario actualizado correctamente.',
            usuario: {
                _id: toId(usuarioActualizado.id),
                id: toId(usuarioActualizado.id),
                nombresApellidos: usuarioActualizado.nombresApellidos,
                email: usuarioActualizado.email,
                telefono: usuarioActualizado.telefono,
                direccion: usuarioActualizado.direccion,
                estadoUsuario: usuarioActualizado.estadoUsuario,
            }
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ mensaje: 'Error del servidor. Por favor, intente nuevamente más tarde.' });
  }
};

