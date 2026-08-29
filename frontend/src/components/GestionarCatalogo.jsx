import React, { useEffect, useState } from "react";
import styles from "../styles/GestionarCatalogo.module.css";
import LayoutAdmin from "./Layouts/LayoutAdmin";

// Importación de iconos
import IconoAtras from "../includes/Back UpiconSvg.co.svg";
import IconoEditar from "../includes/IconoEditar.svg";
import IconoEliminar from "../includes/IconoEliminar.svg";

//importacion del modal
import EditarServicioModal from "./modals/EditarServicioModal";
import ConfirmModal from "./modals/ConfirmModal";

function GestionarCatalogo() {

    //Estado para los servicios
    const [servicios, setServicios] = useState([]);
    const [servicioEditar, setServicioEditar] = useState(null);

    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [servicioAEliminar, setServicioAEliminar] = useState(null);

    //Obtener servicios del backend
   const cargarServicios = async () => {
        try {
            const res = await fetch("http://localhost:4000/api/servicios");
            const data = await res.json();
            setServicios(data);
        } catch (error) {
            console.error("Error al cargar los servicios:", error);
        }
    };

    useEffect(() => {
        cargarServicios();
    }, []);

    //Funcion editar servicio
    const handleEditar = (servicio) => {
        setServicioEditar(servicio);
    };

    //Abrir modal de confirmacion para la eliminacion
    const solicitarEliminacion = (servicio) => {
        setServicioAEliminar(servicio);
        setMostrarConfirmacion(true);
    }
    //Funcion eliminar servicio
    const handleEliminar = async (id) => {
        if (!servicioAEliminar) return;

        try { 
            const res = await fetch(`http://localhost:4000/api/servicios/${servicioAEliminar._id}`, {
                method: "DELETE"
            });

            if (!res.ok) {
                throw new Error("Error al eliminar el servicio");
            }      

        setServicios(prev => 
            prev.filter(s => s._id !== servicioAEliminar._id)
        );

        setMostrarConfirmacion(false);
        setServicioAEliminar(null);
        } catch (error) {
            console.error(error);
            alert("Error al eliminar el servicio");
        }
    };

    //Funcion para guardar los cambios
    const guardarCambios = async (data) => {
        try {
            const formData = new FormData();
            formData.append("nombreServicio", data.nombreServicio);
            formData.append("descripcionServicio", data.descripcionServicio);
            formData.append("precioServicio", data.precioServicio);

            if (data.imagenServicio) {
                formData.append("imagenServicio", data.imagenServicio);
            }

            const res = await fetch(
                `http://localhost:4000/api/servicios/${servicioEditar._id}`,
                {
                    method: "PUT",
                    body: formData
            }
        );
        if (!res.ok) {
            throw new Error("Error al actualizar el servicio");
        }

        await cargarServicios();
        setServicioEditar(null);

        }catch (error) {
            console.error(error);
            alert("Error al actualizar el servicio");
        }

    };

    return (

        <LayoutAdmin>
        <div className={styles.CajaPadre}>
            {/* Botón de regresar atrás */ }

            <div className={styles.headerCatalogo}>

                <button type='button' className={styles.btnAtras} onClick={() => window.history.back()}>
                    <img src={IconoAtras} alt="Atrás" className={styles.iconAtras} />
                    Atrás
                </button>  

                {/* Titulo */ }
                <h1>ACTUALIZAR CATÁLOGO DE SERVICIOS</h1>
            </div>

            <hr />

            {/* Seccion de servicios */ }
            <section className={styles.servicios}>
                <div className={styles.contenidoServicios}>
                    {/* Mapeo de los servicios */}
                    {servicios.map((servicio) =>(
                        <div key={servicio._id} className={styles.tarjetaServicio}>
                            <img src={`http://localhost:4000/uploads/servicios/${servicio.imagenServicio}`} alt={servicio.nombreServicio} />
                            <h3>{servicio.nombreServicio}</h3>
                            <p>{servicio.descripcionServicio}</p>
                            <span>
                                Precio:
                                <p className={styles.precio}>{servicio.precioServicio} COP</p>
                            </span>

                            {/*Acciones*/}
                            <div className={styles.acciones}>
                                <button 
                                    className={styles.btnEditar} 
                                    onClick={() => handleEditar(servicio)}>
                                    <img src={IconoEditar} alt="Editar" />
                                </button>

                                <button 
                                    className={styles.btnEliminar} 
                                    onClick={() => solicitarEliminacion(servicio)}>
                                    <img src={IconoEliminar} alt="Eliminar" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Modal de editar servicio */ }
            {servicioEditar && (
                <EditarServicioModal 
                    servicio={servicioEditar}
                    onClose={() => setServicioEditar(null)}
                    onSave={guardarCambios}
                />
            )}

            {/* Modal de confirmacion de eliminacion */ }
            <ConfirmModal
                isOpen={mostrarConfirmacion}
                title="Eliminar Servicio"
                message={`¿Estás seguro de que deseas eliminar "${servicioAEliminar?.nombreServicio}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                onConfirm={handleEliminar}
                onClose={() => {
                    setMostrarConfirmacion(false);
                    setServicioAEliminar(null);
                 }}
            />
        </div>
        </LayoutAdmin>
    );

}
export default GestionarCatalogo;
