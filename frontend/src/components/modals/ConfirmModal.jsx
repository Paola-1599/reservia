import { createPortal } from "react-dom";
import styles from "./Modal.module.css";

const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {title && <h3 className={styles.dangerTitle}>{title}</h3>}
        <p className={styles.text}>{message}</p>

        <div className={styles.actions}>
          <button
            className={`${styles.primary} ${styles.danger}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button className={styles.secondary} onClick={onClose}>
            {cancelText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmModal;