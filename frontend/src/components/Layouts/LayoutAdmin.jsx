import Header from "../Header.jsx";
import BarraMenuAdmin from "../BarraMenuAdministrador.jsx";
import styles from "../../styles/LayoutPrincipal.module.css";

export default function LayoutAdmin({ children }) {
    return (
        <div className={styles.layoutRoot}>
            {/* Header global */ }
            <Header />

            {/* Cuerpo: menu + contenido */}
            <div className={styles.layoutBody}>
                {/* Barra de menú admin */ }
                <BarraMenuAdmin />

                {/* Contenido específico de la página */ }
                <main className={styles.layoutContent}>
                    {children}
                </main>
            </div>
        </div>
    );
}