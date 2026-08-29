import React, { useEffect, useMemo, useState } from "react";
import LayoutAdmin from "./Layouts/LayoutAdmin";
import styles from "../styles/DashboardEstadistico.module.css";
import IconAtras from "../includes/Back UpiconSvg.co.svg";

const COLORS = [
  "var(--primaryB)",
  "var(--primaryG)",
  "#8AB9A8",
  "#C8A46B",
  "#9A8DAA",
  "#B97777",
];

function numberFormat(value) {
  return new Intl.NumberFormat("es-CO").format(value || 0);
}

function getYearFromDate(dateValue) {
  const date = new Date(dateValue);
  return Number.isNaN(date.getTime()) ? null : date.getFullYear();
}

function buildDonutBackground(items) {
  const total = items.reduce((acc, item) => acc + item.value, 0);

  if (!total) {
    return "conic-gradient(var(--surface1) 0deg 360deg)";
  }

  let currentDeg = 0;
  const slices = items.map((item) => {
    const sliceDeg = (item.value / total) * 360;
    const start = currentDeg;
    const end = currentDeg + sliceDeg;
    currentDeg = end;
    return `${item.color} ${start}deg ${end}deg`;
  });

  return `conic-gradient(${slices.join(", ")})`;
}

function DonutCard({ title, totalLabel, totalValue, items, subtitle }) {
  const total = items.reduce((acc, item) => acc + item.value, 0);

  return (
    <article className={styles.card}>
      <h3>{title}</h3>
      {subtitle ? <p className={styles.cardSubtitle}>{subtitle}</p> : null}

      <div className={styles.donutRow}>
        <div
          className={styles.donut}
          style={{ background: buildDonutBackground(items) }}
          role="img"
          aria-label={`${title}, total ${totalValue}`}
        >
          <div className={styles.donutCenter}>
            <span className={styles.totalLabel}>{totalLabel}</span>
            <strong>{totalValue}</strong>
          </div>
        </div>

        <ul className={styles.legend}>
          {items.map((item) => {
            const percentage = total ? ((item.value * 100) / total).toFixed(1) : "0.0";
            return (
              <li key={item.label}>
                <span
                  className={styles.colorDot}
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
                <strong>{numberFormat(item.value)}</strong>
                <span>{percentage}%</span>
              </li>
            );
          })}
        </ul>
      </div>
    </article>
  );
}

