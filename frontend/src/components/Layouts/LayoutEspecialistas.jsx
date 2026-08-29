import Header from "../Header.jsx";
import BarraMenuEspecialistas from "../BarraMenuEspecialista.jsx";
import styles from "../../styles/LayoutPrincipal.module.css";

export default function LayoutEspecialistas({ children }) {
    return (
        <div className={styles.layoutRoot}>
            {/* Header global */ }
            <Header />

            {/* Cuerpo: menu + contenido */}
            <div className={styles.layoutBody}>
                {/* Barra de menú Especialistas */ }
                <BarraMenuEspecialistas />

                {/* Contenido específico de la página */ }
                <main className={styles.layoutContent}>
                    {children}
                </main>
            </div>
        </div>
    );
}
