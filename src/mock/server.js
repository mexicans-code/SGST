import axios from 'axios';
import { loadDb, saveDb, nextId, nextReservaId, publicUser, resetDb } from './db';

const MOCK_HOSTS = [
  'alluring-consideration-production',
  'hospitality-production-72f9',
  'adminprofile-production',
  'valiant-cooperation-production',
];

export function isMockUrl(url) {
  if (!url) return false;
  if (url.startsWith('/')) return true;
  return MOCK_HOSTS.some((host) => url.includes(host));
}

let installed = false;
const originalFetch = window.fetch ? window.fetch.bind(window) : null;

function base64Encode(str) {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch (_err) { void _err;
    return btoa(str);
  }
}

function base64Decode(str) {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch (_err) { void _err;
    return atob(str);
  }
}

function makeToken(user) {
  const header = base64Encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64Encode(
    JSON.stringify({
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      iat: Date.now(),
      exp: Date.now() + 7 * 24 * 3600 * 1000,
    })
  );
  return `${header}.${payload}.demo-signature`;
}

function parseToken(token) {
  if (!token || typeof token !== 'string') return null;
  try {
    return JSON.parse(base64Decode(token.split('.')[1]));
  } catch (_err) { void _err;
    return null;
  }
}

function parseBody(body) {
  if (!body) return {};
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch (_err) { void _err;
      return {};
    }
  }
  if (body instanceof FormData) return { __formData: body };
  return body;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

const byMonth = (bookings) => {
  const ingresosPorMes = {};
  const reservasPorMes = {};
  bookings.forEach((b) => {
    const fecha = new Date(b.reserva.fecha_inicio || b.reserva.fecha || new Date());
    const key = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
    reservasPorMes[key] = (reservasPorMes[key] || 0) + 1;
    if (b.reserva.estado !== 'cancelada') {
      ingresosPorMes[key] = (ingresosPorMes[key] || 0) + (b.reserva.precio_total || 0);
    }
  });
  return { ingresosPorMes, reservasPorMes };
};

const byYear = (bookings) => {
  const ingresosPorAno = {};
  const reservasPorAno = {};
  bookings.forEach((b) => {
    const año = String(new Date(b.reserva.fecha_inicio || b.reserva.fecha || new Date()).getFullYear());
    reservasPorAno[año] = (reservasPorAno[año] || 0) + 1;
    if (b.reserva.estado !== 'cancelada') {
      ingresosPorAno[año] = (ingresosPorAno[año] || 0) + (b.reserva.precio_total || 0);
    }
  });
  return { ingresosPorAno, reservasPorAno };
};

const estadosResumen = (bookings) => {
  const estados = { confirmada: 0, pendiente: 0, completada: 0, cancelada: 0 };
  bookings.forEach((b) => {
    if (estados[b.reserva.estado] !== undefined) estados[b.reserva.estado] += 1;
  });
  const total = bookings.length || 1;
  const porcentajes = {};
  Object.keys(estados).forEach((k) => {
    porcentajes[k] = Math.round((estados[k] / total) * 100);
  });
  return { totalReservas: bookings.length, estados, porcentajes };
};

const pagosResumen = (payments) => {
  const pagosPorEstado = { completado: 0, pendiente: 0, fallido: 0 };
  let totalPagos = 0;
  payments.forEach((p) => {
    if (pagosPorEstado[p.estado] !== undefined) pagosPorEstado[p.estado] += 1;
    if (p.estado === 'completado') totalPagos += p.monto || 0;
  });
  const contados = Object.keys(pagosPorEstado).reduce((s, k) => s + pagosPorEstado[k], 0) || 1;
  const porcentajesPorEstado = {};
  Object.keys(pagosPorEstado).forEach((k) => {
    porcentajesPorEstado[k] = Math.round((pagosPorEstado[k] / contados) * 100);
  });
  return { totalPagos, pagosPorEstado, porcentajesPorEstado };
};

