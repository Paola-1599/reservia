import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/EliminarCuenta.module.css';

// Importación de imagenes desde src/includes
import BackUpIcon from "../includes/Back UpiconSvg.co.svg";

//modal de confirmacion al eliminar cuenta
import ConfirmModal from './modals/ConfirmModal';

const EliminarCuenta = () => {
    const [mostrarModal, setMostrarModal] = useState(false);
    const navigate = useNavigate();

    const handleEliminarCuenta = async () => {

        try {
            //Obtener el usuario guardado en el localStorage
            const usuarioStorage = localStorage.getItem('usuario');

            if (!usuarioStorage) {
                alert('No se encontró informacion del usuario');
                return;
            }
            const usuario = JSON.parse(usuarioStorage);

            //Peticion DELETE al backend
            const response = await fetch
            (`http://localhost:4000/api/usuarios/${usuario.id}`, 
                {
                    method: 'DELETE',
                }
            );

        const data = await response.json();
    

            if (!response.ok) {
                alert (data.message || 'Error al eliminar la cuenta');
            }

            //Eliminar el usuario del localStorage
            localStorage.removeItem('usuario');

            //Redirigir al usuario a la pagina de inicio
            navigate('/');
        } catch (error) {
            alert('No se pudo eliminar la cuenta. Intente nuevamente mas tarde');
        }
    };
    return (
      
        <div className={styles.container}>
            {/* Botón de regresar atrás */}
            <button type='button' className={styles.btnAtras} onClick={() => window.history.back()}>
                <img src={BackUpIcon} alt="Atrás" className={styles.iconAtras} />
                Atrás
            </button>  

            <h2 className={styles.title}>¿Quieres eliminar tu cuenta?</h2>

            <p className={styles.desciption}>
                Recuerda que perderas toda la información asociada con esta cuenta,
                en caso de querer volver a acceder a Reservia deberas registrarte nuevamente.
            </p>

            <button
                className={styles.confirmButton}
                onClick={()=> setMostrarModal(true)}
                >
                    Confirmar
            </button>

            {/* Modal de confirmación */}
            <ConfirmModal
                isOpen={mostrarModal}
                title="Eliminar cuenta"
                message="¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                cancelText="Cancelar"
                onConfirm={handleEliminarCuenta}
                onClose={() => setMostrarModal(false)}
            />
         
        </div>
       

    );
};
export default EliminarCuenta;