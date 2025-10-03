import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
    // Datos de ejemplo para gráficas
    const reservasData = [
        { mes: 'Ene', reservas: 45, ingresos: 15000 },
        { mes: 'Feb', reservas: 52, ingresos: 18500 },
        { mes: 'Mar', reservas: 48, ingresos: 16800 },
        { mes: 'Abr', reservas: 61, ingresos: 22100 },
        { mes: 'May', reservas: 55, ingresos: 19250 },
        { mes: 'Jun', reservas: 67, ingresos: 24500 }
    ];

    const estadosData = [
        { name: 'Confirmadas', value: 65, color: '#28a745' },
        { name: 'Pendientes', value: 25, color: '#ffc107' },
        { name: 'Canceladas', value: 10, color: '#dc3545' }
    ];

    const hospederiaData = [
        { nombre: 'Hotel Colonial Centro', reservas: 25, ingresos: 8500 },
        { nombre: 'Hostal Juventud', reservas: 35, ingresos: 4200 },
        { nombre: 'Casa Rural La Montaña', reservas: 20, ingresos: 6800 },
        { nombre: 'Boutique Hotel Plaza', reservas: 15, ingresos: 9500 }
    ];

    const [reports, setReports] = useState([
        {
            id_reporte: 1,
            nombre: "Reporte Mensual de Reservas",
            tipo: "Reservas",
            fecha_generacion: "2024-12-01",
            periodo: "Noviembre 2024",
            estado: "Completado",
            archivo: "reservas_nov_2024.pdf"
        },
        {
            id_reporte: 2,
            nombre: "Análisis de Ingresos Q4",
            tipo: "Financiero",
            fecha_generacion: "2024-12-05",
            periodo: "Oct-Dic 2024",
            estado: "Completado",
            archivo: "ingresos_q4_2024.xlsx"
        },
        {
            id_reporte: 3,
            nombre: "Reporte de Ocupación",
            tipo: "Ocupación",
            fecha_generacion: "2024-12-10",
            periodo: "Diciembre 2024",
            estado: "Procesando",
            archivo: "ocupacion_dic_2024.pdf"
        },
        {
            id_reporte: 4,
            nombre: "Satisfacción del Cliente",
            tipo: "Calidad",
            fecha_generacion: "2024-12-15",
            periodo: "Noviembre 2024",
            estado: "Pendiente",
            archivo: "satisfaccion_nov_2024.pdf"
        }
    ]);

    const [showModal, setShowModal] = useState(false);
    const [editingReport, setEditingReport] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        tipo: 'Reservas',
        periodo: '',
        estado: 'Pendiente',
        archivo: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const openModal = (report = null) => {
        if (report) {
            setEditingReport(report);
            setFormData({
                nombre: report.nombre,
                tipo: report.tipo,
                periodo: report.periodo,
                estado: report.estado,
                archivo: report.archivo
            });
        } else {
            setEditingReport(null);
            setFormData({
                nombre: '',
                tipo: 'Reservas',
                periodo: '',
                estado: 'Pendiente',
                archivo: ''
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingReport(null);
    };

    const handleSubmit = () => {
        if (editingReport) {
            setReports(reports.map(report =>
                report.id_reporte === editingReport.id_reporte
                    ? { ...report, ...formData, fecha_generacion: new Date().toISOString().split('T')[0] }
                    : report
            ));
        } else {
            const newReport = {
                id_reporte: Math.max(...reports.map(r => r.id_reporte)) + 1,
                ...formData,
                fecha_generacion: new Date().toISOString().split('T')[0]
            };
            setReports([...reports, newReport]);
        }
        closeModal();
    };

    const handleDelete = (id) => {
        if (confirm('¿Eliminar reporte?')) {
            setReports(reports.filter(report => report.id_reporte !== id));
        }
    };

    const generateReport = (tipo) => {
        const newReport = {
            id_reporte: Math.max(...reports.map(r => r.id_reporte)) + 1,
            nombre: `Reporte de ${tipo} - ${new Date().toLocaleDateString()}`,
            tipo: tipo,
            fecha_generacion: new Date().toISOString().split('T')[0],
            periodo: new Date().toLocaleDateString(),
            estado: "Procesando",
            archivo: `${tipo.toLowerCase()}_${Date.now()}.pdf`
        };
        setReports([...reports, newReport]);
    };

    return (
        <>
            <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet" />
            <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css" rel="stylesheet" />

            <style>{`
                body { 
                    min-height: 100vh;
                    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                }
                .main-container {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    border-radius: 20px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                .stats-card {
                    background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
                    border: none;
                    border-radius: 16px;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                }
                .stats-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                }
                .user-table {
                    background: white;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                    border: none;
                }
                .table th {
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    border: none;
                    font-weight: 600;
                    color: #495057;
                    padding: 1rem;
                }
                .table td {
                    border: none;
                    padding: 1rem;
                    vertical-align: middle;
                    border-bottom: 1px solid #f8f9fa;
                }
                .table tbody tr:hover {
                    background: rgba(102, 126, 234, 0.05);
                }
                .avatar {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 600;
                    font-size: 16px;
                }
                .btn-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    border-radius: 12px;
                    padding: 12px 24px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }
                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
                    background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
                }
                .modal-content {
                    border: none;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                }
                .form-control, .form-select {
                    border: 2px solid #e9ecef;
                    border-radius: 12px;
                    padding: 12px 16px;
                    transition: all 0.3s ease;
                }
                .form-control:focus, .form-select:focus {
                    border-color: #667eea;
                    box-shadow: 0 0 15px rgba(102, 126, 234, 0.15);
                }
                .chart-container {
                    background: white;
                    border-radius: 16px;
                    padding: 2rem;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                    margin-bottom: 2rem;
                }
                .quick-actions {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 16px;
                    padding: 2rem;
                    color: white;
                    margin-bottom: 2rem;
                }
            `}</style>

            <div className="container-fluid p-4">
                <div className="main-container p-4">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h1 className="h2 fw-bold text-dark mb-1">
                                <i className="bi bi-graph-up text-primary me-2"></i>
                                Reportes y Gráficas
                            </h1>
                            <p className="text-muted mb-0">Analiza el rendimiento y genera reportes</p>
                        </div>
                        <button onClick={() => openModal()} className="btn btn-primary">
                            <i className="bi bi-plus-lg me-2"></i>Nuevo Reporte
                        </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="quick-actions">
                        <h4 className="mb-3">
                            <i className="bi bi-lightning-charge me-2"></i>
                            Generar Reportes Rápidos
                        </h4>
                        <div className="row">
                            <div className="col-md-3 mb-2">
                                <button
                                    className="btn btn-light w-100"
                                    onClick={() => generateReport('Reservas')}
                                >
                                    <i className="bi bi-calendar-check me-2"></i>
                                    Reservas
                                </button>
                            </div>
                            <div className="col-md-3 mb-2">
                                <button
                                    className="btn btn-light w-100"
                                    onClick={() => generateReport('Financiero')}
                                >
                                    <i className="bi bi-currency-dollar me-2"></i>
                                    Financiero
                                </button>
                            </div>
                            <div className="col-md-3 mb-2">
                                <button
                                    className="btn btn-light w-100"
                                    onClick={() => generateReport('Ocupación')}
                                >
                                    <i className="bi bi-building me-2"></i>
                                    Ocupación
                                </button>
                            </div>
                            <div className="col-md-3 mb-2">
                                <button
                                    className="btn btn-light w-100"
                                    onClick={() => generateReport('Calidad')}
                                >
                                    <i className="bi bi-star me-2"></i>
                                    Calidad
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="row g-4 mb-4">
                        <div className="col-lg-3 col-md-6">
                            <div className="stats-card card text-center h-100">
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-center mb-3">
                                        <div className="avatar">
                                            <i className="bi bi-file-earmark-text"></i>
                                        </div>
                                    </div>
                                    <h3 className="fw-bold text-primary">{reports.length}</h3>
                                    <p className="text-muted mb-0">Total Reportes</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="stats-card card text-center h-100">
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-center mb-3">
                                        <div className="avatar" style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' }}>
                                            <i className="bi bi-check-circle-fill"></i>
                                        </div>
                                    </div>
                                    <h3 className="fw-bold text-success">{reports.filter(r => r.estado === 'Completado').length}</h3>
                                    <p className="text-muted mb-0">Completados</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="stats-card card text-center h-100">
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-center mb-3">
                                        <div className="avatar" style={{ background: 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)' }}>
                                            <i className="bi bi-clock-fill"></i>
                                        </div>
                                    </div>
                                    <h3 className="fw-bold text-warning">{reports.filter(r => r.estado === 'Procesando').length}</h3>
                                    <p className="text-muted mb-0">Procesando</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="stats-card card text-center h-100">
                                <div className="card-body">
                                    <div className="d-flex align-items-center justify-content-center mb-3">
                                        <div className="avatar" style={{ background: 'linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%)' }}>
                                            <i className="bi bi-hourglass-split"></i>
                                        </div>
                                    </div>
                                    <h3 className="fw-bold text-info">{reports.filter(r => r.estado === 'Pendiente').length}</h3>
                                    <p className="text-muted mb-0">Pendientes</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="row mb-4">
                        <div className="col-lg-8">
                            <div className="chart-container">
                                <h5 className="mb-4">
                                    <i className="bi bi-graph-up me-2"></i>
                                    Reservas e Ingresos por Mes
                                </h5>
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
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="chart-container">
                                <h5 className="mb-4">
                                    <i className="bi bi-pie-chart me-2"></i>
                                    Estados de Reservas
                                </h5>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={estadosData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {estadosData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="chart-container">
                                <h5 className="mb-4">
                                    <i className="bi bi-bar-chart me-2"></i>
                                    Rendimiento por Establecimiento
                                </h5>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={hospederiaData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="nombre" />
                                        <YAxis yAxisId="left" />
                                        <YAxis yAxisId="right" orientation="right" />
                                        <Tooltip />
                                        <Legend />
                                        <Bar yAxisId="left" dataKey="reservas" fill="#667eea" name="Reservas" />
                                        <Bar yAxisId="right" dataKey="ingresos" fill="#28a745" name="Ingresos ($)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Reports Table */}
                    <div className="user-table">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre del Reporte</th>
                                        <th>Tipo</th>
                                        <th>Fecha Generación</th>
                                        <th>Período</th>
                                        <th>Estado</th>
                                        <th>Archivo</th>
                                        <th className="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.map((report) => (
                                        <tr key={report.id_reporte}>
                                            <td>
                                                <span className="badge bg-secondary rounded-pill px-3 py-2">
                                                    {report.id_reporte}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="fw-semibold">{report.nombre}</div>
                                            </td>
                                            <td>
                                                <span className={`badge rounded-pill px-3 py-2 ${report.tipo === 'Financiero' ? 'bg-success' :
                                                        report.tipo === 'Reservas' ? 'bg-primary' :
                                                            report.tipo === 'Ocupación' ? 'bg-info' :
                                                                'bg-warning'
                                                    }`}>
                                                    <i className={`bi ${report.tipo === 'Financiero' ? 'bi-currency-dollar' :
                                                            report.tipo === 'Reservas' ? 'bi-calendar-check' :
                                                                report.tipo === 'Ocupación' ? 'bi-building' :
                                                                    'bi-star'
                                                        } me-1`}></i>
                                                    {report.tipo}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="text-muted">
                                                    <i className="bi bi-calendar-event me-1"></i>
                                                    {report.fecha_generacion}
                                                </div>
                                            </td>
                                            <td className="text-muted">
                                                {report.periodo}
                                            </td>
                                            <td>
                                                <span className={`badge rounded-pill px-3 py-2 ${report.estado === 'Completado' ? 'bg-success' :
                                                        report.estado === 'Procesando' ? 'bg-warning' :
                                                            'bg-secondary'
                                                    }`}>
                                                    <i className={`bi ${report.estado === 'Completado' ? 'bi-check-circle-fill' :
                                                            report.estado === 'Procesando' ? 'bi-clock-fill' :
                                                                'bi-hourglass-split'
                                                        } me-1`}></i>
                                                    {report.estado}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="text-muted small">
                                                    <i className="bi bi-file-earmark me-1"></i>
                                                    {report.archivo}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="d-flex gap-2 justify-content-center">
                                                    <button
                                                        className="btn btn-outline-success btn-sm"
                                                        title="Descargar"
                                                    >
                                                        <i className="bi bi-download"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => openModal(report)}
                                                        className="btn btn-outline-primary btn-sm"
                                                        title="Editar"
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(report.id_reporte)}
                                                        className="btn btn-outline-danger btn-sm"
                                                        title="Eliminar"
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Modal */}
                <div className={`modal fade ${showModal ? 'show' : ''}`}
                    style={{ display: showModal ? 'block' : 'none' }}
                    tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold">
                                    <i className={`bi ${editingReport ? 'bi-pencil-square' : 'bi-file-earmark-plus'} text-primary me-2`}></i>
                                    {editingReport ? 'Editar Reporte' : 'Nuevo Reporte'}
                                </h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Nombre del Reporte</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleInputChange}
                                            placeholder="Reporte Mensual de Reservas"
                                            required
                                        />
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold">Tipo</label>
                                            <select
                                                className="form-select"
                                                name="tipo"
                                                value={formData.tipo}
                                                onChange={handleInputChange}
                                            >
                                                <option value="Reservas">Reservas</option>
                                                <option value="Financiero">Financiero</option>
                                                <option value="Ocupación">Ocupación</option>
                                                <option value="Calidad">Calidad</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold">Estado</label>
                                            <select
                                                className="form-select"
                                                name="estado"
                                                value={formData.estado}
                                                onChange={handleInputChange}
                                            >
                                                <option value="Pendiente">Pendiente</option>
                                                <option value="Procesando">Procesando</option>
                                                <option value="Completado">Completado</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Período</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="periodo"
                                            value={formData.periodo}
                                            onChange={handleInputChange}
                                            placeholder="Noviembre 2024"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Nombre del Archivo</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="archivo"
                                            value={formData.archivo}
                                            onChange={handleInputChange}
                                            placeholder="reporte_reservas.pdf"
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer border-0 pt-0">
                                    <button type="button" className="btn btn-light" onClick={closeModal}>
                                        Cancelar
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                                        <i className={`bi ${editingReport ? 'bi-check-lg' : 'bi-plus-lg'} me-2`}></i>
                                        {editingReport ? 'Actualizar' : 'Crear'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {showModal && (
                    <div className="modal-backdrop fade show" onClick={closeModal}></div>
                )}
            </div>
        </>
    );
}