function buildBooking(reserva) {
  const db = loadDb();
  const usuario = db.users.find((u) => u.id_usuario === reserva.id_usuario);
  const hotel = reserva.id_hosteleria
    ? db.hotels.find((h) => h.id_hosteleria === reserva.id_hosteleria)
    : null;
  const experiencia = reserva.id_experiencia
    ? db.experiences.find((e) => e.id_experiencia === reserva.id_experiencia)
    : null;
  const anfitrion = db.users.find((u) => u.id_usuario === (reserva.id_anfitrion || (hotel && hotel.id_anfitrion)));
  return {
    reserva,
    usuario: usuario ? { id_usuario: usuario.id_usuario, nombre: usuario.nombre, email: usuario.email } : null,
    establecimiento: hotel
      ? {
          id_hosteleria: hotel.id_hosteleria,
          nombre: hotel.nombre,
          image: hotel.image,
          precio_por_noche: hotel.precio_por_noche,
          direccion: hotel.direccion || hotel.direcciones || null,
        }
      : null,
    anfitrion: reserva.tipo_reserva === 'hosteleria' && anfitrion
      ? { id_usuario: anfitrion.id_usuario, nombre: `${anfitrion.nombre} ${anfitrion.apellido_p || ''}`.trim(), email: anfitrion.email, telefono: anfitrion.telefono }
      : null,
    experiencia: experiencia
      ? {
          id_experiencia: experiencia.id_experiencia,
          titulo: experiencia.titulo,
          image: experiencia.image,
          precio: experiencia.precio,
          fecha_experiencia: experiencia.fecha_experiencia,
          anfitrion: anfitrion
            ? { id_usuario: anfitrion.id_usuario, nombre: `${anfitrion.nombre} ${anfitrion.apellido_p || ''}`.trim(), email: anfitrion.email, telefono: anfitrion.telefono }
            : null,
        }
      : null,
  };
}

function hotelsForHost(idAnfitrion) {
  const db = loadDb();
  return db.hotels.filter((h) => h.id_anfitrion === Number(idAnfitrion));
}

function experiencesForHost(idAnfitrion) {
  const db = loadDb();
  return db.experiences.filter((e) => e.id_anfitrion === Number(idAnfitrion));
}

function bookingsForHost(idAnfitrion) {
  const hostId = Number(idAnfitrion);
  return getBookings().filter(
    (b) =>
      (b.reserva.tipo_reserva === 'hosteleria' && b.establecimiento && b.anfitrion?.id_usuario === hostId) ||
      (b.reserva.tipo_reserva === 'experiencia' && b.experiencia && b.experiencia.anfitrion?.id_usuario === hostId)
  );
}

function getBookings() {
  const db = loadDb();
  return db.bookings.map((b) => buildBooking(b.reserva));
}

function createPago(monto, metodo) {
  const db = loadDb();
  const pago = {
    id_pago: nextId(db.payments, 'id_pago'),
    id_reserva: null,
    id_usuario: null,
    monto,
    metodo,
    estado: 'completado',
    fecha_pago: new Date().toISOString(),
    detalles: { method: metodo },
  };
  db.payments.push(pago);
  return pago;
}

function registrarReservaPorCompra(purchaseData) {
  const db = loadDb();
  const tipo = purchaseData?.tipo === 'tourism' ? 'experiencia' : 'hosteleria';
  const reserva = purchaseData?.reserva || {};
  const pricing = purchaseData?.pricing || {};

  const nueva = {
    id_reserva: nextReservaId(),
    id_usuario: reserva.id_usuario,
    id_hosteleria: tipo === 'hosteleria' ? reserva.id_hosteleria : null,
    id_experiencia: tipo === 'experiencia' ? reserva.id_experiencia : null,
    id_anfitrion: tipo === 'experiencia' ? reserva.id_anfitrion : null,
    fecha_inicio: tipo === 'hosteleria' ? reserva.fecha_inicio : reserva.fecha || null,
    fecha_fin: tipo === 'hosteleria' ? reserva.fecha_fin : null,
    fecha: tipo === 'experiencia' ? reserva.fecha : null,
    personas: tipo === 'hosteleria' ? reserva.personas : reserva.participantes,
    participantes: tipo === 'experiencia' ? reserva.participantes : null,
    estado: 'confirmada',
    precio_total: pricing.total || 0,
    tipo_reserva: tipo,
  };
  db.bookings.push({ reserva: nueva });
  const pago = createPago(nueva.precio_total, 'card');
  pago.id_reserva = nueva.id_reserva;
  pago.id_usuario = nueva.id_usuario;
  saveDb();
  return nueva;
}

