import stylesRegistroServicio from "../styles/RegistroServicio.module.css";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import LayoutAdmin from "./Layouts/LayoutAdmin";
import ConfirmModal from "./modals/ConfirmModal";




// Componente para registrar un nuevo servicio
function RegistroServicio() {
  const navigate = useNavigate();
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [datos, setDatos] = useState({
    nombreServicio: "",
    descripcionServicio: "",
    precioServicio: "",
    imagenServicio: null
  });

  // Manejar cambios en los inputs
  function handleChange(e) {
    const { name, value, files, type } = e.target;
    setDatos({ ...datos, 
      [name]: type === "file" ? files[0] : value
    });
  }

// Guardar el nuevo servicio
  async function guardarServicio() {
    try {
      const formData = new FormData();

      formData.append("nombreServicio", datos.nombreServicio);
      formData.append("descripcionServicio", datos.descripcionServicio);
      formData.append("precioServicio", datos.precioServicio);

      if (datos.imagenServicio) {
        formData.append("imagenServicio", datos.imagenServicio);
      }
      const response = await fetch("http://localhost:4000/api/servicios", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Error al guardar el servicio");
      }
      const data = await response.json();
      console.log("Servicio creado:", data);
      setMostrarConfirmacion(false);
      setDatos({
        nombreServicio: "",
        descripcionServicio: "",
        precioServicio: "",
        imagenServicio: null
      });
      setTimeout(() => {
        navigate("/GestionarCatalogo");
      }, 1500);
    } catch (error) {
      console.error(error);
      alert("Error al crear el servicio");
      setMostrarConfirmacion(false);
    }
  }

  // Renderizado del componente
  return ( 

    <LayoutAdmin>
     <div className={stylesRegistroServicio['contenedor']}> 

     <div className={stylesRegistroServicio["contenedor-2"]}>
     
      <button className={stylesRegistroServicio["btnAtras"]} onClick={() => navigate(-1)} type="button">
        <img src="Atras.svg" alt="Atrás" />
        Atrás
      </button>
     
      <h2>REGISTRAR NUEVO SERVICIO</h2>
      <hr className={stylesRegistroServicio.hrPersonalizada} />

      <form className={stylesRegistroServicio["formContainer"]}>
        <div className={stylesRegistroServicio["columnIzquierda"]}>
          <div className={stylesRegistroServicio["formGroup"]}>
            <label className={stylesRegistroServicio["label"]}>Nombre del servicio</label>
            <input
              type="text"
              name="nombreServicio"
              placeholder="Nombre del servicio"
              value={datos.nombreServicio}
              onChange={handleChange}
              className={stylesRegistroServicio["input"]}
            />
          </div>

          <div className={stylesRegistroServicio["formGroup"]}>
            <label className={stylesRegistroServicio["label"]}>Precio del servicio</label>
            <input
              type="number"
              name="precioServicio"
              placeholder="Precio en COP"
              value={datos.precioServicio}
              onChange={handleChange}
              className={stylesRegistroServicio["input"]}
            />
          </div>

          <div className={stylesRegistroServicio["formGroup"]}>
            <label className={stylesRegistroServicio["label"]}>* Imagen del servicio</label>
            <input
              type="file"
              id="imagenServicio"
              name="imagenServicio"
              accept="image/*"
              onChange={handleChange}
              className={stylesRegistroServicio["fileInput"]}
            />
            <label htmlFor="imagenServicio" className={stylesRegistroServicio["btnImagen"]}>
              Agregar imagen
            </label>
            {datos.imagenServicio && 
              <span className={stylesRegistroServicio["nombreArchivo"]}>
                {datos.imagenServicio.name}
              </span>
            }
          </div>
        </div>

        <div className={stylesRegistroServicio["formGroup"]}>
          <label className={stylesRegistroServicio["label"]}>Descripción del servicio</label>
          <textarea
            name="descripcionServicio"
            placeholder="Ingrese la descripción del servicio"
            value={datos.descripcionServicio}
            onChange={handleChange}
            className={stylesRegistroServicio["textarea"]}
          />
        </div>

        <button 
          type="button" 
          onClick={() => setMostrarConfirmacion(true)}
          className={stylesRegistroServicio["btnAñadir"]}
        >
          Añadir
        </button>
      </form>
    </div>

    </div>

    <ConfirmModal
      isOpen={mostrarConfirmacion}
      title="Registrar nuevo servicio"
      message={`¿Estás seguro de que deseas registrar el servicio "${datos.nombreServicio}"? Verifique que todos los datos sean correctos.`}
      confirmText="Confirmar"
      cancelText="Cancelar"
      onConfirm={guardarServicio}
      onClose={() => setMostrarConfirmacion(false)}
    />
    </ LayoutAdmin > 

    

  );
}


export default RegistroServicio;
