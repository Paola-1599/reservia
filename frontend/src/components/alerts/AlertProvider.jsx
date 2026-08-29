import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaCheckCircle, FaExclamationCircle, FaTimes } from "react-icons/fa";
import styles from "./AlertProvider.module.css";

const SUCCESS_PATTERN = /\b([ée]xito|exitosa|exitosamente|correctamente|enviado|enviada|restablecida|realizado)\b/i;
const AUTO_DISMISS_MS = 5000;

const getAlertType = (message) =>
  SUCCESS_PATTERN.test(message) ? "success" : "error";

const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);
  const timeoutRef = useRef(null);

  const closeAlert = () => {
    window.clearTimeout(timeoutRef.current);
    setAlert(null);
  };

  useEffect(() => {
    const nativeAlert = window.alert;

    window.alert = (message) => {
      const text = String(message || "Ocurrio un problema inesperado.");
      window.clearTimeout(timeoutRef.current);
      setAlert({ message: text, type: getAlertType(text) });
      timeoutRef.current = window.setTimeout(closeAlert, AUTO_DISMISS_MS);
    };

    return () => {
      window.alert = nativeAlert;
      window.clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      {children}
      {alert &&
        createPortal(
          <div className={styles.container} aria-live="assertive" aria-atomic="true">
            <div
              className={`${styles.alert} ${styles[alert.type]}`}
              role="alert"
            >
              {alert.type === "success" ? (
                <FaCheckCircle className={styles.icon} aria-hidden="true" />
              ) : (
                <FaExclamationCircle className={styles.icon} aria-hidden="true" />
              )}
              <p className={styles.message}>{alert.message}</p>
              <button
                type="button"
                className={styles.closeButton}
                onClick={closeAlert}
                aria-label="Cerrar alerta"
              >
                <FaTimes aria-hidden="true" />
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default AlertProvider;