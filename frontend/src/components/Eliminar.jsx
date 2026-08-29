import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Eliminar() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const eliminar = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/usuarios/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          navigate('/TablaUsuarios');
        } else {
          const data = await res.json().catch(() => ({}));
          alert(data.mensaje || 'No se pudo eliminar el usuario');
          navigate('/TablaUsuarios');
        }
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert('Error de conexión al servidor');
        navigate('/TablaUsuarios');
      }
    };

    eliminar();
  }, [id, navigate]);

  return null;
}

export default Eliminar;
