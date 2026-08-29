import { Router } from "express";
import {
  listarAgendasPorEspecialista,
  crearAgenda,
  actualizarBloque,
  eliminarBloque, 
} from "../controllers/disponibilidad.controller.js";


const router = Router();

router.get("/", listarAgendasPorEspecialista);
router.post("/", crearAgenda);
router.patch("/:agendaId/bloques/:bloqueIndex", actualizarBloque);
router.delete("/:agendaId/bloques/:bloqueIndex", eliminarBloque); 

export default router;