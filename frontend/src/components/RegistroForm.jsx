import React, { useState } from 'react';
import styles from "../styles/Registro.module.css";

//importacion del modal de confirmacion
import ConfirmModal from './modals/ConfirmModal';


// Importación de imagenes desde src/includes
import BackUpIcon from "../includes/Back UpiconSvg.co.svg";

const initialFormData = {
    nombre: '',
    documento: '',
    tipoDocumento: '',
    fechaNacimiento: '',
    telefono: '',
    direccion: '',
    email: '',
    password: '',
    confirmPassword: '',
};

// Componente de formulario de registro
function RegistroForm({
    //props
    endpoint,
    rol,
}) {
  //Estado para los datos del formulario
    const [formData, setFormData] = useState(initialFormData);

    
    //Estado para los mensajes de error en la entrada de datos
    const [errores, setErrores] = useState({});
    const [strength, setStrength] = useState({ width: "0%", color: "", text: "" });
    const [showPassword, setShowPassword] = useState(false);

     //Estado para modal
    const [mostrarModal, setMostrarModal] = useState(false);

    //Validación de los campos del formulario
    const validarCampo = (name, value) => {
        const newErrors = { ...errores };

        // Validar nombre
        if (name === 'nombre') {
            const regex = /^[a-zA-Z\s]+$/;
            newErrors.nombre = value && !regex.test(value)
                ? "El nombre no puede contener números ni caracteres especiales."
                : "";
        }

        // Validar documento
        if (name === 'documento') {
            const regex = /^[0-9]{5,}$/;
            newErrors.documento = value && !regex.test(value) ? "El documento debe ser numérico y tener al menos 5 dígitos." : "";
        }

        // Validar tipo de documento
        if (name === 'tipoDocumento') {
            newErrors.tipoDocumento = !value ? "Debes seleccionar un tipo de documento." : "";
        }

        // Validar fecha de nacimiento
        if (name === 'fechaNacimiento') {
            newErrors.fechaNacimiento = !value ? "Debes ingresar una fecha de nacimiento." : "";
        }

        // Validar teléfono
        if (name === 'telefono') {
            const regex = /^[0-9]{7,10}$/;
            newErrors.telefono = value && !regex.test(value) ? "El teléfono debe ser numérico y debe tener entre 7 y 10 dígitos." : "";
        }

        //Validar dirección
        if (name === 'direccion') {
            newErrors.direccion = value && value.length < 5 ? "La dirección es demasiado corta, agrega más detalles." : "";
        }


        // Validar email
        if (name === 'email') {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            newErrors.email = value && !regex.test(value) ? "El correo electrónico debe tener un formato válido." : "";
        }

        // Validar contraseña y evaluar la fortaleza de la misma
        if (name === 'password') {
            let strengthLevel = 0;
            if (value.length >= 8) strengthLevel++;
            if (/[A-Z]/.test(value)) strengthLevel++;
            if (/[0-9]/.test(value)) strengthLevel++;
            if (/[^A-Za-z0-9]/.test(value)) strengthLevel++;

            const colors = ["", "red", "orange", "gold", "green"];
            const texts = ["", "muy débil", "Débil", "Aceptable", "Fuerte"];

            setStrength({
                width: `${(strengthLevel * 25)}%`,
                color: colors[strengthLevel],
                text: texts[strengthLevel],
            });

            newErrors.password =
                value.length < 8
                    ? "La contraseña debe tener al menos 8 caracteres."
                    : !/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/.test(value)
                        ? "La contraseña no cumple con los requerimientos."
                        : "";
        }

        // Validar que las contraaseñás coincidan
        if (name === 'confirmPassword') {
            newErrors.confirmPassword =
                value !== formData.password
                    ? "Las contraseñas no coinciden."
                    : "";
        }

        //Actualizar los errores en el estado
        setErrores(newErrors);
    };

    //Manejo de cambios en los campos del formulario
    const handleChange = (e) => {
        setFormData ({ ...formData, [e.target.name]: e.target.value });

        //Validar el campo modificado
        validarCampo(e.target.name, e.target.value);
    }


    //Función del envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();


        // Verificar si hay errores
        const hayErrores = Object.values(errores).some(error => error);

            if (hayErrores) {
                alert("Por favor corrige los errores en el formulario.");
                return;
            } 


        //construir el objeto de datos a enviar
            const payload = {
                nombresApellidos: formData.nombre,
                documentoIdentidad: formData.documento,
                tipoDocumento: formData.tipoDocumento,
                fechaNacimiento: formData.fechaNacimiento,
                telefono: formData.telefono,
                direccion: formData.direccion,
                email: formData.email,
                password: formData.password,
                rol,
            }; 


             
        //Enviar los datos al backend
        try {
            const reponse = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            // Obtener la respuesta del servidor
            const data = await reponse.json();

            if (!reponse.ok) {
                alert(data.mensaje);
                return;
            }

        //Mostrar modal con Registro exitoso
        setMostrarModal(true);

        //Resetear el formulario
        setFormData(initialFormData);
        setErrores({});
        setStrength({ width: "0%", color: "", text: "" });
        setShowPassword(false);
        
        } catch (error) {
            alert("Error de conexión con el servidor. Por favor, intenta nuevamente más tarde.");
        }
        
          
 };

    //Función para manejar la confirmación del registro en el modal
        const handleConfirmarRegistro = () => {
            setMostrarModal(false);
            window.location.href = "/";
        };
        const handleCerrarModal = () => {
            setMostrarModal(false);
        };

    

    //Estructura visual del formulario
    return (
        // contenedor central donde va el header y el formulario
        <div className={styles.formContainer}>

             {/* Contenedor del header */}
            <div className={styles.headerForm}>
               {/* Botón de regresar atrás */ }
                <button type='button' className={styles.btnAtras} onClick={() => window.history.back()}>
                    <img src={BackUpIcon} alt="Atrás" className={styles.iconAtras} />
                    Atrás
                </button>  

                {/* Título del formulario */ }
            <h1>
                <span className={styles.tituloGris}>Registrarse con </span>
                <span className={styles.tituloMarca}>Reservia</span>
            </h1>
            
            </div>
            

            {/* Formulario de registro */ }

            <div className={styles["div-formulario"]}>
            <form onSubmit={handleSubmit} noValidate>
                {[
                    { name: "nombre", label: "Nombres y Apellidos" },
                    { name: "documento", label: "Documento de identidad" },
                    ].map(({ name, label, type = "text" }) => (
                        /* Modelo de los campos Nombre y documento del formulario */
                        <div key={name} className={errores[name] ? styles.error : ""}>
                            <label>
                                <span className={styles.required}>*</span> {label}
                            </label>

                            {errores[name] && (
                                <span className={`${styles.errorMessage} ${styles.active}`}>
                                    {errores[name]}
                                </span>
                            )}
                            <input
                                type={type}
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                autoCapitalize={name === "email" ? "none" : undefined}
                                autoComplete={name === "email" ? "email" : undefined}
                                required
                                />
                            </div>
                        ))}

                {/* Selector tipo de documento */}
                <div className={errores.tipoDocumento ? styles.error : ""}>
                    <label>
                        <span className={styles.required}>*</span> Tipo de documento
                    </label>
                    <select
                        name="tipoDocumento"
                        value={formData.tipoDocumento}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione tipo de documento</option>
                        <option value="CC">Cédula de Ciudadanía</option>
                        <option value="CE">Cédula de Extranjería</option>
                        <option value="TI">Tarjeta de Identidad</option>
                        <option value="PP">Pasaporte</option>
                        <option value="TE">Tarjeta de Extranjero</option>
                        <option value="PEP">Permiso Especial de Permanencia</option>
                    </select>
                </div>


                {/* Campo fecha de nacimiento */ }
                <div className={errores.fechaNacimiento ? styles.error : ""}>
                    <label>
                        <span className={styles.required}>*</span> Fecha de nacimiento
                    </label>
                    <input
                        type="date"
                        name="fechaNacimiento"
                        value={formData.fechaNacimiento}
                        onChange={handleChange}
                        required
                    />
                </div>

                {[
                    { name: "telefono", label: "Teléfono" },
                    { name: "direccion", label: "Dirección" },
                    { name: "email", label: "Correo Electrónico", type: "email" },
                ].map(({ name, label, type = "text" }) => (
                    /* Modelo de los campos telefono, dirección, email del formulario */
                    <div key={name} className={errores[name] ? styles.error : ""}>
                        <label>
                            <span className={styles.required}>*</span> {label}
                        </label>

                        {errores[name] && (
                            <span className={`${styles.errorMessage} ${styles.active}`}>
                                {errores[name]}
                            </span>
                        )}

                        <input
                        type={type}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        autoCapitalize={name === "email" ? "none" : undefined}
                        autoComplete={name === "email" ? "email" : undefined}
                        required
                        />
                    </div>
                ))}
                

                {/* Campo contraseña y confirmación de la misma */ }
                <label>
                    <span className={styles.required}>*</span> Crea una contraseña
                </label>
                <p className={styles["password-hint"]}>
                    Mínimo 8 caracteres, incluyendo símbolos, al menos una mayúscula y un número.
                </p>

                {errores.password && (
                    <span className={`${styles.errorMessage} ${styles.active}`}>
                        {errores.password}
                    </span>
                )}

                <div className={styles.passwordField}>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <i
                        className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                         onClick={() => setShowPassword(!showPassword)}
                    ></i>
                </div>

                <div className={styles.passwordStrength}>
                    <div
                        className={styles.strengthBar}
                        style={{ width: strength.width, backgroundColor: strength.color }}
                    ></div>
                </div>
                <small>{strength.text}</small>

                {/* Campo de confirmación de contraseña */ }
                <label>
                    <span className={styles.required}>*</span> Confirma tu contraseña
                </label>
                
                {errores.confirmPassword && (
                    <span className={`${styles.errorMessage} ${styles.active}`}>
                        {errores.confirmPassword}
                    </span>
                )}
                
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />

                <button type="submit" className={styles.btnCreate}>
                        Crear cuenta
                    </button>
            </form>
            </div>

            {/* Modal de confirmación de registro exitoso */}
            <ConfirmModal
                isOpen={mostrarModal}
                title= "Registro Exitoso"
                message= "Tu cuenta ha sido creada exitosamente. ahora puede iniciar sesion."
                confirmText="Iniciar sesión"
                cancelText="Quedarme aquí"
                onConfirm={handleConfirmarRegistro}
                onClose={handleCerrarModal}
            />
        </div>
    );
}
export default RegistroForm;