import express from "express";
import { login } from "../controllers/LoginController.js";
import { recuperar, reset } from "../controllers/RecuperarContraseñaController.js";

const router = express.Router();

// Endpoint POST para login
router.post("/login", login);

// Endpoint POST para recuperar contraseña
router.post("/recuperar", recuperar);

// Endpoint POST para reset contraseña
router.post("/reset", reset);

export default router;




