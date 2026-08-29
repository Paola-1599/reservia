import { useState } from "react";
import stylesBarraMenuEspecialista from "../styles/BarraMenuAdministrador.module.css";
import CerrarSesion from "./CerrarSesion";
import { FiHome, FiCalendar, FiSettings, FiLogOut, FiChevronDown } from "react-icons/fi";

function BarraMenuEspecialistas() {
  /* Estado para controlar la visibilidad del submenú "Gestionar Agenda" */

  const [submenuGestionarAgenda, setSubmenuGestionarAgenda] = useState(false);
  
 /* Función para alternar la visibilidad del submenú */
  const toggleSubmenuGestionarAgenda = () => {
    setSubmenuGestionarAgenda(!submenuGestionarAgenda);
  };

// Estructura del componente BarraMenuEspecialista
  return (
    <div className={stylesBarraMenuEspecialista["div-padre-barraMenu"]}>
      <div className={stylesBarraMenuEspecialista["div-barra"]}>
        <h1>¡Te damos la bienvenida!</h1>
        <p className={stylesBarraMenuEspecialista.menuSubtitle}>Gestiona tu agenda y tus citas en una vista más clara y agradable.</p>
        
        <div className={stylesBarraMenuEspecialista["opcion-menu"]}>
          <span className={stylesBarraMenuEspecialista.menuIcon}><FiHome /></span>
          <a href="/InicioEspecialista">Inicio</a>
        </div>
        <hr className={stylesBarraMenuEspecialista.hrPersonalizada} />

        <div>
          <button onClick={toggleSubmenuGestionarAgenda} className={stylesBarraMenuEspecialista["submenu-button"]}>
            <span className={stylesBarraMenuEspecialista.menuIcon}><FiCalendar /></span>
            Gestionar Agenda
            <span className={stylesBarraMenuEspecialista.toggleIcon}><FiChevronDown /></span>
          </button>
          {submenuGestionarAgenda && (
            <div className={stylesBarraMenuEspecialista["submenu"]}>
              <div className={stylesBarraMenuEspecialista["opcion-menu"]}>
                <a href="/GestionarDisponibilidadEspecialista">Gestionar disponibilidad</a>
              </div>
              <hr className={stylesBarraMenuEspecialista.hrPersonalizada} />
              <div className={stylesBarraMenuEspecialista["opcion-menu"]}>
                <a href="/CitasPendientesEspecialista">Ver citas pendientes</a>
              </div>
              <hr className={stylesBarraMenuEspecialista.hrPersonalizada} />
            </div>
          )}
        </div>
        
      </div>

      <div className={stylesBarraMenuEspecialista["div-barra"]}>
        <div className={stylesBarraMenuEspecialista["opcion-menu"]}>
          <span className={stylesBarraMenuEspecialista.menuIcon}><FiSettings /></span>
          <a href="/configuracion">Ajustes</a>
        </div>
        <div className={stylesBarraMenuEspecialista["opcion-menu"]}>
          <CerrarSesion />
        </div>
      </div>
        
    </div>
  );
}

export default BarraMenuEspecialistas;