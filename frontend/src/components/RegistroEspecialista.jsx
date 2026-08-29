import React from "react";
import styles from "../styles/LayoutRegistro.module.css";

//importar componentes
import RegistroForm from "./RegistroForm";
import FranjaInferior from "./FranjaInferiorRegistro";
import HeaderLogoRegistro from "./HeaderLogoRegistro";

const RegistroEspecialistas = () => {
    return (
        <div className={styles.mainContainer}>

        <HeaderLogoRegistro />
                
        <div className={styles.container}>
            {/* Formulario de registro para especialistas */}
            <RegistroForm
                endpoint="http://localhost:4000/api/usuarios/registro"
                rol="especialista"
            />
        </div>

        <FranjaInferior />

    </div>
   
    );
}
export default RegistroEspecialistas;