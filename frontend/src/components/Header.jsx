import stylesHeader from "../styles/Header.module.css";
const logo = "/LogoReservia.png";



function Header() {
  return (
    <div className={stylesHeader['contenedor-barra']}>
      <div alt="Barra" className={stylesHeader['barra']}></div>
      <img src={logo} alt="Logo" className={stylesHeader['logo']} />
    </div>
  );
}

export default Header;
