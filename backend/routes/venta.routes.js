import express from "express";
import { obtenerVentas } from "../controllers/VentaController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET /api/ventas
router.get("/", authMiddleware, obtenerVentas);

export default router;