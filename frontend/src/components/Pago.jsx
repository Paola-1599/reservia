import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IconoAtras from "../includes/Back UpiconSvg.co.svg";
import styles from '../styles/Pago.module.css';
import LayoutCliente from './Layouts/LayoutCliente';

const Pago = () => {
    const navigate = useNavigate();

    const [metodoPago, setMetodoPago] = useState("");
    const [cargando, setCargando] = useState(false);

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const servicio = JSON.parse(localStorage.getItem("servicioSeleccionado"));
    const especialista = JSON.parse(localStorage.getItem("especialistaSeleccionado"));

    const fecha = localStorage.getItem("fechaCita");
    const horaInicio = localStorage.getItem("horaInicio");
    const horaFin = localStorage.getItem("horaFin");

    useEffect(() => {
        if (!usuario || !servicio || !especialista) {
            alert("Faltan datos para procesar el pago.");
            navigate("/InicioCliente");
        }
    }, [navigate, usuario, servicio, especialista]);

    
      const realizarPago = async () => {
  if (!metodoPago) {
    alert("Por favor, seleccione un método de pago.");
    return;
  }

  setCargando(true);

  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const token = localStorage.getItem("token");
    if (!token) {
        alert("Sesión expirada. Por favor, inicie sesión nuevamente.");
        navigate("/");
        return;
    }


    const response = await fetch("http://localhost:4000/api/pagos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
                cliente: usuario._id,
                especialista: especialista._id,
        servicio: servicio._id,
        metodo: metodoPago === "pse" ? "PSE" : "TARJETA",
        valor: servicio.precioServicio,
        fecha,
        horaInicio,
        horaFin,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error backend:", data);
      throw new Error(data.mensaje || "Error al procesar el pago");
    }

    alert("Pago realizado y cita creada con éxito");

        localStorage.removeItem("fechaCita");
        localStorage.removeItem("horaInicio");
        localStorage.removeItem("horaFin");
        localStorage.removeItem("especialistaSeleccionado");
        localStorage.removeItem("servicioSeleccionado");

    navigate("/InicioCliente");

  } catch (error) {
    console.error(error);
    alert("Hubo un error al procesar el pago.");
  } finally {
    setCargando(false);
  }
};

    return (

        <LayoutCliente>
        <div className={styles.contenedor}>
            <div className={styles.headerPago}>
                <button
                    type='button'
                    className={styles.btnAtras}
                    onClick={() => window.history.back()}
                >   
                    <img src={IconoAtras} alt="Atrás" className={styles.iconAtras} />
                    Atrás
                </button>
                <h1>MÉTODO DE PAGO</h1>
            </div>
            <hr />

            <div className={styles.resumen}>
                <p><strong>Servicio:</strong> {servicio.nombreServicio}</p>
                <p><strong>Especialista:</strong> {especialista.nombresApellidos}</p>
                <p><strong>Fecha:</strong> {fecha}</p>
                <p><strong>Hora:</strong> {horaInicio} - {horaFin}</p>
                <p className={styles.precio}> <strong>Total:</strong> ${servicio.precioServicio}</p>
            </div>

            <h2>Método de pago</h2>

            <div className={styles.metodos}>
                <label className={styles.opcion}>
                    <input
                        type="radio"
                        name="metodo"
                        value="tarjeta"
                        onChange={(e) => setMetodoPago (e.target.value)}
                    />
                    Tarjeta de crédito/débito
                </label>

                <label className={styles.opcion}>
                    <input
                        type="radio"
                        name="metodo"
                        value="pse"
                        onChange={(e) => setMetodoPago (e.target.value)}
                    />
                    PSE
                </label>
            </div>

            {metodoPago === "tarjeta" && (
                <div className={styles.formPago}>
                    <input type="text" placeholder="Número de tarjeta" />
                    <input type="text" placeholder="Nombre del titular" />
                    <div className={styles.fila}>
                        <input type="text" placeholder="MM/AA" />
                        <input type="text" placeholder="CVV" />
                    </div>
                </div>
            )}

            {metodoPago === "pse" && (
                <div className={styles.formPago}>
                    <select>
                        <option >Seleccione su banco</option>
                        <option >Bancolombia</option>
                        <option >Davivienda</option>
                        <option >BBVA</option>
                        <option >DAVIbank</option>
                    </select>
                    <input type="text" placeholder="Correo de quien paga" />
                </div>
            )}

            <button
                className={styles.botonPagar}
                onClick={realizarPago}
                disabled={cargando}
            >
                {cargando ? "Procesando pago..." : "Pagar y confirmar cita"}
            </button>
        </div>
        </LayoutCliente>
    );
};
export default Pago;
