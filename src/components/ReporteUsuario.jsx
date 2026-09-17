import React from 'react';

export default function ReporteUsuarios({ users }) {
    return (
        <div className="pdftarget">
            <h3>Usuarios ({users.length})</h3>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Nombre Completo</th>
                        <th>Correo</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Fecha de Registro</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id_usuario}>
                            <td>{`${user.nombre} ${user.apellido_p} ${user.apellido_m}`}</td>
                            <td>{user.email}</td>
                            <td>{user.rol}</td>
                            <td>{user.estado}</td>
                            <td>{new Date(user.fecha_registro).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
