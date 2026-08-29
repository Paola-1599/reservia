import { createPortal } from "react-dom";
import React, { useState, useEffect } from 'react';
import styles from './EditarServicioModal.module.css';

function EditarServicioModal({ servicio, onClose, onSave }) {
    const [formData, setFormData] = useState({
        nombreServicio: '',
        descripcionServicio: '',
        precioServicio: '',
        imagenServicio: null
    });

// Rellenar el formulario cuando el servicio cambie
    useEffect(() => {
        if (servicio) {
            setFormData({
                nombreServicio: servicio.nombreServicio,
                descripcionServicio: servicio.descripcionServicio,
                precioServicio: servicio.precioServicio,
                imagenServicio: null
            });
        }
    }, [servicio]);

    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        // Actualizar el estado del formulario
        setFormData({
            ...formData,
            [name]: files ? files[0] : value
        });
    }
    // Manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return createPortal(
        <div className={styles.overlay}>
            <div className={styles.modal}>

                <h2>Añada la nueva información del servicio y guarde los cambios</h2>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGrid}>

                        <div className={styles.grupo}>
                            <label>* Nombre del Servicio</label>
                            <input
                                type="text"
                                name="nombreServicio"
                                value={formData.nombreServicio}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={styles.grupo}>
                            <label>* Precio del Servicio</label>
                            <input
                                type="number"
                                name="precioServicio"
                                value={formData.precioServicio}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={`${styles.grupo} ${styles.descripcion}`}>
                            <label>* Descripción del Servicio</label>
                            <textarea
                                name="descripcionServicio"
                                value={formData.descripcionServicio}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                    </div>

                    <div className={styles.imagenSection}>
                        <label className={styles.label}>* Imagen del Servicio</label>
                        <input
                            type="file"
                            id="imagenServicio"
                            accept='image/*'
                            name="imagenServicio"
                            onChange={handleChange}
                            className={styles.fileInput}
                        />
                        <label htmlFor="imagenServicio" className={styles.btnImagen}>
                            Añadir imagen
                        </label>

                        {formData.imagenServicio && 
                        <span className={styles.nombreArchivo}>
                            {formData.imagenServicio.name}
                            </span>}
                    </div>

                    <div className={styles.botones}>
                        <button type="submit" className={styles.guardar}>Guardar Cambios</button>
                        <button type="button" className={styles.cancelar} onClick={onClose}>Cancelar</button>
                    </div>
                    
                </form>
            </div>
        </div>
    , document.body
    );
}
export default EditarServicioModal;