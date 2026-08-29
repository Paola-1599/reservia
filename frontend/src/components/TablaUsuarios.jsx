import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import styles from "../styles/TablaUsuarios.module.css";
import LayoutAdmin from "./Layouts/LayoutAdmin";
import IconAtras from "../includes/Back UpiconSvg.co.svg";
import IconoEditar from "../includes/IconoEditar.svg";
import IconoEliminar from "../includes/IconoEliminar.svg";
import ConfirmModal from "./modals/ConfirmModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faAngleLeft,  
    faAngleRight,
    faAnglesLeft,
    faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";

// Componente principal TablaUsuarios
export default function TablaUsuarios() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [recordsPerPage, setRecordsPerPage] = useState(15);
    const [currentPage, setCurrentPage] = useState(1);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

    // Cargar usuarios desde la API
    useEffect(() => {
        const cargarUsuarios = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch("http://localhost:4000/api/usuarios", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                setUsuarios(data);
            } catch (error) {
                console.error("Error cargando usuarios:", error);
            } finally {
                setLoading(false);
            }
        };

        cargarUsuarios();
    }, []);

    // Solicitar eliminación de usuario
    const solicitarEliminacion = (usuario) => {
        setUsuarioAEliminar(usuario);
        setMostrarConfirmacion(true);
    };

    // Manejar eliminación de usuario
    const handleEliminar = async () => {
        if (!usuarioAEliminar) return;

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`http://localhost:4000/api/usuarios/${usuarioAEliminar._id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                alert("Usuario eliminado correctamente");
                setUsuarios(usuarios.filter((u) => u._id !== usuarioAEliminar._id));
            } else {
                alert("Error al eliminar usuario");
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
            alert("Error al eliminar usuario");
        } finally {
            setMostrarConfirmacion(false);
            setUsuarioAEliminar(null);
        }
    };
     
    // Filtrar y paginar datos

    const filteredData = usuarios.filter((row) => {
        const term = search.toLowerCase();
        return (
            row.nombresApellidos?.toLowerCase().includes(term) ||
            row.email?.toLowerCase().includes(term) ||
            row.documentoIdentidad?.toLowerCase().includes(term) ||
            row.rol?.toLowerCase().includes(term) ||
            row.estadoUsuario?.toLowerCase().includes(term)
        );
    });

    // Calcular paginación
    const totalPages = Math.ceil(filteredData.length / recordsPerPage);
    const startIdx = (currentPage - 1) * recordsPerPage;
    const paginatedData = filteredData.slice(startIdx, startIdx + recordsPerPage);

    // Exportar a Excel    
        const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
        XLSX.writeFile(wb, "Usuarios.xlsx");
    };

    // Renderizado del componente
    return (
        <LayoutAdmin>
            <div className={styles.wrapper}>
                <div className={styles.headerWrapper}>
                    <button className={styles.btnAtras} onClick={() => window.history.back()}>
                        <img className={styles.iconAtras} src={IconAtras} alt="Atrás" />
                        Atrás
                    </button>

                    <h1 className={styles.title}>EDITAR Y ELIMINAR USUARIOS</h1>
                </div>

                <hr className={styles.hr} />

                <div className={styles.tableMainContainer}>
                    <div className={styles.searchContainer}>
                        <label>Buscar</label>
                        <input
                            type="text"
                            className={styles.inputSearch}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Documento</th>
                                    <th>Email</th>
                                    <th>Teléfono</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: "center" }}>
                                            Cargando...
                                        </td>
                                    </tr>
                                ) : paginatedData.length > 0 ? (
                                    paginatedData.map((usuario) => (
                                        <tr key={usuario._id}>
                                            <td>{usuario.nombresApellidos}</td>
                                            <td>{usuario.documentoIdentidad}</td>
                                            <td>{usuario.email}</td>
                                            <td>{usuario.telefono}</td>
                                            <td>{usuario.rol}</td>
                                            <td>
                                                <span
                                                    className={
                                                        usuario.estadoUsuario === "activo"
                                                            ? styles.badgeActivo
                                                            : styles.badgeInactivo
                                                    }
                                                >
                                                    {usuario.estadoUsuario}
                                                </span>
                                            </td>
                                            <td>
                                                <div className={styles.actionsContainer}>
                                                    <button
                                                        onClick={() => navigate(`/Editar/${usuario._id}`)}
                                                        className={styles.btnEditar}
                                                        title="Editar usuario"
                                                    >
                                                        <img src={IconoEditar} alt="Editar" />
                                                    </button>
                                                    <button
                                                        onClick={() => solicitarEliminacion(usuario)}
                                                        className={styles.btnEliminar}
                                                        title="Eliminar usuario"
                                                    >
                                                        <img src={IconoEliminar} alt="Eliminar" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: "center" }}>
                                            Sin datos.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className={styles.footerTable}>
                        <button className={styles.btnExportarExcel} onClick={exportToExcel}>
                            Exportar Excel
                        </button>

                        <nav>
                            <div className={styles.rowSelector}>
                                <label>Mostrar</label>
                                <select
                                    value={recordsPerPage}
                                    onChange={(e) => setRecordsPerPage(Number(e.target.value))}
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={30}>30</option>
                                    <option value={50}>50</option>
                                </select>
                                <span>datos</span>
                            </div>

                            <ul className={styles.paginationNav}>
                                <li className={styles.pageItem}>
                                    <button onClick={() => setCurrentPage(1)}>
                                        <FontAwesomeIcon icon={faAnglesLeft} />
                                    </button>
                                </li>

                                <li className={styles.pageItem}>
                                    <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>
                                        <FontAwesomeIcon icon={faAngleLeft} />
                                    </button>
                                </li>

                                <li className={styles.pageInfo}>
                                    Página {currentPage} de {totalPages}
                                </li>

                                <li className={styles.pageItem}>
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                    >
                                        <FontAwesomeIcon icon={faAngleRight} />
                                    </button>
                                </li>

                                <li className={styles.pageItem}>
                                    <button onClick={() => setCurrentPage(totalPages)}>
                                        <FontAwesomeIcon icon={faAnglesRight} />
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Modal de confirmación de eliminación */}
            <ConfirmModal
                isOpen={mostrarConfirmacion}
                title="Eliminar Usuario"
                message={`¿Estás seguro de que deseas eliminar al usuario "${usuarioAEliminar?.nombresApellidos}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                onConfirm={handleEliminar}
                onClose={() => {
                    setMostrarConfirmacion(false);
                    setUsuarioAEliminar(null);
                }}
            />
        </LayoutAdmin>
    );
}

