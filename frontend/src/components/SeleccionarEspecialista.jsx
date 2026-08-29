import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/SeleccionarEspecialista.module.css";
import IconoAtras from "../includes/Back UpiconSvg.co.svg";
import LayoutCliente from "./Layouts/LayoutCliente";



const SeleccionarEspecialistas = () => {
    const [especialistas, setEspecialistas] = useState([]);
    const [especialistaSeleccionado, setEspecialistaSeleccionado] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch especialistas desde el backend
        fetch("http://localhost:4000/api/usuarios/especialistas")
            .then((res) => res.json())
            .then (data => setEspecialistas(data))
            .catch (err => console.error( err));
    }, []);

    const verDisponibilidad = () => {
        if (!especialistaSeleccionado) return;
        // Guardar el especialista seleccionado en el localStorage
        localStorage.setItem(
            "especialistaSeleccionado",
            JSON.stringify(especialistaSeleccionado)
        );

        // Navegar a la página de disponibilidad del especialista seleccionado
        navigate(`/disponibilidad/${especialistaSeleccionado._id}`);
    };

    return (

        <LayoutCliente>
        <div className={styles.CajaPadre}>
            {/* Botón de regresar atrás */ }
        
            <div className={styles.headerSeleccionarEspecialistas}>
        
                <button type='button' className={styles.btnAtras} onClick={() => window.history.back()}>
                    <img src={IconoAtras} alt="Atrás" className={styles.iconAtras} />
                    Atrás
                </button>  
            
                {/* Titulo */ }
                <h1>SELECCIONAR ESPECIALISTA</h1>
            </div>
            <hr/>
            <div className={styles.selectorContainer}>
                <div className={styles.selectorWrapper}>
                    <select 
                        className={styles.selector}
                        value={especialistaSeleccionado?._id || ""}
                        onChange={(e) => {
                            const especialista = especialistas.find(p => p._id === e.target.value);
                            setEspecialistaSeleccionado(especialista);
                        }}
                    >
                        <option value="">Seleccionar un especialista</option>
                        {especialistas.map(especialista => (
                            <option key={especialista._id} value={especialista._id}>
                                {especialista.nombresApellidos}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    className={styles.boton}
                    disabled={!especialistaSeleccionado || especialistas.length === 0}
                    onClick={verDisponibilidad}
                >
                    Ver disponibilidad
                </button>
            </div>
        </div>
        </LayoutCliente>

    );
} 
export default SeleccionarEspecialistas;