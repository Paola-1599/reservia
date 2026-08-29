import express from 'express';
import { obtenerServicios, obtenerServicioPorId, crearServicio, actualizarServicio, eliminarServicio } from '../controllers/ServicioController.js';

import uploadServicio from '../middlewares/uploadServicio.js';

const router = express.Router();

// Ruta para obtener todos los servicios
router.get('/', obtenerServicios);

// Ruta para obtener un servicio por ID
router.get('/:id', obtenerServicioPorId);

// Ruta para crear un nuevo servicio con subida de imagen
router.post('/', uploadServicio.single('imagenServicio'), crearServicio);

//PUT con subida de imagen
router.put('/:id', uploadServicio.single('imagenServicio'), actualizarServicio);

// Ruta para eliminar un servicio
router.delete('/:id', eliminarServicio);

export default router;