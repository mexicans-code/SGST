import { useState, useEffect } from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar
} from "recharts";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ReporteContenido from "./ReporteContenido";

import { GATEWAY_URL } from "../../const/Const";

export default function HostReport() {
    const [resumen, setResumen] = useState(null);
    const [loading, setLoading] = useState(true);
    const [idAnfitrion, setIdAnfitrion] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [nombreReporte, setNombreReporte] = useState("");
    const [opcionesSeleccionadas, setOpcionesSeleccionadas] = useState({
        publicaciones: false, reservas: false, financiero: false, calidad: false, graficas: false,
    });
    const [contenidoReporte, setContenidoReporte] = useState(null);
    const [hotelData, setHotelData] = useState([]);
    const [touristExperiences, setTouristExperiences] = useState([]);
    const [tipoReporte, setTipoReporte] = useState(null);
    const navigate = useNavigate();

    
const generarPDF = async (nombreArchivo = "reporte") => {
    try {
        alert("⏳ Generando PDF, por favor espera...");
        
        const elemento = document.getElementById("reporte");
        if (!elemento) {
            alert("❌ No se encontró el contenido del reporte.");
            return;
        }

        elemento.style.position = "static";
        elemento.style.left = "0";
        elemento.style.width = "210mm";  // ← Ancho A4 exacto

        const canvas = await html2canvas(elemento, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            scrollY: -window.scrollY,
            windowWidth: elemento.scrollWidth,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pageWidth = 210;  // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        // Primera página
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Páginas adicionales
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(`${nombreArchivo}.pdf`);

        elemento.style.position = "absolute";
        elemento.style.left = "-9999px";
        
        alert("✅ PDF generado exitosamente");
    } catch (error) {
        console.error("❌ Error al generar el PDF:", error);
        alert("❌ Error al generar el PDF");
    }
};



    function parseJwt(token) {
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            );
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error("❌ Error al decodificar el token:", e);
            return null;
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.warn("⚠️ No hay token en el localStorage.");
            setLoading(false);
            return;
        }

        const decoded = parseJwt(token);
        if (decoded?.id_usuario) {
            setIdAnfitrion(decoded.id_usuario);
            console.log("✅ ID del anfitrión obtenido:", decoded.id_usuario);
        } else {
            console.warn("⚠️ El token no contiene id_usuario.");
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!idAnfitrion) return;
        (async () => {
            try {
                const res = await fetch(`${GATEWAY_URL}/api/dashboardAnfitrion/${idAnfitrion}`);
                const data = await res.json();
                if (data.success) setResumen(data);

                const hotelRes = await fetch(`${GATEWAY_URL}/api/dashboard/hotelData/${idAnfitrion}`);
                const hotelJson = await hotelRes.json();
                if (hotelJson.success) setHotelData(hotelJson.data);

                const expRes = await fetch(`${GATEWAY_URL}/api/dashboard/touristExperiences/${idAnfitrion}`);
                const expJson = await expRes.json();
                if (expJson.success) setTouristExperiences(expJson.data);
            } catch (e) {
                console.error("Error al obtener datos del anfitrión:", e);
            } finally {
                setLoading(false);
            }
        })();
    }, [idAnfitrion]);

    if (loading) return <p className="text-center mt-5">Cargando...</p>;
    if (!resumen) return <p className="text-center text-danger mt-5">No hay datos disponibles</p>;

    const {
        resumenPagos = { totalPagos: 0, pagosPorEstado: {}, porcentajesPorEstado: {} },
        resumenReservas = { totalReservas: 0, estados: {}, porcentajes: {} },
        ingresosPorMes = {}, reservasPorMes = {}, ingresosPorAno = {}, reservasPorAno = {},
        hostelerias = [], promedioGeneral = "0.00",
    } = resumen;

    const lineData = Object.keys(ingresosPorMes).map((key) => {
        const [year, mesNum] = key.split("-");
        const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        return {
            mes: meses[parseInt(mesNum) - 1],
            ingresos: ingresosPorMes[key] || 0,
            reservas: reservasPorMes[key] || 0,
        };
    });

    const yearData = Object.keys(ingresosPorAno).map((year) => ({
        año: year, ingresos: ingresosPorAno[year], reservas: reservasPorAno[year] || 0,
    }));

    const pagosPie = Object.keys(resumenPagos.pagosPorEstado || {}).map((estado) => ({
        name: estado.charAt(0).toUpperCase() + estado.slice(1),
        value: resumenPagos.pagosPorEstado[estado],
        porcentaje: resumenPagos.porcentajesPorEstado[estado],
        color:
            estado === "completado"
                ? "#28a745"
                : estado === "pendiente"
                    ? "#ffc107"
                    : "#dc3545",
    }));

    const reservasPie = Object.keys(resumenReservas.estados || {}).map((estado) => ({
        name: estado.charAt(0).toUpperCase() + estado.slice(1),
        value: resumenReservas.estados[estado],
        porcentaje: resumenReservas.porcentajes[estado],
        color:
            estado === "confirmada"
                ? "#28a745"
                : estado === "pendiente"
                    ? "#ffc107"
                    : "#dc3545",
    }));

    const totalIngresoAnual = Object.values(ingresosPorAno).reduce((a, b) => a + b, 0);

    const toggleOpcion = (opcion) => {
        setOpcionesSeleccionadas({
            ...opcionesSeleccionadas,
            [opcion]: !opcionesSeleccionadas[opcion],
        });
    };

    const handleGenerarPersonalizado = () => {
        if (!nombreReporte.trim()) return;

        if (tipoReporte === "Personalizado") {
            const seleccionadas = Object.entries(opcionesSeleccionadas)
                .filter(([_, value]) => value)
                .map(([key]) => key);

            if (seleccionadas.length === 0) return;

            setContenidoReporte({
                tipo: tipoReporte,
                opciones: seleccionadas,
                hoteles: hotelData,
                experiencias: touristExperiences,
            });
        } else {
            setContenidoReporte({
                tipo: tipoReporte,
                opciones: [],
                hoteles: hotelData,
                experiencias: touristExperiences,
            });
        }

        setShowModal(false);
        alert("⏳ Generando PDF, por favor espera unos segundos...");

        // Espera para renderizar correctamente antes de capturar
        setTimeout(() => generarPDF(nombreReporte), 900);
    };


    return (
        <>
            {/* 🔗 Bootstrap & Icons */}
            <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css" rel="stylesheet" />

            {/* Estilos */}
            <style>{`
                .main-container { background: rgba(255,255,255,0.95); backdrop-filter: blur(20px); border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.2); }
                .stats-card { background: linear-gradient(135deg,#fff,#f8f9fa); border: none; border-radius: 16px; transition: .3s; box-shadow: 0 4px 15px rgba(0,0,0,0.08); }
                .stats-card:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }
                .chart-container { background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 2rem; }
                .quick-actions { background: linear-gradient(135deg,#667eea,#764ba2); border-radius: 16px; padding: 2rem; color: white; margin-bottom: 2rem; }
                .btn-light:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(102,126,234,0.4); background: linear-gradient(135deg,#5a6fd8,#6a4190); color: white; }
            `}</style>

            {/* MODAL */}
            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4">
                            <div className="modal-header bg-primary text-white rounded-top-4">
                                <h5 className="modal-title fw-bold">
                                    {tipoReporte === "Personalizado" ? "Crear Reporte Personalizado" : `Crear Reporte de ${tipoReporte}`}
                                </h5>
                                <button className="btn-close btn-close-white" onClick={() => { setShowModal(false); setTipoReporte(null); }}></button>
                            </div>

                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Nombre del reporte</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={nombreReporte}
                                        onChange={(e) => setNombreReporte(e.target.value)}
                                        placeholder="Ej. Reporte de noviembre"
                                        required
                                    />
                                </div>

                                {tipoReporte === "Personalizado" && (
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Selecciona qué incluir:</label>
                                        {Object.keys(opcionesSeleccionadas).map((op) => (
                                            <div key={op} className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={opcionesSeleccionadas[op]}
                                                    onChange={() => toggleOpcion(op)}
                                                    id={op}
                                                />
                                                <label className="form-check-label text-capitalize" htmlFor={op}>{op}</label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => { setShowModal(false); setTipoReporte(null); }}>Cancelar</button>
                                <button className="btn btn-primary" disabled={!nombreReporte.trim()} onClick={handleGenerarPersonalizado}>Generar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 🏠 CONTENIDO PRINCIPAL */}
            <div className="container-fluid p-4" style={{ marginTop: "90px" }}>
                <div className="main-container p-4">
                    {/* HEADER */}
                    <div className="d-flex align-items-center mb-5">
                        <button className="btn btn-outline-secondary shadow-sm me-3" onClick={() => navigate(-1)}
                            style={{ width: 45, height: 45, borderRadius: "50%" }} title="Volver">
                            <i className="bi bi-arrow-left fs-5"></i>
                        </button>
                        <div>
                            <h1 className="h2 fw-bold text-dark mb-1"><i className="bi bi-house-heart text-primary me-2"></i>Panel del Anfitrión</h1>
                            <p className="text-muted mb-0">Visualiza tus ingresos, reservas y desempeño general.</p>
                        </div>
                    </div>

                    {/* ⚡ QUICK ACTIONS */}
                    <div className="quick-actions mb-4">
                        <h4 className="mb-3"><i className="bi bi-lightning-charge me-2"></i>Generar Reportes Rápidos</h4>
                        <div className="row text-center">
                            {[
                                { tipo: "Reservas", icon: "bi-calendar-check" },
                                { tipo: "Financiero", icon: "bi-currency-dollar" },
                                { tipo: "Mis Publicaciones", icon: "bi-building" },
                                { tipo: "Calidad", icon: "bi-star" },
                                { tipo: "Personalizado", icon: "bi-sliders" },
                            ].map(({ tipo, icon }) => (
                                <div className="col-md-2 mb-2" key={tipo}>
                                    <button
                                        className="btn btn-light w-100 fw-semibold d-flex align-items-center justify-content-center gap-2"
                                        onClick={() => { setTipoReporte(tipo); setShowModal(true); }}
                                    >
                                        <i className={`bi ${icon}`}></i>{tipo}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 🔸 TARJETAS PRINCIPALES */}
                    <div className="row g-4 mb-4 text-center">
                        {[
                            { icon: "bi-calendar-check text-primary", value: resumenReservas.totalReservas, label: "Reservas Totales" },
                            { icon: "bi-graph-up-arrow text-success", value: `$${totalIngresoAnual.toLocaleString()}`, label: "Ingresos Anuales" },
                            { icon: "bi-wallet2 text-info", value: resumenPagos.totalPagos, label: "Pagos Registrados" },
                            { icon: "bi-star-fill text-warning", value: promedioGeneral || "0.00", label: "Promedio General" },
                        ].map(({ icon, value, label }, i) => (
                            <div className="col-md-3" key={i}>
                                <div className="stats-card card p-3">
                                    <i className={`bi fs-2 ${icon}`}></i>
                                    <h5 className="mt-2">{value}</h5>
                                    <p className="text-muted mb-0">{label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 📊 GRÁFICAS */}
                    {[
                        {
                            id: "line", title: "Reservas e Ingresos por Mes", icon: "bi-bar-chart-line", chart:
                                <LineChart data={lineData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="mes" /><YAxis /><Tooltip /><Legend />
                                    <Bar dataKey="reservas" fill="#667eea" name="Reservas" />
                                    <Line type="monotone" dataKey="ingresos" stroke="#28a745" strokeWidth={3} name="Ingresos ($)" />
                                </LineChart>

                        },
                        {
                            id: "bar", title: "Ingresos y Reservas por Año", icon: "bi-graph-up", chart:
                                <BarChart data={yearData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="año" /><YAxis /><Tooltip /><Legend />
                                    <Bar dataKey="ingresos" fill="#198754" name="Ingresos ($)" />
                                    <Bar dataKey="reservas" fill="#0d6efd" name="Reservas" />
                                </BarChart>
                        },
                    ].map(({ id, title, icon, chart }) => (
                        <div key={id} className="chart-container mb-4">
                            <h5 className="mb-4"><i className={`bi ${icon} me-2`}></i>{title}</h5>
                            <ResponsiveContainer width="100%" height={300}>{chart}</ResponsiveContainer>
                        </div>
                    ))}

                    {/* 🥧 PIE CHARTS */}
                    <div className="row mb-4">
                        {[
                            { title: "Pagos por Estado", icon: "bi-wallet2", data: pagosPie },
                            { title: "Reservas por Estado", icon: "bi-pie-chart", data: reservasPie },
                        ].map(({ title, icon, data }, i) => (
                            <div className="col-md-6" key={i}>
                                <div className="chart-container">
                                    <h5 className="mb-4"><i className={`bi ${icon} me-2`}></i>{title}</h5>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={data}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                dataKey="value"
                                                label={({ name, porcentaje }) => `${name} (${porcentaje})`}
                                            >
                                                {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 🏨 HOSTELERÍAS */}
                    <div className="chart-container mb-4">
                        <h5 className="mb-4"><i className="bi bi-building me-2"></i>Tus Hostelerías y Calificación Promedio</h5>
                        {!hostelerias?.length ? (
                            <p className="text-center text-muted">No tienes hostelerías registradas.</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={hostelerias.map((h) => ({
                                    nombre: h.nombre,
                                    calificacion: parseFloat(h.promedio_calificacion || 0).toFixed(2),
                                }))}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="nombre" /><YAxis /><Tooltip />
                                    <Bar dataKey="calificacion" fill="#ffc107" name="Calificación Promedio" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>

            {/* 🧩 CONTENIDO PARA EL PDF */}
            <ReporteContenido
                contenidoReporte={contenidoReporte}
                resumenReservas={resumenReservas}
                resumenPagos={resumenPagos}
                totalIngresoAnual={totalIngresoAnual}
                promedioGeneral={promedioGeneral}
                hotelData={hotelData}
                touristExperiences={touristExperiences}
                resumen={resumen}
                lineData={lineData}
            />
        </>
    );
}
