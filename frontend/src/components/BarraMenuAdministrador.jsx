import { useState } from "react";
import stylesBarraMenuAdministrador from "../styles/BarraMenuAdministrador.module.css";
import CerrarSesion from "./CerrarSesion";
import { FiHome, FiPackage, FiUsers, FiBarChart2, FiSettings, FiLogOut, FiChevronDown } from "react-icons/fi";



function BarraMenuAdministrador() {
  /* Estado para controlar la visibilidad del submenú "Gestionar Catálogo de Servicios" */
  const [submenuCatalogo, setSubmenuCatalogo] = useState(false);
  
  /* Estado para controlar la visibilidad del submenú "Gestionar Usuarios" */
  const [submenuUsuarios, setSubmenuUsuarios] = useState(false);
  
  /* Función para alternar la visibilidad del submenú Catalogo */
  const toggleSubmenuCatalogo = () => {
    setSubmenuCatalogo(!submenuCatalogo);
  };

  /* Función para alternar la visibilidad del submenú Usuarios */
  const toggleSubmenuUsuarios = () => {
    setSubmenuUsuarios(!submenuUsuarios);
  };
  

  return (
    <div className={stylesBarraMenuAdministrador["div-padre-barraMenu"]}>
      <div className={stylesBarraMenuAdministrador["div-barra"]}>
        <h1>¡Te damos la bienvenida!</h1>
        <p className={stylesBarraMenuAdministrador.menuSubtitle}>Administra servicios, usuarios y métricas desde un solo panel.</p>

        
        <div className={stylesBarraMenuAdministrador["opcion-menu"]}>
          <span className={stylesBarraMenuAdministrador.menuIcon}><FiHome /></span>
          <a href="/InicioAdmin">Inicio</a>
        </div>
        <hr className={stylesBarraMenuAdministrador.hrPersonalizada} />

        <div>
          <button onClick={toggleSubmenuCatalogo} className={stylesBarraMenuAdministrador["submenu-button"]}>
            <span className={stylesBarraMenuAdministrador.menuIcon}><FiPackage /></span>
            Gestionar catálogo de servicios
            <span className={stylesBarraMenuAdministrador.toggleIcon}><FiChevronDown /></span>
          </button>
          {submenuCatalogo && (
            <div className={stylesBarraMenuAdministrador["submenu"]}>
              <div className={stylesBarraMenuAdministrador["opcion-menu"]}>
                <a href="/RegistroServicio">Registrar nuevo servicio</a>
              </div>
              <hr className={stylesBarraMenuAdministrador.hrPersonalizada} />
              <div className={stylesBarraMenuAdministrador["opcion-menu"]}>
                <a href="/actualizarCatalogo">Actualizar catálogo de servicios</a>
              </div>
              <hr className={stylesBarraMenuAdministrador.hrPersonalizada} />
              <div className={stylesBarraMenuAdministrador["opcion-menu"]}>
                <a href="/historialVentas">Historial de ventas</a>

              </div>
              <hr className={stylesBarraMenuAdministrador.hrPersonalizada} />
            </div>
          )}
        </div>
        <hr className={stylesBarraMenuAdministrador.hrPersonalizada} />

        <div>

          <button onClick={toggleSubmenuUsuarios} className={stylesBarraMenuAdministrador["submenu-button"]}>
            <span className={stylesBarraMenuAdministrador.menuIcon}><FiUsers /></span>
            Gestionar Usuarios
            <span className={stylesBarraMenuAdministrador.toggleIcon}><FiChevronDown /></span>
          </button>
          {submenuUsuarios && (
            <div className={stylesBarraMenuAdministrador["submenu"]}>
              <div className={stylesBarraMenuAdministrador["opcion-menu"]}>
                <a href="/RegistroEspecialista">Registrar usuario especialista</a>
              </div>
              <hr className={stylesBarraMenuAdministrador.hrPersonalizada} />
              <div className={stylesBarraMenuAdministrador["opcion-menu"]}>
                <a href="/TablaUsuarios">Editar o eliminar usuarios</a>

              </div>
              <hr className={stylesBarraMenuAdministrador.hrPersonalizada} />
            </div>
          )}
        </div>
        <hr className={stylesBarraMenuAdministrador.hrPersonalizada} />

        <div className={stylesBarraMenuAdministrador["opcion-menu"]}>
          <span className={stylesBarraMenuAdministrador.menuIcon}><FiBarChart2 /></span>
          <a href="/DashboardEstadistico">Dashboard estadístico</a>
        </div>
        <hr className={stylesBarraMenuAdministrador.hrPersonalizada} />
      </div>
      


      <div className={stylesBarraMenuAdministrador["div-barra"]}>
        <div className={stylesBarraMenuAdministrador["opcion-menu"]}>
         <span className={stylesBarraMenuAdministrador.menuIcon}><FiSettings /></span>
         <a href="/configuracion">Ajustes</a>

        </div>
        <div className={stylesBarraMenuAdministrador["opcion-menu"]}>
          <CerrarSesion />
        </div>
      </div>
        
    </div>
  );
}

export default BarraMenuAdministrador;
