
                    <div className="row g-4 mb-4">
                        {[...resenasData?.por_hosteleria || []]
                            .sort((a, b) => b.promedio_calificacion - a.promedio_calificacion)
                            .slice(0, 5)
                            .map((h, index) => {
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
                            .sort((a, b) => b.promedio_calificacion - a.promedio_calificacion)
                            .slice(0, 5)
                            .map((a, index) => {
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


                    {/* 🔸 Reservas e Ingresos por Mes */}
                    <div className="row mb-4">
                        <div className="col-lg-8">
                            <div className="chart-container">
                                <h5 className="mb-4">
                                    <i className="bi bi-graph-up me-2"></i>
                                    Reservas e Ingresos por Mes
                                </h5>

                                {/* Icono de ayuda */}
                                <i
                                    className="bi bi-exclamation-circle text-primary position-absolute top-0 end-0 m-3"
                                    style={{ cursor: 'pointer', fontSize: '1.2rem' }}
                                    onClick={() => toggleInfo('meses')}
                                ></i>

                                {/* Tooltip */}
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

                        {/* 🔸 Estados de Reservas */}
                        <div className="col-lg-4">
                            <div className="chart-container">
                                <h5 className="mb-4">
                                    <i className="bi bi-pie-chart me-2"></i>
                                    Estados de Reservas
                                </h5>

                                {/* Icono de ayuda */}
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

                    {/* 🔸 Rendimiento por Establecimiento */}
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

                    {/* 🔸 Rendimiento por Anfitrión */}
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
                                    <Tooltip formatter={(value, name, props) => {
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

                        {/* Lista de cabañas por anfitrión */}
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