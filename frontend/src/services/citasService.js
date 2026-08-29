const API_URL = "http://localhost:4000/api/citas";

export const obtenerCitaCliente = async (clienteId, token) => {
  const res = await fetch(
    `http://localhost:4000/api/citas/cliente/${clienteId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Error al obtener las citas");
    }

  return res.json();
};

export const cancelarCita = async (citaId, motivo, token) => {
  const res = await fetch(`${API_URL}/${citaId}/cancelar`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ motivo }),
  });

  if (!res.ok) {
    throw new Error("Error al cancelar la cita");
  }
  
  return res.json();
};