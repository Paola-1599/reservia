import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import LayoutCliente from "./Layouts/LayoutCliente";

import styles from "../styles/CatalogoServicios.module.css";

// Importación de iconos
import IconoAtras from "../includes/Back UpiconSvg.co.svg";


function CatalogoServicios() {

    //Datos de los servicios
    const [servicios, setServicios] = useState([]);
    const navigate = useNavigate();

    //Obtener servicios del backend
    useEffect(() => {
        fetch("http://localhost:4000/api/servicios")
            .then(res => res.json())
            .then(data => setServicios(data))
            .catch(error => console.error("Error:", error));
    }, []);

    
    // Funcion al hacer click en seleccionar servicio
    const handleSeleccionarServicio = (servicio) => {
        navigate(`/servicios/${servicio._id}`);
    };

    
    
    return (
        
       
          <LayoutCliente>

                <div className={styles.CajaPadre}>

                    {/* Botón de regresar atrás */ }

                    <div className={styles.headerCatalogo}>

                        <button type='button' className={styles.btnAtras} onClick={() => window.history.back()}>
                            <img src={IconoAtras} alt="Atrás" className={styles.iconAtras} />
                            Atrás
                        </button>  

                        {/* Titulo */ }
                        <h1>CATÁLOGO DE SERVICIOS</h1>
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
                                        <p className={styles.precio}>{servicio.precioServicio}</p>
                                    </span>

                                    {/* Botón de seleccionar servicio */ }
                                    <button onClick={() => handleSeleccionarServicio(servicio)}>
                                        Seleccionar
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
         </LayoutCliente>
    );

}
export default CatalogoServicios;

