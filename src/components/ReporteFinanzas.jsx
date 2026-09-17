import React, { useRef } from "react";

export default function ReporteFinanzas({ bookings }) {
    const reporteRef = useRef(null);

    // 💰 CÁLCULO CORRECTO DE INGRESOS
    const calcularIngresos = (booking) => {
        const reserva = booking.reserva;
        
        if (reserva.precio_total && reserva.precio_total > 0) {
            return reserva.precio_total;
        }
        
        if (reserva.tipo_reserva === 'hosteleria' && booking.establecimiento) {
            if (reserva.fecha_inicio && reserva.fecha_fin) {
                const fechaInicio = new Date(reserva.fecha_inicio);
                const fechaFin = new Date(reserva.fecha_fin);
                const noches = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24));
                const precioPorNoche = booking.establecimiento.precio_por_noche || 0;
                return noches * precioPorNoche;
            }
            return 0;
        }
        
        if (reserva.tipo_reserva === 'experiencia' && booking.experiencia) {
            const precioExperiencia = booking.experiencia.precio || 0;
            const personas = reserva.personas || 1;
            return precioExperiencia * personas;
        }
        
        return 0;
    };

    const ingresosTotales = bookings.reduce((sum, b) => sum + calcularIngresos(b), 0);

    const ingresosConfirmadas = bookings
        .filter(b => b.reserva.estado === 'confirmada' || b.reserva.estado === 'completada')
        .reduce((sum, b) => sum + calcularIngresos(b), 0);

    const ingresosPendientes = bookings
        .filter(b => b.reserva.estado === 'pendiente')
        .reduce((sum, b) => sum + calcularIngresos(b), 0);

    const ingresosCancelados = bookings
        .filter(b => b.reserva.estado === 'cancelada')
        .reduce((sum, b) => sum + calcularIngresos(b), 0);

    // Ingresos por tipo
    const ingresosHospedaje = bookings
        .filter(b => b.reserva.tipo_reserva === 'hosteleria')
        .reduce((sum, b) => sum + calcularIngresos(b), 0);

    const ingresosExperiencia = bookings
        .filter(b => b.reserva.tipo_reserva === 'experiencia')
        .reduce((sum, b) => sum + calcularIngresos(b), 0);

    const ticketPromedio = bookings.length > 0 ? (ingresosTotales / bookings.length) : 0;

    // Ingresos por mes
    const ingresosPorMes = {};
    bookings.forEach(b => {
        if (b.reserva.fecha_inicio) {
            const fecha = new Date(b.reserva.fecha_inicio);
            const mesAnio = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
            ingresosPorMes[mesAnio] = (ingresosPorMes[mesAnio] || 0) + calcularIngresos(b);
        }
    });

    const ultimosMeses = Object.entries(ingresosPorMes)
        .sort((a, b) => b[0].localeCompare(a[0]))
        .slice(0, 6)
        .reverse();

    // Top 5 establecimientos por ingresos
    const ingresosPorEstablecimiento = {};
    bookings.forEach(b => {
        let nombre = 'Sin especificar';
        if (b.reserva.tipo_reserva === 'hosteleria' && b.establecimiento) {
            nombre = b.establecimiento.nombre;
        } else if (b.reserva.tipo_reserva === 'experiencia' && b.experiencia) {
            nombre = b.experiencia.titulo;
        }
        ingresosPorEstablecimiento[nombre] = (ingresosPorEstablecimiento[nombre] || 0) + calcularIngresos(b);
    });

    const topEstablecimientos = Object.entries(ingresosPorEstablecimiento)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    // Crecimiento mensual
    const mesActual = ultimosMeses[ultimosMeses.length - 1]?.[1] || 0;
    const mesAnterior = ultimosMeses[ultimosMeses.length - 2]?.[1] || 0;
    const crecimientoMensual = mesAnterior > 0 
        ? (((mesActual - mesAnterior) / mesAnterior) * 100).toFixed(1) 
        : 0;

    const logo = "../../assets/logo.png";

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount);
    };

    return (
        <div
            ref={reporteRef}
            id="reporte-finanzas"
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
                        INFORME FINANCIERO
                    </h1>
                    <p style={{
                        margin: '5px 0 0 0',
                        fontSize: '13px',
                        color: '#7f8c8d',
                        fontWeight: '400'
                    }}>
                        Análisis de ingresos y rentabilidad
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

            {/* RESUMEN EJECUTIVO */}
            <div style={{
                backgroundColor: '#27ae60',
                color: 'white',
                padding: '30px',
                borderRadius: '8px',
                marginBottom: '35px',
                boxShadow: '0 4px 12px rgba(39, 174, 96, 0.2)'
            }}>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '10px' }}>
                    INGRESOS TOTALES
                </div>
                <div style={{ fontSize: '48px', fontWeight: '700', marginBottom: '15px' }}>
                    {formatCurrency(ingresosTotales)}
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '20px',
                    paddingTop: '20px',
                    borderTop: '1px solid rgba(255,255,255,0.3)'
                }}>
                    <div>
                        <div style={{ fontSize: '11px', opacity: 0.9 }}>Confirmados</div>
                        <div style={{ fontSize: '20px', fontWeight: '600' }}>
                            {formatCurrency(ingresosConfirmadas)}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: '11px', opacity: 0.9 }}>Pendientes</div>
                        <div style={{ fontSize: '20px', fontWeight: '600' }}>
                            {formatCurrency(ingresosPendientes)}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: '11px', opacity: 0.9 }}>Ticket Promedio</div>
                        <div style={{ fontSize: '20px', fontWeight: '600' }}>
                            {formatCurrency(ticketPromedio)}
                        </div>
                    </div>
                </div>
            </div>

            {/* MÉTRICAS CLAVE */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px',
                marginBottom: '35px'
            }}>
                <div style={metricCardStyle}>
                    <div style={metricLabelStyle}>Crecimiento Mensual</div>
                    <div style={{
                        fontSize: '32px',
                        fontWeight: '700',
                        color: parseFloat(crecimientoMensual) >= 0 ? '#27ae60' : '#e74c3c'
                    }}>
                        {crecimientoMensual > 0 ? '+' : ''}{crecimientoMensual}%
                    </div>
                </div>
                <div style={metricCardStyle}>
                    <div style={metricLabelStyle}>Total Reservas</div>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#2c3e50' }}>
                        {bookings.length}
                    </div>
                </div>
                <div style={metricCardStyle}>
                    <div style={metricLabelStyle}>Cancelaciones</div>
                    <div style={{ fontSize: '32px', fontWeight: '700', color: '#e74c3c' }}>
                        {formatCurrency(ingresosCancelados)}
                    </div>
                </div>
            </div>

            {/* DISTRIBUCIÓN POR TIPO */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '25px',
                marginBottom: '35px'
            }}>
                <div style={sectionBoxStyle}>
                    <h3 style={sectionTitleStyle}>Ingresos por Tipo</h3>
                    <div style={{ marginTop: '20px' }}>
                        <div style={{
                            padding: '20px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px',
                            marginBottom: '15px',
                            borderLeft: '4px solid #3498db'
                        }}>
                            <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '8px' }}>
                                HOSPEDAJE
                            </div>
                            <div style={{ fontSize: '28px', fontWeight: '700', color: '#2c3e50' }}>
                                {formatCurrency(ingresosHospedaje)}
                            </div>
                            <div style={{ fontSize: '11px', color: '#7f8c8d', marginTop: '5px' }}>
                                {ingresosTotales > 0 ? ((ingresosHospedaje / ingresosTotales) * 100).toFixed(1) : 0}% del total
                            </div>
                        </div>

                        <div style={{
                            padding: '20px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px',
                            borderLeft: '4px solid #9b59b6'
                        }}>
                            <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '8px' }}>
                                EXPERIENCIAS
                            </div>
                            <div style={{ fontSize: '28px', fontWeight: '700', color: '#2c3e50' }}>
                                {formatCurrency(ingresosExperiencia)}
                            </div>
                            <div style={{ fontSize: '11px', color: '#7f8c8d', marginTop: '5px' }}>
                                {ingresosTotales > 0 ? ((ingresosExperiencia / ingresosTotales) * 100).toFixed(1) : 0}% del total
                            </div>
                        </div>
                    </div>
                </div>

                {/* INGRESOS POR ESTADO */}
                <div style={sectionBoxStyle}>
                    <h3 style={sectionTitleStyle}>Ingresos por Estado</h3>
                    <div style={{ marginTop: '20px' }}>
                        <div style={progressBarContainer}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <span style={{ fontSize: '12px', color: '#2c3e50', fontWeight: '600' }}>Confirmados</span>
                                <span style={{ fontSize: '12px', color: '#7f8c8d', fontWeight: '600' }}>
                                    {formatCurrency(ingresosConfirmadas)}
                                </span>
                            </div>
                            <div style={progressBarBg}>
                                <div style={{
                                    ...progressBarFill,
                                    width: `${ingresosTotales > 0 ? (ingresosConfirmadas / ingresosTotales * 100) : 0}%`,
                                    backgroundColor: '#27ae60'
                                }}></div>
                            </div>
                        </div>

                        <div style={progressBarContainer}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <span style={{ fontSize: '12px', color: '#2c3e50', fontWeight: '600' }}>Pendientes</span>
                                <span style={{ fontSize: '12px', color: '#7f8c8d', fontWeight: '600' }}>
                                    {formatCurrency(ingresosPendientes)}
                                </span>
                            </div>
                            <div style={progressBarBg}>
                                <div style={{
                                    ...progressBarFill,
                                    width: `${ingresosTotales > 0 ? (ingresosPendientes / ingresosTotales * 100) : 0}%`,
                                    backgroundColor: '#f39c12'
                                }}></div>
                            </div>
                        </div>

                        <div style={progressBarContainer}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <span style={{ fontSize: '12px', color: '#2c3e50', fontWeight: '600' }}>Cancelados</span>
                                <span style={{ fontSize: '12px', color: '#7f8c8d', fontWeight: '600' }}>
                                    {formatCurrency(ingresosCancelados)}
                                </span>
                            </div>
                            <div style={progressBarBg}>
                                <div style={{
                                    ...progressBarFill,
                                    width: `${ingresosTotales > 0 ? (ingresosCancelados / ingresosTotales * 100) : 0}%`,
                                    backgroundColor: '#e74c3c'
                                }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TOP 5 ESTABLECIMIENTOS */}
            <div style={{ marginBottom: '35px' }}>
                <h3 style={sectionTitleStyle}>Top 5 por Ingresos</h3>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    marginTop: '15px',
                    border: '1px solid #dee2e6'
                }}>
                    <thead>
                        <tr style={{ backgroundColor: '#2c3e50', color: '#ffffff' }}>
                            <th style={rankTableHeader}>Ranking</th>
                            <th style={{ ...rankTableHeader, textAlign: 'left' }}>Nombre</th>
                            <th style={rankTableHeader}>Ingresos</th>
                            <th style={rankTableHeader}>% del Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topEstablecimientos.map(([nombre, ingresos], index) => (
                            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa' }}>
                                <td style={{ ...rankTableCell, textAlign: 'center', fontWeight: '700', color: index === 0 ? '#27ae60' : '#2c3e50' }}>
                                    #{index + 1}
                                </td>
                                <td style={rankTableCell}>{nombre}</td>
                                <td style={{ ...rankTableCell, textAlign: 'right', fontWeight: '600', color: '#27ae60' }}>
                                    {formatCurrency(ingresos)}
                                </td>
                                <td style={{ ...rankTableCell, textAlign: 'center' }}>
                                    {((ingresos / ingresosTotales) * 100).toFixed(1)}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* TENDENCIA MENSUAL */}
            <div style={{ marginBottom: '35px' }}>
                <h3 style={sectionTitleStyle}>Evolución de Ingresos (Últimos 6 Meses)</h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    gap: '10px',
                    marginTop: '15px'
                }}>
                    {ultimosMeses.map(([mes, ingresos]) => {
                        const [year, month] = mes.split('-');
                        const nombreMes = new Date(year, parseInt(month) - 1).toLocaleDateString('es-MX', { month: 'short' });
                        return (
                            <div key={mes} style={{
                                padding: '15px',
                                border: '1px solid #dee2e6',
                                borderRadius: '8px',
                                textAlign: 'center',
                                backgroundColor: '#f8f9fa'
                            }}>
                                <div style={{ fontSize: '11px', color: '#7f8c8d', marginBottom: '8px', textTransform: 'uppercase' }}>
                                    {nombreMes}
                                </div>
                                <div style={{ fontSize: '16px', fontWeight: '700', color: '#27ae60' }}>
                                    {formatCurrency(ingresos)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* PIE DE PÁGINA */}
            <div style={{
                borderTop: '3px solid #2c3e50',
                paddingTop: '25px',
                marginTop: '50px'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <p style={{
                            margin: '0 0 5px 0',
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#2c3e50'
                        }}>
                            Tu Empresa S.A. de C.V.
                        </p>
                        <p style={{
                            margin: '0',
                            fontSize: '11px',
                            color: '#7f8c8d'
                        }}>
                            Sistema de Gestión Financiera
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{
                            margin: '0 0 3px 0',
                            fontSize: '11px',
                            color: '#7f8c8d'
                        }}>
                            finanzas@tuempresa.com
                        </p>
                        <p style={{
                            margin: '0',
                            fontSize: '11px',
                            color: '#7f8c8d'
                        }}>
                            +52 (123) 456-7890
                        </p>
                    </div>
                </div>
                <p style={{
                    margin: '15px 0 0 0',
                    fontSize: '10px',
                    color: '#95a5a6',
                    textAlign: 'center'
                }}>
                    © 2025 Todos los derechos reservados. Información financiera confidencial.
                </p>
            </div>
        </div>
    );
}

const metricCardStyle = {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    border: '1px solid #dee2e6',
    borderRadius: '8px'
};

const metricLabelStyle = {
    fontSize: '11px',
    color: '#7f8c8d',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: '0.5px',
    marginBottom: '10px'
};

const sectionBoxStyle = {
    border: '1px solid #dee2e6',
    borderRadius: '8px',
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
