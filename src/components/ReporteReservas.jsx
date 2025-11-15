import React, { useRef } from "react";

export default function ReporteReservas({ bookings }) {
    const reporteRef = useRef(null);

    // Calcular estadísticas avanzadas
    const totalReservas = bookings.length;
    const reservasConfirmadas = bookings.filter(b => b.reserva.estado === 'confirmada').length;
    const reservasPendientes = bookings.filter(b => b.reserva.estado === 'pendiente').length;
    const reservasCanceladas = bookings.filter(b => b.reserva.estado === 'cancelada').length;
    const reservasCompletadas = bookings.filter(b => b.reserva.estado === 'completada').length;
    
    const reservasHospedaje = bookings.filter(b => b.reserva.tipo_reserva === 'hosteleria').length;
    const reservasExperiencia = bookings.filter(b => b.reserva.tipo_reserva === 'experiencia').length;
    
    const totalPersonas = bookings.reduce((sum, b) => sum + (b.reserva.personas || 0), 0);
    const promedioPersonas = totalReservas > 0 ? (totalPersonas / totalReservas).toFixed(1) : 0;

    // Top 5 establecimientos más reservados
    const establecimientosCount = {};
    bookings.forEach(b => {
        const nombre = b.establecimiento?.nombre || 'Sin especificar';
        establecimientosCount[nombre] = (establecimientosCount[nombre] || 0) + 1;
    });
    const topEstablecimientos = Object.entries(establecimientosCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    // Análisis temporal
    const reservasPorMes = {};
    bookings.forEach(b => {
        const fecha = new Date(b.reserva.fecha_inicio);
        const mesAnio = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
        reservasPorMes[mesAnio] = (reservasPorMes[mesAnio] || 0) + 1;
    });
    const ultimosMeses = Object.entries(reservasPorMes)
        .sort((a, b) => b[0].localeCompare(a[0]))
        .slice(0, 6)
        .reverse();

    // Tasa de conversión
    const tasaConfirmacion = totalReservas > 0 ? ((reservasConfirmadas / totalReservas) * 100).toFixed(1) : 0;
    const tasaCancelacion = totalReservas > 0 ? ((reservasCanceladas / totalReservas) * 100).toFixed(1) : 0;

    const logo = "../../assets/logo.png";

    return (
        <div
            ref={reporteRef}
            id="reporte-reservas"
            className="pdftarget"
            style={{
                fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                backgroundColor: '#ffffff',
                padding: '50px',
                maxWidth: '900px',
                margin: '0 auto',
                color: '#2c3e50'
            }}
        >
            {/* ENCABEZADO */}
            <div style={{
                borderBottom: '4px solid #2c3e50',
                paddingBottom: '25px',
                marginBottom: '40px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
            }}>
                <div>
                    <img
                        src={logo}
                        alt="Logo"
                        style={{
                            width: '140px',
                            height: 'auto',
                            marginBottom: '15px'
                        }}
                    />
                    <h1 style={{
                        margin: '0',
                        fontSize: '28px',
                        fontWeight: '700',
                        color: '#2c3e50',
                        letterSpacing: '-0.5px'
                    }}>
                        INFORME DE RESERVAS
                    </h1>
                    <p style={{
                        margin: '5px 0 0 0',
                        fontSize: '13px',
                        color: '#7f8c8d',
                        fontWeight: '400'
                    }}>
                        Análisis de desempeño operativo
                    </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{
                        margin: '0 0 5px 0',
                        fontSize: '12px',
                        color: '#7f8c8d'
                    }}>
                        <strong>Fecha:</strong> {new Date().toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                    <p style={{
                        margin: '0',
                        fontSize: '12px',
                        color: '#7f8c8d'
                    }}>
                        <strong>Hora:</strong> {new Date().toLocaleTimeString('es-MX')}
                    </p>
                    <p style={{
                        margin: '10px 0 0 0',
                        fontSize: '11px',
                        color: '#95a5a6',
                        fontStyle: 'italic'
                    }}>
                        Documento confidencial
                    </p>
                </div>
            </div>

            {/* MÉTRICAS PRINCIPALES */}
            <div style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderLeft: '5px solid #2c3e50',
                padding: '25px',
                marginBottom: '35px'
            }}>
                <h2 style={{
                    margin: '0 0 20px 0',
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#2c3e50',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    Métricas Clave
                </h2>
                
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '20px'
                }}>
                    <div style={metricBoxStyle}>
                        <div style={metricLabelStyle}>Total de Reservas</div>
                        <div style={metricValueStyle}>{totalReservas}</div>
                    </div>
                    <div style={metricBoxStyle}>
                        <div style={metricLabelStyle}>Tasa de Confirmación</div>
                        <div style={{ ...metricValueStyle, color: '#27ae60' }}>{tasaConfirmacion}%</div>
                    </div>
                    <div style={metricBoxStyle}>
                        <div style={metricLabelStyle}>Tasa de Cancelación</div>
                        <div style={{ ...metricValueStyle, color: '#e74c3c' }}>{tasaCancelacion}%</div>
                    </div>
                    <div style={metricBoxStyle}>
                        <div style={metricLabelStyle}>Promedio Huéspedes</div>
                        <div style={metricValueStyle}>{promedioPersonas}</div>
                    </div>
                </div>
            </div>

            {/* DISTRIBUCIÓN POR ESTADO Y TIPO */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '25px',
                marginBottom: '35px'
            }}>
                {/* Estado de Reservas */}
                <div style={sectionBoxStyle}>
                    <h3 style={sectionTitleStyle}>Estado de Reservas</h3>
                    <div style={{ marginTop: '20px' }}>
                        <div style={progressBarContainer}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <span style={{ fontSize: '12px', color: '#2c3e50', fontWeight: '600' }}>Confirmadas</span>
                                <span style={{ fontSize: '12px', color: '#7f8c8d' }}>{reservasConfirmadas}</span>
                            </div>
                            <div style={progressBarBg}>
                                <div style={{
                                    ...progressBarFill,
                                    width: `${(reservasConfirmadas / totalReservas * 100)}%`,
                                    backgroundColor: '#27ae60'
                                }}></div>
                            </div>
                        </div>

                        <div style={progressBarContainer}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <span style={{ fontSize: '12px', color: '#2c3e50', fontWeight: '600' }}>Pendientes</span>
                                <span style={{ fontSize: '12px', color: '#7f8c8d' }}>{reservasPendientes}</span>
                            </div>
                            <div style={progressBarBg}>
                                <div style={{
                                    ...progressBarFill,
                                    width: `${(reservasPendientes / totalReservas * 100)}%`,
                                    backgroundColor: '#f39c12'
                                }}></div>
                            </div>
                        </div>

                        <div style={progressBarContainer}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <span style={{ fontSize: '12px', color: '#2c3e50', fontWeight: '600' }}>Canceladas</span>
                                <span style={{ fontSize: '12px', color: '#7f8c8d' }}>{reservasCanceladas}</span>
                            </div>
                            <div style={progressBarBg}>
                                <div style={{
                                    ...progressBarFill,
                                    width: `${(reservasCanceladas / totalReservas * 100)}%`,
                                    backgroundColor: '#e74c3c'
                                }}></div>
                            </div>
                        </div>

                        {reservasCompletadas > 0 && (
                            <div style={progressBarContainer}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                    <span style={{ fontSize: '12px', color: '#2c3e50', fontWeight: '600' }}>Completadas</span>
                                    <span style={{ fontSize: '12px', color: '#7f8c8d' }}>{reservasCompletadas}</span>
                                </div>
                                <div style={progressBarBg}>
                                    <div style={{
                                        ...progressBarFill,
                                        width: `${(reservasCompletadas / totalReservas * 100)}%`,
                                        backgroundColor: '#3498db'
                                    }}></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tipo de Servicio */}
                <div style={sectionBoxStyle}>
                    <h3 style={sectionTitleStyle}>Tipo de Servicio</h3>
                    <div style={{ marginTop: '20px' }}>
                        <div style={serviceTypeBox}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '5px' }}>Hospedaje</div>
                                <div style={{ fontSize: '28px', fontWeight: '700', color: '#2c3e50' }}>{reservasHospedaje}</div>
                            </div>
                            <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
                                {totalReservas > 0 ? ((reservasHospedaje / totalReservas) * 100).toFixed(0) : 0}%
                            </div>
                        </div>

                        <div style={serviceTypeBox}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '5px' }}>Experiencias</div>
                                <div style={{ fontSize: '28px', fontWeight: '700', color: '#2c3e50' }}>{reservasExperiencia}</div>
                            </div>
                            <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
                                {totalReservas > 0 ? ((reservasExperiencia / totalReservas) * 100).toFixed(0) : 0}%
                            </div>
                        </div>

                        <div style={{
                            padding: '15px',
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #dee2e6',
                            borderRadius: '4px',
                            marginTop: '15px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '11px', color: '#7f8c8d', marginBottom: '5px' }}>TOTAL DE HUÉSPEDES</div>
                            <div style={{ fontSize: '24px', fontWeight: '700', color: '#2c3e50' }}>{totalPersonas}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TOP 5 ESTABLECIMIENTOS */}
            <div style={{ marginBottom: '35px' }}>
                <h3 style={sectionTitleStyle}>Top 5 Establecimientos Más Solicitados</h3>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    marginTop: '15px',
                    border: '1px solid #dee2e6'
                }}>
                    <thead>
                        <tr style={{ backgroundColor: '#2c3e50', color: '#ffffff' }}>
                            <th style={rankTableHeader}>Ranking</th>
                            <th style={{ ...rankTableHeader, textAlign: 'left' }}>Establecimiento</th>
                            <th style={rankTableHeader}>Reservas</th>
                            <th style={rankTableHeader}>Participación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topEstablecimientos.map(([nombre, count], index) => (
                            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa' }}>
                                <td style={{ ...rankTableCell, textAlign: 'center', fontWeight: '700', color: index === 0 ? '#f39c12' : '#2c3e50' }}>
                                    #{index + 1}
                                </td>
                                <td style={rankTableCell}>{nombre}</td>
                                <td style={{ ...rankTableCell, textAlign: 'center', fontWeight: '600' }}>{count}</td>
                                <td style={{ ...rankTableCell, textAlign: 'center' }}>
                                    {((count / totalReservas) * 100).toFixed(1)}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const metricBoxStyle = {
    backgroundColor: '#ffffff',
    padding: '15px',
    border: '1px solid #dee2e6',
    borderRadius: '4px'
};

const metricLabelStyle = {
    fontSize: '11px',
    color: '#7f8c8d',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: '0.5px',
    marginBottom: '8px'
};

const metricValueStyle = {
    fontSize: '32px',
    fontWeight: '700',
    color: '#2c3e50',
    lineHeight: '1'
};

const sectionBoxStyle = {
    border: '1px solid #dee2e6',
    borderRadius: '4px',
    padding: '20px',
    backgroundColor: '#ffffff'
};

const sectionTitleStyle = {
    margin: '0 0 15px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#2c3e50',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '2px solid #2c3e50',
    paddingBottom: '10px'
};

const progressBarContainer = {
    marginBottom: '20px'
};

const progressBarBg = {
    width: '100%',
    height: '12px',
    backgroundColor: '#e9ecef',
    borderRadius: '6px',
    overflow: 'hidden'
};

const progressBarFill = {
    height: '100%',
    transition: 'width 0.3s ease'
};

const serviceTypeBox = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    border: '1px solid #dee2e6',
    borderRadius: '4px',
    marginBottom: '15px',
    backgroundColor: '#f8f9fa'
};

const rankTableHeader = {
    padding: '12px',
    textAlign: 'center',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.8px',
    textTransform: 'uppercase'
};

const rankTableCell = {
    padding: '12px',
    fontSize: '12px',
    color: '#2c3e50',
    borderBottom: '1px solid #dee2e6'
};

const monthBoxStyle = {
    padding: '15px',
    border: '1px solid #dee2e6',
    borderRadius: '4px',
    textAlign: 'center',
    backgroundColor: '#f8f9fa'
};
