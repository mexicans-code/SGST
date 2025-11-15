import React from "react";
import logo from "../../assets/logo.jpg";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

export default function ReporteContenido({
  contenidoReporte,
  resumenReservas = {},
  resumenPagos = {},
  totalIngresoAnual = 0,
  promedioGeneral = "Sin datos",
  hotelData = [],
  touristExperiences = [],
  lineData = [],
}) {
  if (!contenidoReporte) return null;
  const { tipo, opciones = [] } = contenidoReporte;

  const mostrarSeccion = (nombre) => {
    if (tipo === "Personalizado") return opciones.includes(nombre);
    return tipo?.toLowerCase() === nombre;
  };

  const promedioMensual = lineData.length > 0
    ? (lineData.reduce((acc, cur) => acc + cur.ingresos, 0) / lineData.length).toFixed(2)
    : 0;

  const mejorMes = lineData.length > 0
    ? lineData.reduce((max, cur) => (cur.ingresos > max.ingresos ? cur : max))
    : { mes: "-", ingresos: 0 };

  const peorMes = lineData.length > 0
    ? lineData.reduce((min, cur) => (cur.ingresos < min.ingresos ? cur : min))
    : { mes: "-", ingresos: 0 };

  const mejorCabaña = hotelData.length > 0 
    ? hotelData.reduce((max, h) =>
        parseFloat(h.promedio_calificacion || 0) > parseFloat(max.promedio_calificacion || 0) ? h : max,
        hotelData[0]
      )
    : {};

  const peorCabaña = hotelData.length > 0
    ? hotelData.reduce((min, h) =>
        parseFloat(h.promedio_calificacion || 5) < parseFloat(min.promedio_calificacion || 5) ? h : min,
        hotelData[0]
      )
    : {};

  return (
    <div
      id="reporte"
      style={{
        position: "absolute",
        left: "-9999px",
        top: 0,
        backgroundColor: "#ffffff",
        width: "900px",
        padding: "50px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#333",
        lineHeight: "1.6",
      }}
    >
      {/* === PORTADA === */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "4px solid #003366",
          paddingBottom: "15px",
          marginBottom: "30px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <img
            src={logo}
            alt="Logo"
            style={{ width: "250px", height: "90px", objectFit: "contain" }}
          />
          <div>
            <h2 style={{ color: "#003366", margin: 0 }}>Informe de Desempeño</h2>
            <h4 style={{ color: "#0077c2", margin: 0 }}>Anfitrión - Gestión Turística</h4>
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: "13px" }}>
          <p>
            Fecha de generación:{" "}
            <strong>{new Date().toLocaleDateString("es-MX")}</strong>
          </p>
          <p>Sistema: <strong>Plataforma de Gestión Turística</strong></p>
        </div>
      </header>

      {/* === RESUMEN EJECUTIVO === */}
      <Section title="Resumen Ejecutivo">
        <p>
          Este informe presenta un análisis integral del desempeño del anfitrión
          en la plataforma, considerando las reservas, ingresos, calidad del
          servicio y publicaciones. Los datos permiten evaluar el crecimiento,
          la rentabilidad y la satisfacción de los huéspedes durante el periodo
          analizado.
        </p>

        <div
          style={{
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
            marginTop: "15px",
          }}
        >
          <Card title="Total de Reservas" value={resumenReservas.totalReservas || 0} color="#00509e" />
          <Card title="Ingresos Totales" value={formatMoney(totalIngresoAnual)} color="#0066cc" />
          <Card title="Promedio General" value={promedioGeneral || "Sin datos"} color="#0077b6" />
          <Card title="Hospedajes Publicados" value={hotelData.length} color="#0096c7" />
          <Card title="Experiencias Activas" value={touristExperiences.length} color="#00b4d8" />
        </div>
      </Section>

      {/* === FINANCIERO === */}
      {mostrarSeccion("financiero") && (
        <>
          <Section title="Análisis Financiero - Gráfico Mensual">
            <p>
              Los ingresos mensuales muestran las variaciones de rentabilidad del anfitrión a lo largo del año.
              El promedio mensual de ingresos fue de <strong>{formatMoney(promedioMensual)}</strong>.
            </p>

            <div style={{
              height: 300,
              marginBottom: "20px",
              pageBreakInside: "avoid",
              WebkitColumnBreakInside: "avoid",
              breakInside: "avoid",
              marginBottom: "100px"

            }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="ingresos"
                    stroke="#00509e"
                    strokeWidth={2}
                    name="Ingresos Mensuales"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <p style={{ marginTop: "200px" }}>
              🟢 <strong>Mes más rentable:</strong> {mejorMes.mes} ({formatMoney(mejorMes.ingresos)})<br />
              🔴 <strong>Mes más bajo:</strong> {peorMes.mes} ({formatMoney(peorMes.ingresos)})
            </p>
          </Section>

          <Section title="Detalle de Ingresos Mensuales">
            <div style={{
              pageBreakInside: "avoid",
              WebkitColumnBreakInside: "avoid",
              breakInside: "avoid",
              marginTop: "60px"
            }}>
              <StyledTable
                headers={["Mes", "Monto"]}
                data={lineData.map(({ mes, ingresos }) => [mes, formatMoney(ingresos)])}
              />
            </div>
          </Section>
        </>
      )}

      {/* === RESERVAS === */}
      {mostrarSeccion("reservas") && resumenReservas.estados && (
        <Section title="Resumen de Reservas">
          <p>
            El comportamiento de las reservas refleja la demanda de los
            hospedajes y experiencias publicadas. Este apartado permite
            identificar los periodos de mayor actividad y los estados más
            frecuentes de las reservas (confirmadas, pendientes o canceladas).
            Un alto número de reservas confirmadas es indicador del atractivo y
            confiabilidad del servicio ofrecido.
          </p>

          <div style={{
            pageBreakInside: "avoid",
            WebkitColumnBreakInside: "avoid",
            breakInside: "avoid"
          }}>
            <StyledTable
              headers={["Estado", "Cantidad", "Porcentaje"]}
              data={Object.entries(resumenReservas.estados).map(([estado, cantidad]) => [
                estado,
                cantidad,
                resumenReservas.porcentajes?.[estado] || "0%",
              ])}
            />
          </div>
        </Section>
      )}

      {/* === CALIDAD === */}
      {mostrarSeccion("calidad") && (
        <Section title="Calidad y Opiniones de los Huéspedes">
          <p>
            La calidad del servicio se evalúa mediante las reseñas y
            calificaciones otorgadas por los huéspedes. Un promedio alto refleja
            una atención adecuada, instalaciones confortables y cumplimiento de
            expectativas. Este análisis permite identificar las propiedades con
            mejor desempeño y aquellas que requieren mejoras.
          </p>

          <p>
            Promedio general: <strong>{promedioGeneral || "Sin calificaciones"}</strong> | Mejor
            cabaña: <strong>{mejorCabaña?.nombre || "-"}</strong> ({mejorCabaña?.promedio_calificacion || "N/A"}) | Peor cabaña:{" "}
            <strong>{peorCabaña?.nombre || "-"}</strong> ({peorCabaña?.promedio_calificacion || "N/A"})
          </p>

          <div style={{
            pageBreakInside: "avoid",
            WebkitColumnBreakInside: "avoid",
            breakInside: "avoid"
          }}>
            <StyledTable
              headers={["Hospedaje", "Calificación", "Tipo", "Ciudad"]}
              data={hotelData.map((h) => [
                h.nombre,
                h.promedio_calificacion || "Sin reseñas",
                h.tipo_propiedad,
                h.direcciones?.ciudad || "—",
              ])}
            />
          </div>
        </Section>
      )}

      {/* === PUBLICACIONES === */}
      {mostrarSeccion("publicaciones") && (
        <Section title="Hospedajes y Experiencias">
          <p>
            En este apartado se enlistan los hospedajes y experiencias
            turísticas publicadas por el anfitrión. Estos datos son fundamentales
            para analizar la oferta disponible, los precios y la diversidad de
            servicios que se ofrecen en la plataforma.
          </p>

          <h4 style={{ color: "#003366" }}>Hospedajes</h4>
          {hotelData.length > 0 ? (
            <div style={{
              pageBreakInside: "avoid",
              WebkitColumnBreakInside: "avoid",
              breakInside: "avoid"
            }}>
              <StyledTable
                headers={["Nombre", "Precio/Noche", "Capacidad", "Tipo", "Ciudad"]}
                data={hotelData.map((h) => [
                  h.nombre,
                  formatMoney(h.precio_por_noche),
                  h.capacidad,
                  h.tipo_propiedad,
                  h.direcciones?.ciudad || "—",
                ])}
              />
            </div>
          ) : (
            <p>No se registran hospedajes activos.</p>
          )}

          {touristExperiences.length > 0 && (
            <>
              <h4 style={{ color: "#003366", marginTop: "20px" }}>
                Experiencias Turísticas
              </h4>
              <div style={{
                pageBreakInside: "avoid",
                WebkitColumnBreakInside: "avoid",
                breakInside: "avoid"
              }}>
                <StyledTable
                  headers={["Título", "Precio", "Duración", "Tipo", "Ciudad"]}
                  data={touristExperiences.map((exp) => [
                    exp.titulo,
                    formatMoney(exp.precio),
                    exp.duracion,
                    exp.tipo_experiencia,
                    exp.direcciones?.ciudad || "—",
                  ])}
                />
              </div>
            </>
          )}
        </Section>
      )}

      {/* === PIE === */}
      <footer
        style={{
          borderTop: "3px solid #003366",
          marginTop: "50px",
          paddingTop: "15px",
          textAlign: "center",
          fontSize: "12px",
          color: "#666",
        }}
      >
        <p>© {new Date().getFullYear()} Sistema de Gestión de Servicios Turísticos</p>
        <p>Reporte generado automáticamente — Arroyo Seco, Querétaro.</p>
      </footer>
    </div>
  );
}

