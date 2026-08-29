import express from "express";
import { 
    obtenerAgendaEspecialista,
    obtenerDiasDisponibles,
    crearAgenda,
    obtenerDisponibilidadEspecialista

 } from "../controllers/AgendaController.js";


const router = express.Router();



//Días disponibles de un especialista (nueva): GET /api/agendas/especialista/:especialistaId
router.get("/especialista/:especialistaId", obtenerDiasDisponibles);

//Obtener agenda por fecha y especialista (nueva): GET /api/agendas/especialista/:especialistaId/:fecha
router.get("/especialista/:especialistaId/:fecha", obtenerAgendaEspecialista);

//crear agenda: POST /api/agendas/
router.post("/", crearAgenda)

//Ver disponibilidad de un especialista en una fecha
router.post("/disponible", obtenerDisponibilidadEspecialista);



export default router;