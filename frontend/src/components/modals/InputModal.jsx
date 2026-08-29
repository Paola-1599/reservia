import { useState } from "react";
import styles from "./Modal.module.css";
import { createPortal } from "react-dom";

const InputModal = ({ isOpen, title, label, onConfirm, onClose }) => {
  const [value, setValue] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(value);
    setValue("");
  };

  return createPortal(
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.dangerTitle}>{title}</h3>
        <p className={styles.text}>{label}</p>

        <textarea
          className={styles.input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <div className={styles.actions}>
          <button className={styles.primary} onClick={handleConfirm}>
            Confirmar
          </button>
          <button className={styles.secondary} onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default InputModal;
               
