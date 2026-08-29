import express from 'express';
import { procesarPago } from '../controllers/PagoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Ruta para procesar el pago y crear cita: POST /api/pagos
router.post('/', authMiddleware, procesarPago);

export default router;