import React, { useRef } from "react";

export default function ReporteHoteles({ hotels, bookings }) {
    const reporteRef = useRef(null);
    const logo = "../../assets/logo.png";

    // 📊 CALCULAR ESTADÍSTICAS POR HOTEL
    const reservasHoteles = bookings.filter(b => b.reserva.tipo_reserva === 'hosteleria');
    
    const statsHoteles = hotels.map(hotel => {
        const reservasHotel = reservasHoteles.filter(b => 
            b.establecimiento?.id_hosteleria === hotel.id_hosteleria
        );
        
        const totalReservas = reservasHotel.length;
        
        // Calcular ingresos totales
        const ingresos = reservasHotel.reduce((sum, b) => {
            if (b.reserva.fecha_inicio && b.reserva.fecha_fin) {
                const fechaInicio = new Date(b.reserva.fecha_inicio);
                const fechaFin = new Date(b.reserva.fecha_fin);
                const noches = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24));
                return sum + (noches * hotel.precio_por_noche);
            }
            return sum;
        }, 0);
        
        return {
            ...hotel,
            totalReservas,
            ingresos
        };
    });

    // TOP 5 MÁS RESERVADOS
    const topReservados = [...statsHoteles]
        .sort((a, b) => b.totalReservas - a.totalReservas)
        .slice(0, 5);

    // TOP 5 MÁS RENTABLES
    const topRentables = [...statsHoteles]
        .sort((a, b) => b.ingresos - a.ingresos)
        .slice(0, 5);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount);
    };

    return (
        <div
            ref={reporteRef}
            id="reporte-hoteles"
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
                    <img src={logo} alt="Logo" style={{ width: '140px', height: 'auto', marginBottom: '15px' }} />
                    <h1 style={{ margin: '0', fontSize: '28px', fontWeight: '700', color: '#2c3e50', letterSpacing: '-0.5px' }}>
                        INFORME DE HOSPEDAJES
                    </h1>
                    <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#7f8c8d', fontWeight: '400' }}>
                        Análisis de rendimiento
                    </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#7f8c8d' }}>
                        <strong>Fecha:</strong> {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p style={{ margin: '0', fontSize: '12px', color: '#7f8c8d' }}>
                        <strong>Hora:</strong> {new Date().toLocaleTimeString('es-MX')}
                    </p>
                    <p style={{ margin: '10px 0 0 0', fontSize: '11px', color: '#95a5a6', fontStyle: 'italic' }}>
                        Documento confidencial
                    </p>
                </div>
            </div>

            {/* RESUMEN GENERAL */}
            <div style={{
                backgroundColor: '#3498db',
                color: 'white',
                padding: '30px',
                borderRadius: '8px',
                marginBottom: '35px',
                boxShadow: '0 4px 12px rgba(52, 152, 219, 0.2)'
            }}>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '10px' }}>
                    TOTAL DE HOSPEDAJES REGISTRADOS
                </div>
                <div style={{ fontSize: '48px', fontWeight: '700' }}>
                    {hotels.length}
                </div>
            </div>

            {/* TOP 5 MÁS RESERVADOS */}
            <div style={{ marginBottom: '35px' }}>
                <h3 style={sectionTitleStyle}>Top 5 Hospedajes Más Reservados</h3>
                <table style={tableStyle}>
                    <thead>
                        <tr style={{ backgroundColor: '#2c3e50', color: '#ffffff' }}>
                            <th style={thStyle}>Ranking</th>
                            <th style={{ ...thStyle, textAlign: 'left' }}>Nombre</th>
                            <th style={thStyle}>Precio/Noche</th>
                            <th style={thStyle}>Capacidad</th>
                            <th style={thStyle}>Total Reservas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topReservados.map((hotel, index) => (
                            <tr key={hotel.id_hosteleria} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa' }}>
                                <td style={{ ...tdStyle, textAlign: 'center', fontWeight: '700', color: index === 0 ? '#3498db' : '#2c3e50' }}>
                                    #{index + 1}
                                </td>
                                <td style={tdStyle}>{hotel.nombre}</td>
                                <td style={{ ...tdStyle, textAlign: 'right' }}>{formatCurrency(hotel.precio_por_noche)}</td>
                                <td style={{ ...tdStyle, textAlign: 'center' }}>{hotel.capacidad} personas</td>
                                <td style={{ ...tdStyle, textAlign: 'center', fontWeight: '600', color: '#3498db' }}>
                                    {hotel.totalReservas}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* TOP 5 MÁS RENTABLES */}
            <div style={{ marginBottom: '35px' }}>
                <h3 style={sectionTitleStyle}>Top 5 Hospedajes Más Rentables</h3>
                <table style={tableStyle}>
                    <thead>
                        <tr style={{ backgroundColor: '#2c3e50', color: '#ffffff' }}>
                            <th style={thStyle}>Ranking</th>
                            <th style={{ ...thStyle, textAlign: 'left' }}>Nombre</th>
                            <th style={thStyle}>Ubicación</th>
                            <th style={thStyle}>Tipo</th>
                            <th style={thStyle}>Ingresos Totales</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topRentables.map((hotel, index) => (
                            <tr key={hotel.id_hosteleria} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa' }}>
                                <td style={{ ...tdStyle, textAlign: 'center', fontWeight: '700', color: index === 0 ? '#27ae60' : '#2c3e50' }}>
                                    #{index + 1}
                                </td>
                                <td style={tdStyle}>{hotel.nombre}</td>
                                <td style={{ ...tdStyle, fontSize: '11px' }}>
                                    {hotel.direcciones?.ciudad}, {hotel.direcciones?.estado}
                                </td>
                                <td style={tdStyle}>{hotel.tipo_propiedad}</td>
                                <td style={{ ...tdStyle, textAlign: 'right', fontWeight: '600', color: '#27ae60' }}>
                                    {formatCurrency(hotel.ingresos)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* LISTADO COMPLETO */}
            <div style={{ marginBottom: '35px' }}>
                <h3 style={sectionTitleStyle}>Listado Completo de Hospedajes</h3>
                <table style={tableStyle}>
                    <thead>
                        <tr style={{ backgroundColor: '#2c3e50', color: '#ffffff' }}>
                            <th style={{ ...thStyle, textAlign: 'left' }}>Nombre</th>
                            <th style={thStyle}>Precio/Noche</th>
                            <th style={thStyle}>Capacidad</th>
                            <th style={thStyle}>Tipo</th>
                            <th style={{ ...thStyle, textAlign: 'left' }}>Ubicación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hotels.map((hotel, index) => (
                            <tr key={hotel.id_hosteleria} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa' }}>
                                <td style={tdStyle}>{hotel.nombre}</td>
                                <td style={{ ...tdStyle, textAlign: 'right' }}>{formatCurrency(hotel.precio_por_noche)}</td>
                                <td style={{ ...tdStyle, textAlign: 'center' }}>{hotel.capacidad} personas</td>
                                <td style={{ ...tdStyle, fontSize: '11px' }}>{hotel.tipo_propiedad}</td>
                                <td style={{ ...tdStyle, fontSize: '11px' }}>
                                    {hotel.direcciones?.ciudad}, {hotel.direcciones?.estado}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PIE DE PÁGINA */}
            <div style={{
                borderTop: '3px solid #2c3e50',
                paddingTop: '25px',
                marginTop: '50px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ margin: '0 0 5px 0', fontSize: '13px', fontWeight: '600', color: '#2c3e50' }}>
                            Tu Empresa S.A. de C.V.
                        </p>
                        <p style={{ margin: '0', fontSize: '11px', color: '#7f8c8d' }}>
                            Sistema de Gestión de Hospedajes
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: '0 0 3px 0', fontSize: '11px', color: '#7f8c8d' }}>
                            hospedajes@tuempresa.com
                        </p>
                        <p style={{ margin: '0', fontSize: '11px', color: '#7f8c8d' }}>
                            +52 (123) 456-7890
                        </p>
                    </div>
                </div>
                <p style={{ margin: '15px 0 0 0', fontSize: '10px', color: '#95a5a6', textAlign: 'center' }}>
                    © 2025 Todos los derechos reservados. Documento confidencial.
                </p>
            </div>
        </div>
    );
}

// ESTILOS
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

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px',
    border: '1px solid #dee2e6'
};

const thStyle = {
    padding: '12px',
    textAlign: 'center',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.8px',
    textTransform: 'uppercase'
};

const tdStyle = {
    padding: '12px',
    fontSize: '12px',
    color: '#2c3e50',
    borderBottom: '1px solid #dee2e6'
};
