import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import styles from "../styles/TablaHistorialVentas.module.css";
import LayoutAdmin from "./Layouts/LayoutAdmin";
import DateRangeFilter from "./DateRangeFilter";
import IconAtras from "../includes/Back UpiconSvg.co.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronDown,
    faChevronUp,
    faCalendarAlt,
    faAngleLeft,
    faAngleRight,
    faAnglesLeft,
    faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";



export default function TablaHistorialVentas() {
    const [search, setSearch] = useState("");
    const [recordsPerPage, setRecordsPerPage] = useState(15);
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilter, setShowFilter] = useState(false);
    const [dateRange, setDateRange] = useState({ start: null, end: null });
    const [sortOrder, setSortOrder] = useState("asc");
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
  const cargarVentas = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:4000/api/ventas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();


      // Adaptar estructura backend → tabla
      const ventasFormateadas = data.map((venta) => {
  const fechaDate = new Date(venta.createdAt);

  return {
    idFactura: venta.idFactura.slice(-6).toUpperCase(),

    // 🔹 FECHA REAL (para ordenar y filtrar)
    fechaRaw: fechaDate,

    // 🔹 FECHA FORMATEADA (solo para mostrar)
    fechaHora: fechaDate.toLocaleString("es-CO", {
      timeZone: "America/Bogota",
    }),

        nombreCliente: venta.cliente?.nombresApellidos || "—",
        idCliente: venta.cliente?.documentoIdentidad || "—",
        especialista: venta.especialista?.nombresApellidos || "—",
    servicio: venta.servicio?.nombreServicio || "—",
    valor: venta.valor,
  };
});


      setVentas(ventasFormateadas);
    } catch (error) {
      console.error("Error cargando ventas:", error);
    } finally {
      setLoading(false);
    }
  };

  cargarVentas();
}, []);

    

    const filteredData = ventas.filter((row) => {
        const term = search.toLowerCase();
        return (
            row.idFactura.toLowerCase().includes(term) ||
            row.nombreCliente.toLowerCase().includes(term) ||
            row.idCliente.toLowerCase().includes(term) ||
            row.especialista.toLowerCase().includes(term) ||
            row.servicio.toLowerCase().includes(term) ||
            row.valor.toString().includes(term)
        );
    });

    const updateFilter = (type, value) => {
        setDateRange((prev) => ({
            ...prev,
            [type]: value,
        }));
    };

    const filteredByDate = filteredData.filter((row) => {
        if (!dateRange.start && !dateRange.end) return true;

        const fecha = row.fechaRaw;
        const inicio = dateRange.start ? new Date(dateRange.start) : null;
        const fin = dateRange.end ? new Date(dateRange.end) : null;

        return (!inicio || fecha >= inicio) && (!fin || fecha <= fin);
    });

    const sortedData = [...filteredByDate].sort((a, b) => {
    return sortOrder === "asc"
        ? a.fechaRaw - b.fechaRaw
        : b.fechaRaw - a.fechaRaw;
    });

    const toggleSort = () => setSortOrder(sortOrder === "asc" ? "desc" : "asc");

    const totalPages = Math.ceil(sortedData.length / recordsPerPage);
    const startIdx = (currentPage - 1) * recordsPerPage;
    const paginatedData = sortedData.slice(startIdx, startIdx + recordsPerPage);

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(sortedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "HistorialVentas");
        XLSX.writeFile(wb, "HistorialVentas.xlsx");
    };

    return (
        <LayoutAdmin>
        <div className={styles.wrapper}>
            <div className={styles.headerWrapper}>
                <button className={styles.btnAtras} onClick={() => window.history.back()}>
                    <img className={styles.iconAtras} src={IconAtras} alt="Atrás" />
                    Atrás
                </button>

                <h1 className={styles.title}>CONSULTAR HISTORIAL DE VENTAS</h1>
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
                    <div className={styles.tableScroll}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID Factura</th>

                                <th className={styles.thFechaHora}>
                                    Fecha y hora
                                    <FontAwesomeIcon
                                        icon={sortOrder === "asc" ? faChevronUp : faChevronDown}
                                        className={styles.iconSort}
                                        onClick={toggleSort}
                                    />

                                    <FontAwesomeIcon
                                        icon={faCalendarAlt}
                                        className={styles.iconCalendar}
                                        onClick={() => setShowFilter(!showFilter)}
                                    />

                                </th>

                                <th>Nombre Cliente</th>
                                <th>ID Cliente</th>
                                <th>Especialista</th>
                                <th>Servicio</th>
                                <th>Valor</th>
                            </tr>
                        </thead>


                        <tbody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.idFactura}</td>
                                        <td>{row.fechaHora}</td>
                                        <td>{row.nombreCliente}</td>
                                        <td>{row.idCliente}</td>
                                        <td>{row.especialista}</td>
                                        <td>{row.servicio}</td>
                                        <td>COP ${row.valor}</td>
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
                </div>
                {showFilter && (

                            <div className={styles.dateFilterWrapper}>
                            <DateRangeFilter
                                startDate={dateRange.start}
                                   endDate={dateRange.end}
                                onStartChange={(value) => updateFilter("start", value)}
                                onEndChange={(value) => updateFilter("end", value)}
                            />
                            </div>
                        )}

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
        </LayoutAdmin>
    );
}