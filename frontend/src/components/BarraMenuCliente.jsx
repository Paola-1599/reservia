import stylesBarraMenuCliente from "../styles/BarraMenuAdministrador.module.css";
import CerrarSesion from "./CerrarSesion";
import { FiHome, FiGrid, FiClock, FiSettings, FiLogOut } from "react-icons/fi";

function BarraMenuCliente() {

// Estructura del componente BarraMenuCliente
  return (
    <div className={stylesBarraMenuCliente["div-padre-barraMenu"]}>
      <div className={stylesBarraMenuCliente["div-barra"]}>
        <h1>¡Te damos la bienvenida!</h1>
        <p className={stylesBarraMenuCliente.menuSubtitle}>Organiza tus citas y revisa tu actividad con un diseño más limpio.</p>

        <div className={stylesBarraMenuCliente["opcion-menu"]}>
          <span className={stylesBarraMenuCliente.menuIcon}><FiHome /></span>
          <a href="/InicioCliente">Inicio</a>
        </div>
        <hr className={stylesBarraMenuCliente.hrPersonalizada} />

        <div className={stylesBarraMenuCliente["opcion-menu"]}>
          <span className={stylesBarraMenuCliente.menuIcon}><FiGrid /></span>
          <a href="/catalogo">Catálogo de Servicios</a>
        </div>
        <hr className={stylesBarraMenuCliente.hrPersonalizada} />

        <div className={stylesBarraMenuCliente["opcion-menu"]}>
          <span className={stylesBarraMenuCliente.menuIcon}><FiClock /></span>
          <a href="/historialCitas">Historial de citas</a>
        </div>
        <hr className={stylesBarraMenuCliente.hrPersonalizada} />
      </div>

      <div className={stylesBarraMenuCliente["div-barra"]}>
        <div className={stylesBarraMenuCliente["opcion-menu"]}>
          <span className={stylesBarraMenuCliente.menuIcon}><FiSettings /></span>
          <a href="/configuracion">Ajustes</a>
        </div>

        
        <div className={stylesBarraMenuCliente["opcion-menu"]}>
          <CerrarSesion />
        </div>
      </div>
        
    </div>
  );
}

export default BarraMenuCliente;