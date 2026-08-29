import Header from "../Header.jsx";
import BarraMenuCliente from "../BarraMenuCliente.jsx";
import styles from "../../styles/LayoutPrincipal.module.css";

export default function LayoutCliente({ children }) {
    return (
        <div className={styles.layoutRoot}>
            {/* Header global */ }
            <Header />

            {/* Cuerpo: menu + contenido */}
            <div className={styles.layoutBody}>
                {/* Barra de menú clientes */ }
                <BarraMenuCliente />

                {/* Contenido específico de la página */ }
                <main className={styles.layoutContent}>
                    {children}
                </main>
            </div>
        </div>
    );
}






