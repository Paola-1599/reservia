import stylesInicioEspecialista from "../styles/InicioEspecialista.module.css";
import LayoutAdmin from "./Layouts/LayoutAdmin.jsx";

function InicioAdmin () {

    return(
      <LayoutAdmin>
    <div className={stylesInicioEspecialista['contenedor']}>
      {/* Imagen removida para mantener consistencia */}
      </div>
      </LayoutAdmin>
    ); 
}


export default InicioAdmin;