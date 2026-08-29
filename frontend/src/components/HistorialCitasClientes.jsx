import React, { useEffect, useMemo, useState } from "react";
import LayoutCliente from "./Layouts/LayoutCliente";
import IconAtras from "../includes/Back UpiconSvg.co.svg";
import styles from "../styles/HistorialCitasCliente.module.css";
import { obtenerCitaCliente } from "../services/citasService";

function formatFecha(fechaIso) {
  const date = new Date(fechaIso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function extractId(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value._id) return String(value._id);
  return String(value);
}

function sanitizePdfText(text) {
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, " ");
}

function escapePdfText(text) {
  return sanitizePdfText(text)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function truncateForColumn(text, maxChars) {
  if (!text) return "-";
  if (text.length <= maxChars) return text;
  return `${text.slice(0, Math.max(maxChars - 3, 1))}...`;
}

function toHexString(binary) {
  let hex = "";
  for (let i = 0; i < binary.length; i += 1) {
    hex += binary.charCodeAt(i).toString(16).padStart(2, "0");
  }
  return `${hex}>`;
}

function loadLogoDataForPdf() {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const targetWidth = 220;
        const targetHeight = 72;
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("No fue posible preparar el logo para PDF."));
          return;
        }

        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        const ratio = Math.min(targetWidth / image.width, targetHeight / image.height);
        const drawWidth = image.width * ratio;
        const drawHeight = image.height * ratio;
        const drawX = (targetWidth - drawWidth) / 2;
        const drawY = (targetHeight - drawHeight) / 2;
        ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.86);
        const base64 = dataUrl.split(",")[1] || "";
        const binary = atob(base64);

        resolve({
          width: targetWidth,
          height: targetHeight,
          hexData: toHexString(binary),
        });
      } catch (err) {
        reject(err);
      }
    };

    image.onerror = () => reject(new Error("No se pudo cargar el logo para el PDF."));
    image.src = "/LogoReservia.png";
  });
}

