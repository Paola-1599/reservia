import stylesInicioEspecialista from "../styles/InicioEspecialista.module.css";
import LayoutEspecialistas from "./Layouts/LayoutEspecialistas.jsx";

function InicioEspecialistas() {
  return (
    <LayoutEspecialistas>
      <div className={stylesInicioEspecialista.contenedor}></div>
    </LayoutEspecialistas>
  );
}

export default InicioEspecialistas;