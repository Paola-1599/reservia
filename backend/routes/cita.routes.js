import express from "express";
import {
  obtenerCitaCliente,
  obtenerCitasEspecialista,
  cancelarCita,
  reprogramarCita
} from "../controllers/CitaController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Obtener citas de un cliente (nueva)
router.get(
  "/cliente/:cliente",
  authMiddleware,
  obtenerCitaCliente
);

// Obtener citas de un especialista (nueva)
router.get(
  "/especialista/:especialista",
  authMiddleware,
  obtenerCitasEspecialista
);

//cancelar cita
router.put(
  "/:id/cancelar",
  authMiddleware,
  cancelarCita
);

router.put(
  "/:id/reprogramar", 
  authMiddleware, 
  reprogramarCita);

export default router;