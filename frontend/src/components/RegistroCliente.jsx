import React from "react";
import styles from "../styles/LayoutRegistro.module.css";

//importar componentes
import RegistroForm from "./RegistroForm";
import FranjaInferior from "./FranjaInferiorRegistro";
import HeaderLogoRegistro from "./HeaderLogoRegistro";


const RegistroCliente = () => {
    return (
        <div className={styles.mainContainer}>

        <HeaderLogoRegistro />
                
        <div className={styles.container}>
            <RegistroForm
                endpoint="http://localhost:4000/api/usuarios/registro"
                rol = "cliente"
            />
        </div>

        <FranjaInferior />

    </div>
    );
}
export default RegistroCliente;