function handleRequest(rawUrl, method, options) {
  const db = loadDb();
  const raw = String(typeof rawUrl === 'object' && rawUrl && rawUrl.url !== undefined ? rawUrl.url : rawUrl);
  let url = raw;
  let pathname = raw;
  let query = '';
  if (raw.startsWith('http')) {
    try {
      const parsed = new URL(raw);
      url = parsed.href;
      pathname = parsed.pathname;
      query = parsed.search.replace(/^\?/, '');
    } catch (e) {
      void e;
    }
  }
  const cleanPath = pathname.replace(/\/+$/, '');
  const match = (pattern) => new RegExp(`^${pattern}$`).test(cleanPath);
  const getId = (pattern) => {
    const m = cleanPath.match(new RegExp(`^${pattern}$`));
    return m ? m[1] : null;
  };
  const body = parseBody(options?.body);
  const authHeader = (options?.headers || {}).Authorization || (options?.headers || {}).authorization || '';
  const token = typeof authHeader === 'string' ? authHeader.replace('Bearer ', '') : '';
  const payload = parseToken(token);

  const json = (data, status = 200, extra = {}) => ({
    ok: status >= 200 && status < 400,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    url,
    data,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
    ...extra,
  });

  // ---- Auth ----
  if (match('/api/auth/login') && method === 'POST') {
    const user = db.users.find((u) => u.email.toLowerCase() === String(body.email || '').toLowerCase());
    if (!user || user.password !== body.password) {
      return json({ success: false, error: 'Credenciales incorrectas' }, 401);
    }
    return json({ success: true, token: makeToken(user), usuario: publicUser(user) });
  }

  if (match('/api/auth/register') && method === 'POST') {
    const email = String(body.email || '').toLowerCase();
    const exists = db.users.some((u) => u.email.toLowerCase() === email);
    if (exists) {
      return json({ success: false, error: 'El correo ya está registrado' }, 400);
    }
    const user = {
      id_usuario: nextId(db.users, 'id_usuario'),
      nombre: body.nombre || 'Nuevo',
      apellido_p: body.apellido_p || '',
      apellido_m: body.apellido_m || '',
      email: email || `${Date.now()}@demo.mx`,
      telefono: body.telefono || '',
      password: body.password || 'UsuarioDemo123',
      rol: 'usuario',
      estado: 'activo',
      foto: '',
      direccion: '',
    };
    db.users.push(user);
    saveDb();
    return json({ success: true, token: makeToken(user), usuario: publicUser(user) });
  }

  if (match('/api/auth/google-login') && method === 'POST') {
    const user = db.users.find((u) => u.rol === 'usuario' && u.email === 'usuario@sierragorda.mx') || db.users[0];
    return json({ success: true, token: makeToken(user), usuario: publicUser(user) });
  }

  // ---- Hospedajes / Hoteles ----
  if ((match('/api/hospitality/getHotelData') || match('/getHotelData')) && method === 'GET') {
    return json({ success: true, data: db.hotels });
  }

  if (match('/api/hospitality/createHotel') && method === 'POST') {
    const dir = body.direccion || body.direcciones || {
      calle: body.calle || '',
      numero_exterior: body.numero_exterior || '',
      numero_interior: body.numero_interior || '',
      colonia: body.colonia || '',
      ciudad: body.ciudad || 'Arroyo Seco',
      estado: body.estado || 'Querétaro',
      codigo_postal: body.codigo_postal || '76470',
      pais: body.pais || 'México',
    };
    const hotel = {
      id_hosteleria: nextId(db.hotels, 'id_hosteleria'),
      id_anfitrion: body.id_anfitrion || (payload && payload.id_usuario) || 2,
      nombre: body.nombre || 'Nueva propiedad',
      descripcion: body.descripcion || '',
      precio_por_noche: Number(body.precio_por_noche) || 0,
      habitaciones: Number(body.habitaciones) || 1,
      banos: Number(body.banos) || 1,
      capacidad: Number(body.capacidad) || 2,
      image: body.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      estado: body.estado || 'activo',
      direccion: dir,
      direcciones: dir,
    };
    db.hotels.push(hotel);
    saveDb();
    return json({ success: true, data: { id_hosteleria: hotel.id_hosteleria } });
  }

  {
    const id = getId('/api/hospitality/updateHotel/([0-9]+)');
    if (id && method === 'PUT') {
      const hotel = db.hotels.find((h) => h.id_hosteleria === Number(id));
      if (!hotel) return json({ success: false, error: 'Hotel no encontrado' }, 404);
      Object.assign(hotel, body);
      saveDb();
      return json({ success: true, data: hotel });
    }
  }

  {
    const id = getId('/api/hospitality/deleteHotel/([0-9]+)');
    if (id && method === 'DELETE') {
      db.hotels = db.hotels.filter((h) => h.id_hosteleria !== Number(id));
      saveDb();
      return json({ success: true });
    }
  }

  if (match('/api/hospitality/convertirseEnAnfitrion') && method === 'POST') {
    const idU = (body.id_usuario) || (payload && payload.id_usuario);
    const user = db.users.find((u) => u.id_usuario === Number(idU));
    if (user) {
      user.rol = 'anfitrion';
      saveDb();
      return json({ success: true, data: publicUser(user), usuario: publicUser(user), token: makeToken(user) });
    }
    return json({ success: false, error: 'Usuario no encontrado' }, 404);
  }

  // ---- Experiencias ----
  if (match('/api/adminTouristExperiences/getTouristExperiences') && method === 'GET') {
    return json({ success: true, data: db.experiences });
  }

  if (match('/api/adminTouristExperiences/createTouristExperience') && method === 'POST') {
    const exp = {
      id_experiencia: nextId(db.experiences, 'id_experiencia'),
      id_anfitrion: body.id_anfitrion || (payload && payload.id_usuario) || 2,
      titulo: body.titulo || 'Nueva experiencia',
      descripcion: body.descripcion || '',
      precio: Number(body.precio) || 0,
      calificacion: Number(body.calificacion) || 4.5,
      reviews: 0,
      image: body.image || 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
      duracion: body.duracion || '',
      tipo_experiencia: body.tipo_experiencia || 'Aventura',
      capacidad: Number(body.capacidad) || 10,
      estado: 'activo',
      fecha_experiencia: body.fecha_experiencia || new Date().toISOString(),
      direcciones: body.direcciones || { ciudad: 'Arroyo Seco', estado: 'Querétaro' },
      punto_encuentro: body.punto_encuentro || '',
      idioma: body.idioma || 'Español',
      dificultad: body.dificultad || 'Media',
      incluye: body.incluye || [],
    };
    db.experiences.push(exp);
    saveDb();
    return json({ success: true, data: { id_experiencia: exp.id_experiencia } });
  }

  {
    const id = getId('/api/adminTouristExperiences/updateExperience/([0-9]+)');
    if (id && method === 'PUT') {
      const exp = db.experiences.find((e) => e.id_experiencia === Number(id));
      if (!exp) return json({ success: false, error: 'Experiencia no encontrada' }, 404);
      Object.assign(exp, body);
      saveDb();
      return json({ success: true, data: exp });
    }
  }

  {
    const id = getId('/api/adminTouristExperiences/deleteTouristExperience/([0-9]+)');
    if (id && method === 'DELETE') {
      db.experiences = db.experiences.filter((e) => e.id_experiencia !== Number(id));
      saveDb();
      return json({ success: true });
    }
  }

  {
    const id = getId('/getTouristExperience/([0-9]+)');
    if (id && method === 'GET') {
      const exp = db.experiences.find((e) => e.id_experiencia === Number(id));
      if (!exp) {
        const m = cleanPath.match(/^\/getTouristExperience\/(.+)$/);
        const alt = m && db.experiences.find((e) => String(e.id_experiencia) === String(m[1]));
        if (alt) return json({ success: true, data: alt });
        return json({ success: false, error: 'Experiencia no encontrada' }, 404);
      }
      return json({ success: true, data: exp });
    }
  }

  // ---- Subida de imágenes ----
  if (match('/uploadImage') && method === 'POST') {
    const fd = body.__formData;
    const file = fd ? fd.get('image') : null;
    let imageUrl = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800';
    if (file && typeof file === 'string') imageUrl = file;
    const publicId = `img-${Date.now()}-${String(Math.random()).slice(2, 7)}`;
    return json({ success: true, imageUrl, publicId });
  }

  {
    const id = cleanPath.match(/^\/deleteImage\/(.+)$/);
    if (id && method === 'DELETE') {
      return json({ success: true });
    }
  }

  // ---- Perfil ----
  if ((match('/getProfile') || match('/api/adminProfile/getProfile')) && method === 'GET') {
    const idU = (payload && payload.id_usuario) || (query.includes('id') ? query.split('id=')[1] : null);
    const user = db.users.find((u) => u.id_usuario === Number(idU))
      || db.users.find((u) => u.rol === 'admin')
      || db.users[0];
    return json({ success: true, data: { ...publicUser(user), password: '' } });
  }

  if (match('/api/adminProfile/updateProfile') && method === 'PUT') {
    const idU = (payload && payload.id_usuario);
    const user = db.users.find((u) => u.id_usuario === Number(idU)) || db.users[0];
    const { password, ...rest } = body;
    Object.assign(user, rest);
    if (password) user.password = password;
    saveDb();
    return json({ success: true, data: publicUser(user) });
  }

  // ---- Usuarios (Admin) ----
  if (match('/api/adminUser/getUsers') && method === 'GET') {
    return json({ success: true, data: db.users.map((u) => publicUser(u)) });
  }

  if (match('/api/adminUser/createUser') && method === 'POST') {
    const user = {
      id_usuario: nextId(db.users, 'id_usuario'),
      nombre: body.nombre || '',
      apellido_p: body.apellido_p || '',
      apellido_m: body.apellido_m || '',
      email: body.email || `${Date.now()}@demo.mx`,
      telefono: body.telefono || '',
      password: body.password || 'Demo12345',
      rol: body.rol || 'usuario',
      estado: body.estado || 'activo',
      foto: body.foto || '',
      direccion: body.direccion || '',
    };
    db.users.push(user);
    saveDb();
    return json({ success: true, data: publicUser(user) });
  }

  {
    const id = getId('/api/adminUser/updateUser/([0-9]+)');
    if (id && method === 'PUT') {
      const user = db.users.find((u) => u.id_usuario === Number(id));
      if (!user) return json({ success: false, error: 'Usuario no encontrado' }, 404);
      const { password, ...rest } = body;
      Object.assign(user, rest);
      if (password && password !== '') user.password = password;
      saveDb();
      return json({ success: true, data: publicUser(user) });
    }
  }

  {
    const id = getId('/api/adminUser/deleteUser/([0-9]+)');
    if (id && method === 'DELETE') {
      db.users = db.users.filter((u) => u.id_usuario !== Number(id));
      saveDb();
      return json({ success: true });
    }
  }

  // ---- Reservas ----
  if ((match('/api/booking/getBookings') || match('/api/booking/getBooking')) && method === 'GET') {
    return json({ success: true, data: getBookings() });
  }

  if (match('/api/booking/createBooking') && method === 'POST') {
    const hotel = db.hotels.find((h) => h.id_hosteleria === Number(body.id_hosteleria));
    const reserva = {
      id_reserva: nextReservaId(),
      id_usuario: Number(body.id_usuario) || 3,
      id_hosteleria: Number(body.id_hosteleria) || (hotel && hotel.id_hosteleria) || null,
      id_experiencia: null,
      id_anfitrion: hotel ? hotel.id_anfitrion : null,
      fecha_inicio: body.fecha_inicio || null,
      fecha_fin: body.fecha_fin || null,
      fecha: null,
      personas: body.personas || 1,
      participantes: null,
      estado: body.estado || 'pendiente',
      precio_total: Number(body.precio_total) || (hotel ? hotel.precio_por_noche : 0),
      tipo_reserva: 'hosteleria',
    };
    db.bookings.push({ reserva });
    saveDb();
    return json({ success: true, data: { id_reserva: reserva.id_reserva, ...reserva } });
  }

  {
    const id = getId('/api/booking/updateBooking/([0-9]+)');
    if (id && method === 'PUT') {
      const booking = db.bookings.find((b) => b.reserva.id_reserva === Number(id));
      if (!booking) return json({ success: false, error: 'Reserva no encontrada' }, 404);
      Object.assign(booking.reserva, body);
      saveDb();
      return json({ success: true, data: booking.reserva });
    }
  }

  {
    const id = getId('/api/booking/cancelBooking/([0-9]+)');
    if (id) {
      const booking = db.bookings.find((b) => b.reserva.id_reserva === Number(id));
      if (booking) {
        booking.reserva.estado = 'cancelada';
        saveDb();
      }
      return json({ success: true });
    }
  }

  {
    const id = getId('/api/booking/deleteBooking/([0-9]+)');
    if (id && method === 'DELETE') {
      db.bookings = db.bookings.filter((b) => b.reserva.id_reserva !== Number(id));
      saveDb();
      return json({ success: true });
    }
  }

  // ---- Dashboard Admin ----
  if (match('/api/dashboard/resumen') && method === 'GET') {
    const bookings = getBookings();
    const { ingresosPorMes, reservasPorMes } = byMonth(bookings);
    const res = estadosResumen(bookings);
    const ingresosTotales = bookings
      .filter((b) => b.reserva.estado !== 'cancelada')
      .reduce((s, b) => s + (b.reserva.precio_total || 0), 0);
    return json({
      success: true,
      ingresosPorMes,
      reservasPorMes,
      resumenReservas: res,
      totalReservas: bookings.length,
      ingresosTotales,
      numHostelerias: db.hotels.length,
      numExperiencias: db.experiences.length,
      numUsuarios: db.users.length,
      promedioCalificacion: round2(
        db.hotels.reduce((s, h) => s + (h.promedio_calificacion || 4), 0) / (db.hotels.length || 1)
      ),
    });
  }

  if (match('/api/dashboard/ingresos-hosteleria') && method === 'GET') {
    const bookings = getBookings();
    const data = db.hotels.map((h) => {
      const bs = bookings.filter((b) => b.reserva.id_hosteleria === h.id_hosteleria && b.reserva.estado !== 'cancelada');
      return {
        id_hosteleria: h.id_hosteleria,
        nombre: h.nombre,
        imagen: h.image,
        total_reservas: bs.length,
        ingresos_totales: bs.reduce((s, b) => s + (b.reserva.precio_total || 0), 0),
      };
    });
    return json({ success: true, data });
  }

  if (match('/api/dashboard/ingresos-anfitrion') && method === 'GET') {
    const bookings = getBookings();
    const data = db.users
      .filter((u) => u.rol === 'anfitrion')
      .map((u) => {
        const bs = bookings.filter(
          (b) =>
            (b.reserva.tipo_reserva === 'hosteleria' && b.anfitrion?.id_usuario === u.id_usuario) ||
            (b.reserva.tipo_reserva === 'experiencia' && b.experiencia?.anfitrion?.id_usuario === u.id_usuario && b.reserva.estado !== 'cancelada')
        );
        return {
          id_anfitrion: u.id_usuario,
          nombre_anfitrion: `${u.nombre} ${u.apellido_p || ''}`.trim(),
          total_reservas: bs.filter((b) => b.reserva.estado !== 'cancelada').length,
          ingresos_totales: bs.reduce((s, b) => s + (b.reserva.precio_total || 0), 0),
          hostelerias: hotelsForHost(u.id_usuario),
        };
      });
    return json({ success: true, data });
  }

  if (match('/api/dashboard/resenas') && method === 'GET') {
    const por_hosteleria = db.hotels.map((h) => {
      const rs = db.reviews.filter((r) => r.id_hosteleria === h.id_hosteleria);
      return {
        id_hosteleria: h.id_hosteleria,
        nombre: h.nombre,
        promedio_calificacion: rs.length ? round2(rs.reduce((s, r) => s + r.calificacion, 0) / rs.length) : 4,
        total_resenas: rs.length,
      };
    });
    const por_anfitrion = db.users
      .filter((u) => u.rol === 'anfitrion')
      .map((u) => {
        const rs = db.reviews.filter((r) =>
          db.hotels.some((h) => h.id_hosteleria === r.id_hosteleria && h.id_anfitrion === u.id_usuario) ||
          db.experiences.some((e) => e.id_experiencia === r.id_experiencia && e.id_anfitrion === u.id_usuario)
        );
        return {
          id_anfitrion: u.id_usuario,
          promedio_calificacion: rs.length ? round2(rs.reduce((s, r) => s + r.calificacion, 0) / rs.length) : 4,
          total_resenas: rs.length,
        };
      });
    return json({ success: true, por_hosteleria, por_anfitrion });
  }

  // ---- Dashboard Anfitrión ----
  {
    const id = getId('/api/dashboardAnfitrion/([0-9]+)');
    if (id && method === 'GET') {
      const hostId = Number(id);
      const bookings = bookingsForHost(hostId);
      const db2 = loadDb();
      const hostPayments = db2.payments.filter((p) =>
        bookings.some((b) => b.reserva.id_reserva === p.id_reserva)
      );
      const { ingresosPorMes, reservasPorMes } = byMonth(bookings);
      const { ingresosPorAno, reservasPorAno } = byYear(bookings);
      const hostelerias = hotelsForHost(hostId).map((h) => {
        const rs = db2.reviews.filter((r) => r.id_hosteleria === h.id_hosteleria);
        return {
          ...h,
          promedio_calificacion: rs.length ? round2(rs.reduce((s, r) => s + r.calificacion, 0) / rs.length) : 4,
          total_resenas: rs.length,
        };
      });
      const todas = db2.reviews.filter((r) =>
        hostelerias.some((h) => h.id_hosteleria === r.id_hosteleria) ||
        experiencesForHost(hostId).some((e) => e.id_experiencia === r.id_experiencia)
      );
      const promedioGeneral = todas.length ? round2(todas.reduce((s, r) => s + r.calificacion, 0) / todas.length) : '0.00';
      return json({
        success: true,
        resumenPagos: pagosResumen(hostPayments),
        resumenReservas: estadosResumen(bookings),
        ingresosPorMes,
        reservasPorMes,
        ingresosPorAno,
        reservasPorAno,
        hostelerias,
        promedioGeneral,
      });
    }
  }

  {
    const id = getId('/api/dashboard/hotelData/([0-9]+)');
    if (id && method === 'GET') {
      return json({ success: true, data: hotelsForHost(id) });
    }
  }

  {
    const id = getId('/api/dashboard/touristExperiences/([0-9]+)');
    if (id && method === 'GET') {
      return json({ success: true, data: experiencesForHost(id) });
    }
  }

  // ---- Reseñas ----
  if (match('/api/reviews/getReviews') && method === 'GET') {
    const params = new URLSearchParams(query);
    const idHosteleria = params.get('id_hosteleria');
    const idExperiencia = params.get('id_experiencia');
    const filtered = db.reviews.filter((r) => {
      if (idHosteleria) return r.id_hosteleria === Number(idHosteleria);
      if (idExperiencia) return r.id_experiencia === Number(idExperiencia);
      return true;
    });
    const data = filtered.map((r) => ({
      id_calificacion: r.id_calificacion,
      nombre_usuario: r.nombre_usuario || 'Usuario',
      fecha_reseña: r.fecha_reseña,
      calificacion: r.calificacion,
      comentario: r.comentario || '',
    }));
    return json({ success: true, data });
  }

  if (match('/api/reviews/addReview') && method === 'POST') {
    const existente = db.reviews.find((r) => r.id_reserva === Number(body.id_reserva));
    if (existente) {
      return json({ success: false, error: 'Ya has dejado una reseña para esta reservación' }, 409);
    }
    const reserva = db.bookings.find((b) => b.reserva.id_reserva === Number(body.id_reserva));
    const review = {
      id_calificacion: nextId(db.reviews, 'id_calificacion'),
      id_reserva: Number(body.id_reserva),
      id_usuario: Number(body.id_usuario) || null,
      nombre_usuario: body.nombre_usuario || '',
      id_hosteleria: reserva && reserva.reserva.id_hosteleria || null,
      id_experiencia: reserva && reserva.reserva.id_experiencia || null,
      calificacion: clamp(Number(body.calificacion), 1, 5),
      comentario: body.comentario || '',
      fecha_reseña: new Date().toISOString(),
    };
    const usr = db.users.find((u) => u.id_usuario === Number(body.id_usuario));
    if (usr) review.nombre_usuario = `${usr.nombre} ${usr.apellido_p || ''}`.trim();
    db.reviews.push(review);
    saveDb();
    return json({ success: true, data: { id_reseña: review.id_calificacion, id_reserva: review.id_reserva } });
  }

  // ---- Pagos ----
  if (match('/api/pay/mercadopago') && method === 'POST') {
    registrarReservaPorCompra(body);
    return json({
      success: true,
      status: 'approved',
      payment_id: 'MP-MOCK-' + Date.now(),
      status_detail: 'accredited',
    });
  }

  if (match('/api/pay/purchase') && method === 'POST') {
    const reserva = registrarReservaPorCompra(body);
    return json({
      success: true,
      data: { reservationId: body.reservationId, id_reserva: reserva.id_reserva },
    });
  }

  if (match('/create-calendar-event') && method === 'POST') {
    return json({ success: true });
  }

  // ---- Utilidades ----
  if (query.includes('reset=demo')) {
    resetDb();
    return json({ success: true });
  }

  return json({ success: false, error: 'Endpoint no disponible en modo demo' }, 404);
}

