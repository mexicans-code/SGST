import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ReporteReservas from "../../components/ReporteReservas";
import ReporteHoteles from "../../components/ReporteHoteles";
import ReporteUsuario from "../../components/ReporteUsuario";
import ReporteFinanzas from "../../components/ReporteFinanzas";
import { GATEWAY_URL } from '../../const/Const';



export default function Dashboard() {
    const [resumen, setResumen] = useState(null);
    const [hosteleriaData, setHosteleriaData] = useState([]);
    const [anfitrionData, setAnfitrionData] = useState([]);
    const [resenasData, setResenasData] = useState(null);
    const [showInfo, setShowInfo] = useState({});
    const [users, setUsers] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();
    const [tipoReporte, setTipoReporte] = useState(null);
    const [nombreReporte, setNombreReporte] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [contenidoReporte, setContenidoReporte] = useState(null);
    const [opcionesSeleccionadas, setOpcionesSeleccionadas] = useState({
        publicaciones: false,
        reservas: false,
        financiero: false,
        calidad: false,
        graficas: false,
    });

    const generarPDFCompleto = async () => {
        try {
            alert("⏳ Generando PDF, por favor espera...");

            const ids = ["reporte-reservas", "reporte-hoteles", "reporte-usuarios"];
            const pdf = new jsPDF("p", "mm", "a4");
            let isFirstPage = true;

            for (let i = 0; i < ids.length; i++) {
                const elemento = document.getElementById(ids[i]);
                if (!elemento) {
                    console.warn(`No se encontró elemento con id ${ids[i]}`);
                    continue;
                }

                // Hacer visible temporalmente
                elemento.style.position = "static";
                elemento.style.left = "0";
                elemento.style.width = "900px";

                const canvas = await html2canvas(elemento, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: "#ffffff",
                    scrollY: -window.scrollY,
                    windowWidth: elemento.scrollWidth,
                });

                const imgData = canvas.toDataURL("image/jpeg", 0.98);

                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = pageWidth;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                let heightLeft = imgHeight;
                let position = 0;

                // Si no es la primera página, agregar nueva
                if (!isFirstPage) {
                    pdf.addPage();
                }
                isFirstPage = false;

                pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft > 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                // Restaurar estilos
                elemento.style.position = "absolute";
                elemento.style.left = "-9999px";
            }

            pdf.save("Reporte_Completo.pdf");
            alert("✅ PDF generado exitosamente");
        } catch (error) {
            console.error("Error al generar reporte completo:", error);
            alert("❌ Error al generar el PDF");
        }
    };




    useEffect(() => {
        const fetchResumen = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${GATEWAY_URL}/api/dashboard/resumen`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) setResumen(data);
            } catch (error) {
                console.error('Error fetch resumen:', error);
            }
        };
        fetchResumen();
    }, []);

    useEffect(() => {
        const fetchHosteleria = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${GATEWAY_URL}/api/dashboard/ingresos-hosteleria`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) setHosteleriaData(data.data);
            } catch (error) {
                console.error('Error fetch hostelería:', error);
            }
        };
        fetchHosteleria();
    }, []);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch(`${GATEWAY_URL}/api/booking/getBookings`);
                const data = await response.json();

                console.log('Response from fetchBookings:', response);
                console.log('Data from fetchBookings:', data);

                if (data.success) {
                    setBookings(data.data);
                } else {
                    console.error('Error: La respuesta no fue exitosa', data);
                }
            } catch (error) {
                console.error('Error fetch reservas:', error);
            }
        };
        fetchBookings();
    }, []);

    useEffect(() => {
        const fetchAnfitrion = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${GATEWAY_URL}/api/dashboard/ingresos-anfitrion`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    const formateados = data.data.map(item => ({
                        nombre: item.nombre_anfitrion || `Anfitrión ${item.id_anfitrion}`,
                        total_reservas: item.total_reservas,
                        ingresos_totales: item.ingresos_totales,
                        cabañas: item.hostelerias || []
                    }));
                    setAnfitrionData(formateados);
                }
            } catch (error) {
                console.error('Error fetch anfitriones:', error);
            }
        };
        fetchAnfitrion();
    }, []);

    useEffect(() => {
        const fetchResenas = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${GATEWAY_URL}/api/dashboard/resenas`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) setResenasData(data);
            } catch (error) {
                console.error('Error fetch reseñas:', error);
            }
        };
        fetchResenas();
    }, []);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await fetch(`${GATEWAY_URL}/api/hospitality/getHotelData`);
                const data = await response.json();
                if (data.success) {
                    setHotels(data.data);
                }
            } catch (error) {
                console.error('Error fetch hoteles:', error);
            }
        };
        fetchHotels();
    }, []);

    useEffect(() => {
        const cargarUsuarios = async () => {
            try {
                const response = await fetch(`${GATEWAY_URL}/api/adminUser/getUsers`);
                const data = await response.json();
                if (data.success) {
                    setUsers(data.data);
                }
            } catch (error) {
                console.error('Error al cargar usuarios:', error);
            }
        };
        cargarUsuarios();
    }, []);

    const reservasData = resumen ? Object.keys(resumen.ingresosPorMes).map(key => {
        const [year, mesNum] = key.split('-');
        const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        return {
            mes: meses[parseInt(mesNum) - 1],
            reservas: resumen.reservasPorMes[key] || 0,
            ingresos: resumen.ingresosPorMes[key] || 0
        };
    }) : [];

    const estadosData = resumen ? [
        { name: 'Confirmadas', value: resumen.resumenReservas.estados.confirmada, color: '#28a745', porcentaje: resumen.resumenReservas.porcentajes.confirmada },
        { name: 'Canceladas', value: resumen.resumenReservas.estados.cancelada, color: '#dc3545', porcentaje: resumen.resumenReservas.porcentajes.cancelada },
        { name: 'Pendientes', value: resumen.resumenReservas.estados.pendiente, color: '#ffc107', porcentaje: resumen.resumenReservas.porcentajes.pendiente }
    ] : [];

    const toggleInfo = (chart) => {
        setShowInfo(prev => ({ ...prev, [chart]: !prev[chart] }));
    };

    const toggleOpcion = (opcion) => {
        setOpcionesSeleccionadas(prev => ({ ...prev, [opcion]: !prev[opcion] }));
    };

    const getNombreEstablecimiento = (booking) => {
        if (booking.establecimiento) {
            return booking.establecimiento.nombre || 'Nombre no disponible';
        }
        return 'No aplica';
    };

    const getUbicacion = (establecimiento) => {
        if (establecimiento && establecimiento.direccion) {
            const direccion = establecimiento.direccion;
            return `${direccion.calle}, ${direccion.numero_exterior}, ${direccion.colonia}, ${direccion.ciudad}, ${direccion.estado}, ${direccion.codigo_postal}, ${direccion.pais}`;
        }
        return 'Dirección no disponible';
    };

    const handleGenerarPersonalizado = () => {
        if (!nombreReporte.trim()) return;

        if (tipoReporte === "Reservas") {
            // Generar solo reporte de reservas
            alert("⏳ Generando PDF de Reservas...");
            setTimeout(async () => {
                const elemento = document.getElementById("reporte-reservas");
                if (elemento) {
                    elemento.style.position = "static";
                    elemento.style.left = "0";
                    const canvas = await html2canvas(elemento, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
                    const pdf = new jsPDF("p", "mm", "a4");
                    const imgData = canvas.toDataURL("image/jpeg", 0.98);
                    const pageWidth = pdf.internal.pageSize.getWidth();
                    const imgHeight = (canvas.height * pageWidth) / canvas.width;
                    pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, imgHeight);
                    pdf.save(`${nombreReporte}.pdf`);
                    elemento.style.position = "absolute";
                    elemento.style.left = "-9999px";
                }
            }, 500);
        } else if (tipoReporte === "Financiero") {
            // Generar solo reporte financiero
            alert("⏳ Generando PDF Financiero...");
            setTimeout(async () => {
                const elemento = document.getElementById("reporte-finanzas");
                if (elemento) {
                    elemento.style.position = "static";
                    elemento.style.left = "0";
                    const canvas = await html2canvas(elemento, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
                    const pdf = new jsPDF("p", "mm", "a4");
                    const imgData = canvas.toDataURL("image/jpeg", 0.98);
                    const pageWidth = pdf.internal.pageSize.getWidth();
                    const imgHeight = (canvas.height * pageWidth) / canvas.width;
                    pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, imgHeight);
                    pdf.save(`${nombreReporte}.pdf`);
                    elemento.style.position = "absolute";
                    elemento.style.left = "-9999px";
                }
            }, 500);
        } else if (tipoReporte === "Mis Publicaciones") {
            // Generar solo reporte de hoteles
            alert("⏳ Generando PDF de Hoteles...");
            setTimeout(async () => {
                const elemento = document.getElementById("reporte-hoteles");
                if (elemento) {
                    elemento.style.position = "static";
                    elemento.style.left = "0";
                    const canvas = await html2canvas(elemento, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
                    const pdf = new jsPDF("p", "mm", "a4");
                    const imgData = canvas.toDataURL("image/jpeg", 0.98);
                    const pageWidth = pdf.internal.pageSize.getWidth();
                    const imgHeight = (canvas.height * pageWidth) / canvas.width;
                    pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, imgHeight);
                    pdf.save(`${nombreReporte}.pdf`);
                    elemento.style.position = "absolute";
                    elemento.style.left = "-9999px";
                }
            }, 500);
        } else if (tipoReporte === "Personalizado") {
            // Generar reporte completo o personalizado
            generarPDFCompleto();
        } else {
            alert("Tipo de reporte no reconocido");
        }

        setShowModal(false);
        setNombreReporte("");
    };


    return (
        <>
            <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css" rel="stylesheet" />

            <style>{`
                .main-container { background: rgba(255,255,255,0.95); backdrop-filter: blur(20px); border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); border: 1px solid rgba(255,255,255,0.2); }
                .stats-card { background: linear-gradient(135deg,#fff,#f8f9fa); border: none; border-radius: 16px; transition: .3s; box-shadow: 0 4px 15px rgba(0,0,0,0.08); }
                .stats-card:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }
                .chart-container { background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 2rem; }
                .quick-actions { background: linear-gradient(135deg,#667eea,#764ba2); border-radius: 16px; padding: 2rem; color: white; margin-bottom: 2rem; }
                .btn-light:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(102,126,234,0.4); background: linear-gradient(135deg,#5a6fd8,#6a4190); color: white; }
                .pdftarget { position: absolute !important; left: -9999px !important; width: 900px !important; top: 0; height: auto; overflow: visible; background: white; }
            `}</style>

            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4">
                            <div className="modal-header bg-primary text-white rounded-top-4">
                                <h5 className="modal-title fw-bold">
                                    {tipoReporte === "Personalizado" ? "Crear Reporte Personalizado" : `Crear Reporte de ${tipoReporte}`}
                                </h5>
                                <button className="btn-close btn-close-white" onClick={() => { setShowModal(false); setTipoReporte(null); setNombreReporte(""); }}></button>
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
                                <button className="btn btn-secondary" onClick={() => { setShowModal(false); setTipoReporte(null); setNombreReporte(""); }}>Cancelar</button>
                                <button className="btn btn-primary" disabled={!nombreReporte.trim()} onClick={handleGenerarPersonalizado}>Generar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="container-fluid p-4">
                <div className="main-container p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h1 className="h2 fw-bold text-dark mb-1">
                                <i className="bi bi-graph-up text-primary me-2"></i>
                                Reportes y Gráficas
                            </h1>
                            <p className="text-muted mb-0">Analiza el rendimiento y genera reportes</p>
                        </div>
                    </div>

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

                    <ReporteReservas bookings={bookings} />
                    <ReporteFinanzas bookings={bookings} />
                    <ReporteHoteles hotels={hotels} bookings={bookings} />
                    <ReporteUsuario users={users} />
                </div>
            </div>

            <div className="row g-4 mb-4">
                {[...resenasData?.por_hosteleria || []]
                    .sort((a, b) => b.promedio_calificacion - a.promedio_calificacion)
                    .slice(0, 5)
                    .map((h) => {
                        const gradient = h.promedio_calificacion >= 4.5
                            ? 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)'
                            : h.promedio_calificacion >= 4
                                ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
                                : 'linear-gradient(135deg, #6c757d 0%, #adb5bd 100%)';

                        return (
                            <div key={h.id_hosteleria} className="col-lg-2 col-md-4 col-sm-6">
                                <div className="stats-card card text-center h-100 hover-card">
                                    <div className="card-body d-flex flex-column align-items-center justify-content-center">
                                        <div className="avatar mb-3" style={{ background: gradient, width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '1.5rem', color: 'white' }}>
                                            <i className="bi bi-building"></i>
                                        </div>
                                        <h6 className="fw-bold text-truncate mb-1">{h.nombre}</h6>
                                        <p className="text-muted mb-2" style={{ fontSize: '0.85rem' }}>
                                            {h.total_resenas} reseñas
                                        </p>
                                        <span className={`badge ${h.promedio_calificacion >= 4 ? 'bg-success' : 'bg-warning'}`} style={{ fontSize: '0.85rem' }}>
                                            {h.promedio_calificacion} ⭐
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                {[...resenasData?.por_anfitrion || []]
                    .slice(0, 5)
                    .map((a) => {
                        const gradient = a.promedio_calificacion >= 4.5
                            ? 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)'
                            : a.promedio_calificacion >= 4
                                ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
                                : 'linear-gradient(135deg, #6c757d 0%, #adb5bd 100%)';

                        return (
                            <div key={a.id_anfitrion} className="col-lg-2 col-md-4 col-sm-6">
                                <div className="stats-card card text-center h-100 hover-card">
                                    <div className="card-body d-flex flex-column align-items-center justify-content-center">
                                        <div className="avatar mb-3" style={{ background: gradient, width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '1.5rem', color: 'white' }}>
                                            <i className="bi bi-person-circle"></i>
                                        </div>
                                        <h6 className="fw-bold text-truncate mb-1">Anfitrión {a.id_anfitrion}</h6>
                                        <p className="text-muted mb-2" style={{ fontSize: '0.85rem' }}>
                                            {a.total_resenas} reseñas
                                        </p>
                                        <span className={`badge ${a.promedio_calificacion >= 4 ? 'bg-success' : 'bg-warning'}`} style={{ fontSize: '0.85rem' }}>
                                            {a.promedio_calificacion} ⭐
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
            </div>

            <div className="row mb-4">
                <div className="col-lg-8">
                    <div className="chart-container">
                        <h5 className="mb-4">
                            <i className="bi bi-graph-up me-2"></i>
                            Reservas e Ingresos por Mes
                        </h5>

                        <i
                            className="bi bi-exclamation-circle text-primary position-absolute top-0 end-0 m-3"
                            style={{ cursor: 'pointer', fontSize: '1.2rem' }}
                            onClick={() => toggleInfo('meses')}
                        ></i>

                        {showInfo['meses'] && (
                            <div className="chart-tooltip">
                                <p>
                                    Este gráfico muestra la evolución mensual de reservas e ingresos.
                                    Las barras indican la cantidad de reservas y la línea representa los ingresos ($).
                                    Permite identificar tendencias y temporadas altas o bajas.
                                </p>
                            </div>
                        )}

                        {!resumen ? (
                            <p>Cargando datos...</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={reservasData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="mes" />
                                    <YAxis yAxisId="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <Tooltip />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="reservas" fill="#667eea" name="Reservas" />
                                    <Line yAxisId="right" type="monotone" dataKey="ingresos" stroke="#28a745" strokeWidth={3} name="Ingresos ($)" />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="chart-container">
                        <h5 className="mb-4">
                            <i className="bi bi-pie-chart me-2"></i>
                            Estados de Reservas
                        </h5>

                        <i
                            className="bi bi-exclamation-circle text-primary position-absolute top-0 end-0 m-3"
                            style={{ cursor: 'pointer', fontSize: '1.2rem' }}
                            onClick={() => toggleInfo('estados')}
                        ></i>

                        {showInfo['estados'] && (
                            <div className="chart-tooltip">
                                <p>
                                    Este gráfico de pastel muestra la distribución de reservas por estado: confirmadas, canceladas y pendientes.
                                    Ayuda a visualizar rápidamente el porcentaje de cada tipo y el total de reservas gestionadas.
                                </p>
                            </div>
                        )}

                        {!resumen ? (
                            <p>Cargando datos de estados...</p>
                        ) : (
                            <>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={estadosData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, porcentaje }) => `${name}: ${porcentaje}`}
                                            outerRadius={80}
                                            dataKey="value"
                                        >
                                            {estadosData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value, name) => [`${value}`, `${name}`]} />
                                    </PieChart>
                                </ResponsiveContainer>

                                <div className="mt-3">
                                    <p><strong>Total de reservas:</strong> {resumen.resumenReservas.totalReservas}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="chart-container mb-4">
                <h5 className="mb-4">
                    <i className="bi bi-building me-2"></i>
                    Rendimiento por Establecimiento
                </h5>

                <i
                    className="bi bi-exclamation-circle text-primary position-absolute top-0 end-0 m-3"
                    style={{ cursor: 'pointer', fontSize: '1.2rem' }}
                    onClick={() => toggleInfo('hosteleria')}
                ></i>

                {showInfo['hosteleria'] && (
                    <div className="chart-tooltip">
                        <p>
                            Este gráfico muestra el rendimiento de cada establecimiento en cuanto a reservas e ingresos.
                            Permite comparar los establecimientos más y menos rentables de manera rápida.
                        </p>
                    </div>
                )}

                {!hosteleriaData.length ? (
                    <p>Cargando rendimiento por establecimiento...</p>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={hosteleriaData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="nombre" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="total_reservas" fill="#667eea" name="Reservas" />
                            <Bar yAxisId="right" dataKey="ingresos_totales" fill="#28a745" name="Ingresos ($)" />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            <div className="chart-container mb-4">
                <h5 className="mb-4">
                    <i className="bi bi-person-lines-fill me-2"></i>
                    Rendimiento por Anfitrión
                </h5>

                <i
                    className="bi bi-exclamation-circle text-primary position-absolute top-0 end-0 m-3"
                    style={{ cursor: 'pointer', fontSize: '1.2rem' }}
                    onClick={() => toggleInfo('anfitrion')}
                ></i>

                {showInfo['anfitrion'] && (
                    <div className="chart-tooltip">
                        <p>
                            Este gráfico compara los ingresos y reservas de cada anfitrión.
                            Además, muestra las cabañas gestionadas por cada uno, permitiendo identificar los anfitriones con mejor desempeño.
                        </p>
                    </div>
                )}

                {!anfitrionData.length ? (
                    <p>Cargando rendimiento por anfitrión...</p>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={anfitrionData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="nombre" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip formatter={(value, name) => {
                                if (name === 'total_reservas') return [`${value}`, 'Reservas'];
                                if (name === 'ingresos_totales') return [`$${value}`, 'Ingresos ($)'];
                                return [value, name];
                            }} />
                            <Legend />
                            <Bar yAxisId="left" dataKey="total_reservas" fill="#6f42c1" name="Reservas" />
                            <Bar yAxisId="right" dataKey="ingresos_totales" fill="#20c997" name="Ingresos ($)" />
                        </BarChart>
                    </ResponsiveContainer>
                )}

                {anfitrionData.length > 0 && (
                    <div className="mt-3">
                        {anfitrionData.map((anfitrion, idx) => (
                            <div key={idx} className="mb-2">
                                <strong>{anfitrion.nombre}</strong>: {anfitrion.cabañas.join(', ') || 'Sin cabañas asignadas'}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