export default function DashboardEstadistico() {
  const [ventas, setVentas] = useState([]);
  const [citas, setCitas] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedService, setSelectedService] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const [ventasRes, usuariosRes] = await Promise.all([
          fetch("http://localhost:4000/api/ventas", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:4000/api/usuarios", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!ventasRes.ok || !usuariosRes.ok) {
          throw new Error("No fue posible obtener la información estadística.");
        }

        const [ventasData, usuariosData] = await Promise.all([
          ventasRes.json(),
          usuariosRes.json(),
        ]);

        const especialistas = (usuariosData || []).filter((u) => u.rol === "especialista");

        const citasPorespecialista = await Promise.all(
          especialistas.map(async (especialista) => {
            const res = await fetch(
              `http://localhost:4000/api/citas/especialista/${especialista._id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!res.ok) return [];
            return res.json();
          })
        );

        const citasData = citasPorespecialista.flat();

        setVentas(Array.isArray(ventasData) ? ventasData : []);
        setCitas(Array.isArray(citasData) ? citasData : []);
      } catch (fetchError) {
        setError(fetchError.message || "Error al cargar estadísticas.");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const availableYears = useMemo(() => {
    const years = new Set();

    ventas.forEach((venta) => {
      const y = getYearFromDate(venta.createdAt);
      if (y) years.add(y);
    });

    citas.forEach((cita) => {
      const y = getYearFromDate(cita.fecha || cita.createdAt);
      if (y) years.add(y);
    });

    return Array.from(years).sort((a, b) => b - a);
  }, [ventas, citas]);

  useEffect(() => {
    if (!selectedYear && availableYears.length > 0) {
      setSelectedYear(String(availableYears[0]));
    }
  }, [availableYears, selectedYear]);

  const serviceOptions = useMemo(() => {
    const names = new Set();
    ventas.forEach((venta) => {
      const name = venta?.servicio?.nombreServicio || "Sin servicio";
      names.add(name);
    });
    return ["Todos", ...Array.from(names).sort((a, b) => a.localeCompare(b))];
  }, [ventas]);

  const metrics = useMemo(() => {
    const currentYear = Number(selectedYear);
    const previousYear = currentYear - 1;

    const ventasCurrent = ventas.filter(
      (venta) => getYearFromDate(venta.createdAt) === currentYear
    );
    const ventasPrevious = ventas.filter(
      (venta) => getYearFromDate(venta.createdAt) === previousYear
    );

    const ventasCurrentByService =
      selectedService === "Todos"
        ? ventasCurrent
        : ventasCurrent.filter(
            (venta) => (venta?.servicio?.nombreServicio || "Sin servicio") === selectedService
          );

    const citasCurrent = citas.filter(
      (cita) => getYearFromDate(cita.fecha || cita.createdAt) === currentYear
    );
    const citasCanceladasCurrent = citasCurrent.filter((cita) => cita.estado === "cancelada");

    const serviceMap = new Map();
    ventasCurrent.forEach((venta) => {
      const serviceName = venta?.servicio?.nombreServicio || "Sin servicio";
      serviceMap.set(serviceName, (serviceMap.get(serviceName) || 0) + 1);
    });

    const topServicios = Array.from(serviceMap.entries())
      .map(([label, value], idx) => ({
        label,
        value,
        color: COLORS[idx % COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);

    const citasComparativo = [
      {
        label: String(previousYear),
        value: ventasPrevious.length,
        color: "var(--surface1)",
      },
      {
        label: String(currentYear),
        value: ventasCurrent.length,
        color: "var(--primaryB)",
      },
    ];

    const ventasComparativo = [
      {
        label: String(previousYear),
        value: ventasPrevious.length,
        color: "#C7BCA5",
      },
      {
        label: String(currentYear),
        value: ventasCurrentByService.length,
        color: "var(--primaryG)",
      },
    ];

    const estadoCitas = [
      {
        label: "Canceladas",
        value: citasCanceladasCurrent.length,
        color: "#C97C6D",
      },
      {
        label: "No canceladas",
        value: Math.max(citasCurrent.length - citasCanceladasCurrent.length, 0),
        color: "#84B7C7",
      },
    ];

    return {
      currentYear,
      previousYear,
      citasAtendidasCurrent: ventasCurrent.length,
      serviciosVendidosCurrent: ventasCurrentByService.length,
      citasCanceladasCurrent: citasCanceladasCurrent.length,
      citasComparativo,
      ventasComparativo,
      estadoCitas,
      topServicios,
    };
  }, [selectedYear, selectedService, ventas, citas]);

  return (
    <LayoutAdmin>
      <div className={styles.wrapper}>
        <div className={styles.headerWrapper}>
          <button className={styles.btnAtras} onClick={() => window.history.back()}>
            <img className={styles.iconAtras} src={IconAtras} alt="Atrás" />
            Atrás
          </button>
          <h1 className={styles.title}>DASHBOARD ESTADISTICO</h1>
        </div>

        <hr className={styles.hr} />

        <p className={styles.subtitle}>
          Comparativo anual de citas atendidas, servicios vendidos y citas canceladas.
        </p>

        <div className={styles.filters}>
          <label>
            Año
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              disabled={availableYears.length === 0}
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>

          <label>
            Servicio
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
            >
              {serviceOptions.map((serviceName) => (
                <option key={serviceName} value={serviceName}>
                  {serviceName}
                </option>
              ))}
            </select>
          </label>
        </div>

        {loading ? <p className={styles.stateMessage}>Cargando estadísticas...</p> : null}
        {!loading && error ? <p className={styles.errorMessage}>{error}</p> : null}

        {!loading && !error && availableYears.length === 0 ? (
          <p className={styles.stateMessage}>No hay datos disponibles para construir estadísticas.</p>
        ) : null}

        {!loading && !error && availableYears.length > 0 ? (
          <>
            <section className={styles.kpiRow}>
              <article>
                <h4>Citas atendidas ({metrics.currentYear})</h4>
                <strong>{numberFormat(metrics.citasAtendidasCurrent)}</strong>
                <small>Basado en ventas registradas</small>
              </article>
              <article>
                <h4>Servicios vendidos ({metrics.currentYear})</h4>
                <strong>{numberFormat(metrics.serviciosVendidosCurrent)}</strong>
                <small>Filtro de servicio aplicado</small>
              </article>
              <article>
                <h4>Citas canceladas ({metrics.currentYear})</h4>
                <strong>{numberFormat(metrics.citasCanceladasCurrent)}</strong>
                <small>Total por estado "cancelada"</small>
              </article>
            </section>

            <section className={styles.grid}>
              <DonutCard
                title="Comparación anual: Citas atendidas"
                subtitle={`Años ${metrics.previousYear} vs ${metrics.currentYear}`}
                totalLabel="Total"
                totalValue={numberFormat(metrics.citasAtendidasCurrent)}
                items={metrics.citasComparativo}
              />

              <DonutCard
                title="Comparación anual: Servicios vendidos"
                subtitle={`Años ${metrics.previousYear} vs ${metrics.currentYear}`}
                totalLabel="Filtrado"
                totalValue={numberFormat(metrics.serviciosVendidosCurrent)}
                items={metrics.ventasComparativo}
              />

              <DonutCard
                title="Estado de citas"
                subtitle={`Distribución de citas del año ${metrics.currentYear}`}
                totalLabel="Canceladas"
                totalValue={numberFormat(metrics.citasCanceladasCurrent)}
                items={metrics.estadoCitas}
              />

              <DonutCard
                title="Servicios más vendidos"
                subtitle={`Top servicios del año ${metrics.currentYear}`}
                totalLabel="Servicios"
                totalValue={numberFormat(metrics.topServicios.length)}
                items={
                  metrics.topServicios.length > 0
                    ? metrics.topServicios.slice(0, 6)
                    : [{ label: "Sin ventas", value: 0, color: "var(--surface1)" }]
                }
              />
            </section>
          </>
        ) : null}
      </div>
    </LayoutAdmin>
  );
}