function fetchLike(url, method, options) {
  const res = handleRequest(url, method, options);
  if (res && typeof res.json === 'function') return Promise.resolve(res);
  return Promise.resolve(res);
}

export function installMock() {
  if (installed) return;
  installed = true;

  if (originalFetch) {
    window.fetch = (input, init) => {
      const url = typeof input === 'string' ? input : (input && input.url) || '';
      const method = ((init && init.method) || (input && input.method) || 'GET').toUpperCase();
      if (isMockUrl(url)) {
        return fetchLike(url, method, init || (typeof input === 'object' && input ? input : {}));
      }
      return originalFetch(input, init);
    };
  }

  const originalAdapter = axios.defaults.adapter;

  axios.defaults.adapter = async (config) => {
    const base = config.baseURL || '';
    const url = `${base}${config.url || ''}`;
    const method = (config.method || 'get').toUpperCase();

    if (isMockUrl(url) && !url.includes('sdk.mercadopago')) {
      const res = handleRequest(
        url,
        method,
        {
          method,
          body: config.data,
          headers: config.headers || {},
        }
        );
      const body = await res.json();
      return {
        data: body,
        status: res.status,
        statusText: res.statusText,
        headers: res.headers || {},
        config,
        request: {},
      };
    }

    if (typeof originalAdapter === 'function') {
      const raw = await originalAdapter(config);
      return raw;
    }
    if (typeof originalAdapter === 'string') {
      const resolved = axios.getAdapter(originalAdapter);
      const raw = await resolved(config);
      return raw;
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(config.method || 'get', `${base}${config.url || ''}`);
      const headers = config.headers || {};
      Object.keys(headers).forEach((k) => {
        if (headers[k] !== undefined && headers[k] !== null && k !== 'common' && k !== 'delete' && k !== 'get' && k !== 'head' && k !== 'post' && k !== 'put' && k !== 'patch') {
          xhr.setRequestHeader(k, headers[k]);
        }
      });
      xhr.onload = () => {
        let data = xhr.responseText;
        try {
          data = JSON.parse(data);
        } catch (_err) { void _err;
          data = xhr.responseText;
        }
        resolve({ data, status: xhr.status, statusText: xhr.statusText, headers: {}, config, request: xhr });
      };
      xhr.onerror = () => reject(new Error('Network Error'));
      xhr.send(config.data || null);
    });
  };
}