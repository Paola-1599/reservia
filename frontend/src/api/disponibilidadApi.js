// frontend/src/api/disponibilidadApi.js
const BASE = "http://localhost:4000/api/disponibilidad";

// Función para obtener las agendas de un especialista
export const fetchAgendas = async (especialista) => {
  const res = await fetch(`${BASE}?especialista=${especialista}`);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Error desconocido" }));
    throw new Error(error.message || "No se pudieron cargar las agendas");
  }
  return res.json();
};

// Función para crear una nueva agenda
export const crearAgenda = async (payload) => {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({ message: "Respuesta inválida del servidor" }));
  if (!res.ok) throw new Error(data.message || "No se pudo crear la agenda");
  return data;
};

// Función para actualizar un bloque específico en una agenda, es decir poner "disponible" o "no disponible"
export const actualizarBloque = async (agendaId, bloqueIndex, payload) => {
  const res = await fetch(`${BASE}/${agendaId}/bloques/${bloqueIndex}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Error desconocido" }));
    throw new Error(error.message || "No se pudo actualizar el bloque");
  }
  return res.json();
};


// Función para eliminar una agenda completa
export const eliminarBloque = async (agendaId, bloqueIndex) => {
  const res = await fetch(`${BASE}/${agendaId}/bloques/${bloqueIndex}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Error desconocido" }));
    throw new Error(error.message || "No se pudo eliminar el bloque");
  }
  return res.json();
};
