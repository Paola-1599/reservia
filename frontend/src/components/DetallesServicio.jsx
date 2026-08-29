
import React, {  useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../styles/DetallesServicio.module.css";
import IconoAtras from "../includes/Back UpiconSvg.co.svg";
import LayoutCliente from "./Layouts/LayoutCliente";

function DetallesServicio() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [servicio, setServicio] = useState(null);
    const [loading, setLoading] = useState(true);

      // Fetch del servicio por ID
    useEffect(() => {
        console.log("ID:", id);

        fetch(`http://localhost:4000/api/servicios/${id}`)

            .then (res => {
                if (!res.ok) {
                    throw new Error ("Error al obtener el servicio");
                }
                return res.json();
            })

            .then (data =>{ 
                setServicio (data)
                setLoading (false);
            })
            .catch (error => {
                console.error("Error:", error);
                setLoading (false);
            });
    }, [id]);

    if (loading) return <p>Cargando Servicio...</p>
    if (!servicio) return <p>Servicio no encontrado</p>

    const handleSeleccionarEspecialista = () => {
        localStorage.setItem(
            "servicioSeleccionado",
             JSON.stringify(servicio));
             
        navigate(`/seleccionar-especialista/${servicio._id}`);
    };

    return (

    <LayoutCliente>
        <div className={styles.contenedor}>
                {/* Botón de regresar atrás */ }

                <div className={styles.headerCatalogo}>

                    <button type='button' className={styles.btnAtras} onClick={() => window.history.back()}>
                        <img src={IconoAtras} alt="Atrás" className={styles.iconAtras} />
                        Atrás
                    </button>  

                    {/* Titulo */ }
                    <h1>DETALLES DEL SERVICIO</h1>
                </div>
                <hr />

                <div className={styles.tarjeta}>
                    <img 
                        src={`http://localhost:4000/uploads/servicios/${servicio.imagenServicio}`}  
                        alt={servicio.nombreServicio} 
                        className={styles.imagenServicio}
                    />

                    <div className={styles.infoServicio}>
                        <h2>{servicio.nombreServicio}</h2>

                        <p className={styles.descripcion}>
                            {servicio.descripcionServicio}
                        </p>

                        <p className={styles.precio}>
                            PRECIO: ${servicio.precioServicio} COP
                        </p>

                        <button className={styles.btnSeleccionar} onClick={handleSeleccionarEspecialista}>
                            Seleccionar Especialista
                        </button>
                    </div>
                </div>
        </div>
    </LayoutCliente>
    );
}
export default DetallesServicio;