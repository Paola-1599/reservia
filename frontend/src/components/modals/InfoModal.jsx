import styles from "./Modal.module.css";
import { createPortal } from "react-dom";

const InfoModal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <p className={styles.text}>{message}</p>

        <div className={styles.actions}>
          <button className={styles.primary} onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default InfoModal;