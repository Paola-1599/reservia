import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from './modals/ConfirmModal';

const CerrarSesion = () => {
    // Estado para controlar la visibilidad del modal de confirmación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

// Funciones para manejar la apertura y cierre del modal, así como la confirmación de cierre de sesión
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
// Cerrar el modal sin cerrar sesión
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

// Confirmar el cierre de sesión
  const handleConfirmLogout = () => {
    

    // Redirigir al login
    navigate('/');
  };

  // Renderizar el botón de cerrar sesión y el modal de confirmación
  return (
    <>
      <button onClick={handleOpenModal} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--textBody)', padding: '2%', fontFamily: 'Open Sans, sans-serif', display: 'flex', alignItems: 'center' }}>
        Cerrar Sesión
      </button>



      <ConfirmModal
        isOpen={isModalOpen}
        title="Confirmar Cierre de Sesión"
        message="¿Estás seguro de que quieres cerrar sesión?"
        confirmText="Cerrar Sesión"
        cancelText="Cancelar"
        onConfirm={handleConfirmLogout}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default CerrarSesion;