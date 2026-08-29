import React from "react";
import { FaCheck, FaPalette, FaSpa } from "react-icons/fa";
import styles from "../styles/LugarSeguro.module.css";

import IconoFondos from "../includes/IconBackground.svg";
import IconoVideos from "../includes/IconRelax.svg";

const SidebarMenu = ({ activeSection, onSelect }) => {
    return (
        <div className={styles.sidebarMenu}>
            <h3>Mi Lugar Seguro</h3>

            <button
                className={`${styles.menuOption} ${activeSection === "fondos" ? styles.activeOption : ""}`}
                onClick={() => onSelect("fondos")}
            >
                <img src={IconoFondos} alt="Icono Fondos" className={styles.menuIcon}/> Personalizar fondo
            </button>

            <hr className={styles.separator} />

            <button
                className={`${styles.menuOption} ${activeSection === "videos" ? styles.activeOption : ""}`}
                onClick={() => onSelect("videos")}
            >
                <img src={IconoVideos} alt="Icono Videos" className={styles.menuIcon}/> Técnicas de Relajación
            </button>
        </div>
    );
};

export default SidebarMenu;