function formatMoney(num) {
  return num ? `$${parseFloat(num).toLocaleString("es-MX")}` : "$0";
}

/* === COMPONENTES AUXILIARES === */
function Section({ title, children }) {
  return (
    <section style={{
      marginBottom: "40px",
      pageBreakInside: "avoid",
      WebkitColumnBreakInside: "avoid",
      breakInside: "avoid"
    }}>
      <h2
        style={{
          color: "#003366",
          borderLeft: "6px solid #003366",
          paddingLeft: "10px",
          fontSize: "18px",
          marginBottom: "15px",
        }}
      >
        {title}
      </h2>
      <div style={{ marginLeft: "10px", fontSize: "14px" }}>{children}</div>
    </section>
  );
}

function StyledTable({ headers, data }) {
  return (
    <table
      style={{
        borderCollapse: "collapse",
        width: "100%",
        fontSize: "13px",
        borderRadius: "6px",
        overflow: "hidden",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        marginTop: "10px",
      }}
    >
      <thead style={{ backgroundColor: "#003366", color: "white" }}>
        <tr>
          {headers.map((h, i) => (
            <th key={i} style={{ padding: "8px 10px", textAlign: "left" }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} style={{ backgroundColor: i % 2 ? "#f9fbff" : "#fff" }}>
            {row.map((cell, j) => (
              <td key={j} style={{ padding: "6px 10px", borderBottom: "1px solid #ddd" }}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Card({ title, value, color }) {
  return (
    <div
      style={{
        flex: "1 1 200px",
        padding: "15px",
        backgroundColor: color,
        color: "#fff",
        borderRadius: "8px",
        textAlign: "center",
        boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h4 style={{ margin: 0, fontSize: "14px", opacity: 0.9 }}>{title}</h4>
      <p style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>{value}</p>
    </div>
  );
}
