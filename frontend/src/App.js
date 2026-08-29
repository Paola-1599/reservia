import React from "react"; 
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css'

import Login from  './components/Login.jsx';
import RecuperarContraseña from './components/RecuperarContraseña.jsx';
import CambiarContraseña from './components/CambiarContraseña.jsx';
import RegistroCliente from './components/RegistroCliente.jsx';
import RegistroEspecialista from './components/RegistroEspecialista.jsx';
import Bienvenida from './components/Bienvenida.jsx';
import InicioCliente from './components/InicioCliente.jsx';
import InicioEspecialista from './components/InicioEspecialista.jsx';
import InicioAdmin from './components/InicioAdmin.jsx';
import RegistroServicio from './components/RegistroServicio.jsx';
import ActualizarCatalogo from './components/GestionarCatalogo.jsx';
import HistorialVentas from './components/TablaHistorialVentas.jsx';
import TablaUsuarios from './components/TablaUsuarios.jsx';
import Ajustes from './components/EliminarCuenta.jsx';
import GestionarDisponibilidadEspecialista from './components/GestionarDisponibilidadEspecialista.jsx';
import VerCitasPendientesEspecialista from './components/VerCitasPendientesEspecialista.jsx';
import CatalogoServicios from './components/CatalogoServicios.jsx';
import DetallesServicio from './components/DetallesServicio.jsx';
import SeleccionarEspecialista from './components/SeleccionarEspecialista.jsx';
import DisponibilidadEspecialista from './components/DisponibilidadEspecialista.jsx';
import ResumenCita from './components/ResumenCita.jsx';
import Pago from './components/Pago.jsx';
import Editar from './components/Editar.jsx';
import DashboardEstadistico from './components/DashboardEstadistico.jsx';
import HistorialCitasCliente from './components/HistorialCitasClientes.jsx';










function App() {
  return (
    <BrowserRouter>
      {/* Aqui  van las rutas de la aplicación */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/RecuperarContraseña" element={<RecuperarContraseña />} />
        <Route path="/CambiarContraseña" element={<CambiarContraseña />} />
        <Route path="/RegistroCliente" element={<RegistroCliente />} />
        <Route path="/bienvenida/:rol" element={<Bienvenida />} />

        <Route path="/InicioAdmin" element={<InicioAdmin />} />
        {/* Acciones del admin */}
        <Route path="/RegistroServicio" element={<RegistroServicio />} />
        <Route path="/actualizarCatalogo" element={<ActualizarCatalogo />} />
        <Route path="/historialVentas" element={<HistorialVentas />} />
        <Route path="/RegistroEspecialista" element={<RegistroEspecialista />} />
        <Route path="/TablaUsuarios" element={<TablaUsuarios />} />
        <Route path="/DashboardEstadistico" element={<DashboardEstadistico />} />
        <Route path="/Editar/:id" element={<Editar />} />
        <Route path="/Ajustes" element={<Ajustes />} />
        <Route path="/configuracion" element={<Ajustes />} />

        <Route path="/InicioEspecialista" element={<InicioEspecialista />} />
        {/* Acciones del especialista */}
        <Route path="/GestionarDisponibilidadEspecialista" element={<GestionarDisponibilidadEspecialista />} />
        <Route path="/CitasPendientesEspecialista" element={<VerCitasPendientesEspecialista />} />

        
        <Route path="/InicioCliente" element={<InicioCliente />} />
        {/* Acciones del cliente */}
        <Route path="/catalogo" element={<CatalogoServicios />} />
        <Route path="/servicios/:id" element={<DetallesServicio />} />
        <Route path="/seleccionar-especialista/:servicioId" element={<SeleccionarEspecialista />} />
        <Route path="/disponibilidad/:especialistaId" element={<DisponibilidadEspecialista />} />
        <Route path="/resumenCita" element={<ResumenCita />} />
        <Route path="/realizarPago" element={<Pago />} />
        <Route path="/historialCitas" element={<HistorialCitasCliente />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
