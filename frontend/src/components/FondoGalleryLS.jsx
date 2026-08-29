import React from "react";
import styles from "../styles/LugarSeguro.module.css";

import playa from "../assets/images/fondosLugarSeguro/Playa.jpg";
import bosque from "../assets/images/fondosLugarSeguro/bosque.jpg";
import jardin from "../assets/images/fondosLugarSeguro/jardinJapones.png";
import cascada from "../assets/images/fondosLugarSeguro/cascada.jpg";




const fondos = [
    { name: "Playa", src: playa },
    { name: "Bosque", src: bosque },
    { name: "Jardín Japonés", src: jardin },
    { name: "Cascada", src: cascada },
];


const FondoGallery = ({ onSelectBackground, selectedBackground }) => {
    return (
        <div className={styles.galleryWrapper}>

            <div className={styles.galleryContainer}>
                {fondos.map((fondo, index) => (
                    <div
                        key={index}
                        className={`${styles.galleryImageWrapper} ${selectedBackground === fondo.src ? styles.selected : ""}`}
                        onClick={() => onSelectBackground(fondo.src)}
                    >
                        <img src={fondo.src} alt={fondo.name} className={styles.galleryImage} />
                        <p className={styles.galleryImageName}>{fondo.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FondoGallery;