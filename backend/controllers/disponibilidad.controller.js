import {
  crearAgendaSvc,
  listarAgendasSvc,
  actualizarBloqueSvc,
  eliminarBloqueSvc, 
} from "../services/disponibilidad.service.js";

// Listar agendas de un especialista
export const listarAgendasPorEspecialista = async (req, res) => {
  try {
    const { especialista } = req.query;
    if (!especialista) return res.status(400).json({ message: "especialista es requerido" });
    const agendas = await listarAgendasSvc(especialista);
    res.json(agendas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Crear o actualizar una agenda
export const crearAgenda = async (req, res) => {
  try {
    const agenda = await crearAgendaSvc(req.body); 
    res.status(201).json(agenda);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// Actualizar un bloque específico en una agenda, es decir poner "disponible" o "no disponible"
export const actualizarBloque = async (req, res) => {
  try {
    const { agendaId, bloqueIndex } = req.params;
    const agenda = await actualizarBloqueSvc(agendaId, Number(bloqueIndex), req.body);
    res.json(agenda);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Eliminar un bloque específico de un dia
export const eliminarBloque = async (req, res) => {
  try {
    const { agendaId, bloqueIndex } = req.params;
    const resultado = await eliminarBloqueSvc(agendaId, Number(bloqueIndex));
    res.json(resultado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};