function buildPdfBlob(rows, logoData = null) {
  const pageWidth = 595;
  const pageHeight = 842;
  const marginLeft = 35;
  const tableWidth = pageWidth - marginLeft * 2;
  const rowHeight = 18;
  const tableTopStart = 705;
  const footerY = 32;

  const columns = [
    { key: "fecha", title: "Fecha", width: 70 },
    { key: "servicio", title: "Servicio", width: 125 },
    { key: "fechaHora", title: "Fecha y hora", width: 140 },
    { key: "especialista", title: "Especialista", width: 132 },
    { key: "estado", title: "Estado", width: 93 },
  ];

  const pages = [];

  const startPage = () => {
    const commands = [];

    commands.push("0.443 0.690 0.773 rg");
    commands.push(`35 790 ${tableWidth} 30 re f`);

    if (logoData) {
      const maxLogoWidth = 120;
      const maxLogoHeight = 32;
      const scale = Math.min(maxLogoWidth / logoData.width, maxLogoHeight / logoData.height);
      const logoWidth = logoData.width * scale;
      const logoHeight = logoData.height * scale;
      const logoX = marginLeft + tableWidth - logoWidth - 10;
      const logoY = 790 + (30 - logoHeight) / 2;

      commands.push("q");
      commands.push(`${logoWidth.toFixed(2)} 0 0 ${logoHeight.toFixed(2)} ${logoX.toFixed(2)} ${logoY.toFixed(2)} cm`);
      commands.push("/Im1 Do");
      commands.push("Q");
    }

    commands.push("BT");
    commands.push("/F2 14 Tf");
    commands.push("1 1 1 rg");
    commands.push(`1 0 0 1 ${marginLeft + 12} 801 Tm (RESERVIA - Historial de Citas) Tj`);
    commands.push("ET");

    commands.push("BT");
    commands.push("/F1 10 Tf");
    commands.push("0.369 0.349 0.318 rg");
    commands.push(
      `1 0 0 1 ${marginLeft} 770 Tm (Generado: ${escapePdfText(
        new Date().toLocaleDateString("es-CO")
      )}) Tj`
    );
    commands.push("ET");

    let x = marginLeft;
    commands.push("0.949 0.929 0.878 rg");
    commands.push(`${marginLeft} ${tableTopStart} ${tableWidth} ${rowHeight} re f`);

    columns.forEach((col) => {
      commands.push("BT");
      commands.push("/F2 9 Tf");
      commands.push("0.290 0.275 0.243 rg");
      commands.push(`1 0 0 1 ${x + 4} ${tableTopStart + 5} Tm (${escapePdfText(col.title)}) Tj`);
      commands.push("ET");
      x += col.width;
    });

    commands.push("0.820 0.780 0.690 RG");
    commands.push(`${marginLeft} ${tableTopStart} m ${marginLeft + tableWidth} ${tableTopStart} l S`);

    return { commands, y: tableTopStart - rowHeight, rowIndex: 0 };
  };

  let page = startPage();

  rows.forEach((row) => {
    if (page.y <= 75) {
      pages.push(page);
      page = startPage();
    }

    if (page.rowIndex % 2 === 0) {
      page.commands.push("0.992 0.980 0.945 rg");
    } else {
      page.commands.push("0.949 0.929 0.878 rg");
    }
    page.commands.push(`${marginLeft} ${page.y} ${tableWidth} ${rowHeight} re f`);

    const values = {
      fecha: row.fecha,
      servicio: row.servicio,
      fechaHora: row.fechaHora,
      especialista: row.especialista,
      estado: row.estado,
    };

    let x = marginLeft;
    columns.forEach((col) => {
      const maxChars = Math.max(Math.floor((col.width - 8) / 5.2), 6);
      const cellText = truncateForColumn(String(values[col.key] || "-"), maxChars);
      page.commands.push("BT");
      page.commands.push("/F1 8.5 Tf");
      page.commands.push("0.369 0.349 0.318 rg");
      page.commands.push(`1 0 0 1 ${x + 4} ${page.y + 5} Tm (${escapePdfText(cellText)}) Tj`);
      page.commands.push("ET");
      x += col.width;
    });

    page.commands.push("0.890 0.859 0.792 RG");
    page.commands.push(`${marginLeft} ${page.y} m ${marginLeft + tableWidth} ${page.y} l S`);

    page.y -= rowHeight;
    page.rowIndex += 1;
  });

  if (rows.length === 0) {
    page.commands.push("BT");
    page.commands.push("/F1 10 Tf");
    page.commands.push("0.369 0.349 0.318 rg");
    page.commands.push(`1 0 0 1 ${marginLeft + 8} ${page.y + 3} Tm (Sin registros para exportar.) Tj`);
    page.commands.push("ET");
  }

  pages.push(page);

  const objects = [];

  const fontRegularId = 3;
  const fontBoldId = 4;
  const imageId = logoData ? 5 : null;
  const pageStartId = logoData ? 6 : 5;

  objects.push("1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj");

  const pageObjectIds = pages.map((_, index) => pageStartId + index * 2);
  const contentObjectIds = pages.map((_, index) => pageStartId + 1 + index * 2);

  objects.push(
    `2 0 obj << /Type /Pages /Count ${pages.length} /Kids [${pageObjectIds
      .map((id) => `${id} 0 R`)
      .join(" ")}] >> endobj`
  );

  objects.push(`${fontRegularId} 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj`);
  objects.push(`${fontBoldId} 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj`);

  if (logoData) {
    objects.push(
      `${imageId} 0 obj << /Type /XObject /Subtype /Image /Width ${logoData.width} /Height ${logoData.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter [/ASCIIHexDecode /DCTDecode] /Length ${logoData.hexData.length} >> stream\n${logoData.hexData}\nendstream endobj`
    );
  }

  pages.forEach((pageData, i) => {
    const pageId = pageObjectIds[i];
    const contentId = contentObjectIds[i];

    pageData.commands.push("BT");
    pageData.commands.push("/F1 9 Tf");
    pageData.commands.push("0.533 0.502 0.443 rg");
    pageData.commands.push(
      `1 0 0 1 ${marginLeft} ${footerY} Tm (Pagina ${i + 1} de ${pages.length}) Tj`
    );
    pageData.commands.push("ET");

    const stream = pageData.commands.join("\n");

    const resources = logoData
      ? `/Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R >> /XObject << /Im1 ${imageId} 0 R >> >>`
      : `/Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R >> >>`;

    objects.push(
      `${pageId} 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] ${resources} /Contents ${contentId} 0 R >> endobj`
    );

    objects.push(
      `${contentId} 0 obj << /Length ${stream.length} >> stream\n${stream}\nendstream endobj`
    );
  });

  let pdf = "%PDF-1.4\n";
  const xref = [0];

  objects.forEach((obj) => {
    xref.push(pdf.length);
    pdf += `${obj}\n`;
  });

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  xref.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
}

export default function HistorialCitasCliente() {
  const [search, setSearch] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [citas, setCitas] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError("");

        const usuario = JSON.parse(localStorage.getItem("usuario"));
        const token = localStorage.getItem("token");

        if (!usuario?.id || !token) {
          throw new Error("No se encontró sesión de cliente.");
        }

        const [citasData, ventasRes] = await Promise.all([
          obtenerCitaCliente(usuario.id, token),
          fetch("http://localhost:4000/api/ventas", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!ventasRes.ok) {
          throw new Error("No fue posible cargar las ventas para completar el historial.");
        }

        const ventasData = await ventasRes.json();

        setCitas(Array.isArray(citasData) ? citasData : []);
        setVentas(Array.isArray(ventasData) ? ventasData : []);
      } catch (loadError) {
        setError(loadError.message || "Error al cargar historial de citas.");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const rows = useMemo(() => {
    const ventaByCita = new Map();

    ventas.forEach((venta) => {
      const citaId = extractId(venta.cita);
      if (!citaId) return;
      if (!ventaByCita.has(citaId)) {
        ventaByCita.set(citaId, venta);
      }
    });

    return citas
      .map((cita) => {
        const citaId = extractId(cita._id);
        const ventaRelacionada = ventaByCita.get(citaId);

        return {
          id: citaId,
          fechaSort: new Date(cita.fecha).getTime() || 0,
          fecha: formatFecha(cita.fecha),
          hora: `${cita.horaInicio || "-"} - ${cita.horaFin || "-"}`,
          servicio: ventaRelacionada?.servicio?.nombreServicio || "No registrado",
          especialista: cita?.especialista?.nombresApellidos || "-",
          estado: cita?.estado || "-",
        };
      })
      .sort((a, b) => b.fechaSort - a.fechaSort);
  }, [citas, ventas]);

  const filteredRows = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return rows;

    return rows.filter((row) => {
      return (
        row.fecha.toLowerCase().includes(term) ||
        row.hora.toLowerCase().includes(term) ||
        row.servicio.toLowerCase().includes(term) ||
        row.especialista.toLowerCase().includes(term) ||
        row.estado.toLowerCase().includes(term)
      );
    });
  }, [rows, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, recordsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / recordsPerPage));
  const startIdx = (currentPage - 1) * recordsPerPage;
  const paginatedRows = filteredRows.slice(startIdx, startIdx + recordsPerPage);

  const descargarPdf = async () => {
    const pdfRows = filteredRows.map((row) => ({
      fecha: row.fecha,
      servicio: row.servicio,
      fechaHora: `${row.fecha} - ${row.hora}`,
      especialista: row.especialista,
      estado: row.estado,
    }));

    let logoData = null;
    try {
      logoData = await loadLogoDataForPdf();
    } catch (logoError) {
      console.error("No se pudo incluir el logo en el PDF:", logoError);
    }

    const pdfBlob = buildPdfBlob(pdfRows, logoData);
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "HistorialCitasCliente.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <LayoutCliente>
      <div className={styles.wrapper}>
        <div className={styles.headerWrapper}>
          <button className={styles.btnAtras} onClick={() => window.history.back()}>
            <img className={styles.iconAtras} src={IconAtras} alt="Atrás" />
            Atrás
          </button>

          <h1 className={styles.title}>HISTORIAL DE CITAS</h1>
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
              placeholder="Fecha, servicio, especialista..."
            />
          </div>

          {loading ? <p className={styles.stateMessage}>Cargando historial...</p> : null}
          {!loading && error ? <p className={styles.errorMessage}>{error}</p> : null}

          {!loading && !error ? (
            <>
              <div className={styles.tableContainer}>
                <div className={styles.tableScroll}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Servicio</th>
                        <th>Fecha y hora</th>
                        <th>Especialista</th>
                        <th>Estado</th>
                      </tr>
                    </thead>

                    <tbody>
                      {paginatedRows.length > 0 ? (
                        paginatedRows.map((row) => (
                          <tr key={row.id}>
                            <td>{row.fecha}</td>
                            <td>{row.servicio}</td>
                            <td>{row.fecha} - {row.hora}</td>
                            <td>{row.especialista}</td>
                            <td>
                              <span
                                className={
                                  row.estado === "cancelada"
                                    ? styles.badgeCancelada
                                    : styles.badgeProgramada
                                }
                              >
                                {row.estado}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" style={{ textAlign: "center" }}>
                            Sin registros.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className={styles.actionsRow}>
                <button className={styles.btnPdf} onClick={descargarPdf}>
                  Descargar PDF
                </button>
              </div>

              <div className={styles.footerTable}>
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
                    <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                      {'<<'}
                    </button>
                  </li>
                  <li className={styles.pageItem}>
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      {'<'}
                    </button>
                  </li>
                  <li className={styles.pageInfo}>Página {currentPage} de {totalPages}</li>
                  <li className={styles.pageItem}>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      {'>'}
                    </button>
                  </li>
                  <li className={styles.pageItem}>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      {'>>'}
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </LayoutCliente>
  );
}