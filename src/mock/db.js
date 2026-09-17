const STORAGE_KEY = 'sgst_mock_db_v1';

const IMG = {
  casa: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop&q=60',
  cabana: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60',
  hotel: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=60',
  montana: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&auto=format&fit=crop&q=60',
  lago: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&auto=format&fit=crop&q=60',
  bosque: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=60',
  camino: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop&q=60',
  rio: 'https://images.unsplash.com/photo-1464013778555-8e723c2f01f8?w=800&auto=format&fit=crop&q=60',
};

const direccionBase = (calle, numero, colonia) => ({
  calle,
  numero_exterior: numero,
  numero_interior: '',
  colonia,
  ciudad: 'Arroyo Seco',
  estado: 'Querétaro',
  codigo_postal: '76470',
  pais: 'México',
});

const add = (fecha, dias) => {
  const d = new Date(fecha);
  d.setDate(d.getDate() + dias);
  return d.toISOString();
};

const seed = () => ({
  users: [
    {
      id_usuario: 1,
      nombre: 'Ricardo',
      apellido_p: 'Medina',
      apellido_m: 'Cruz',
      email: 'admin@sierragorda.mx',
      telefono: '4421234567',
      password: 'Admin123',
      rol: 'admin',
      estado: 'activo',
      foto: '',
      direccion: 'Av. Juárez 12, Centro',
    },
    {
      id_usuario: 2,
      nombre: 'Carmen',
      apellido_p: 'Hernández',
      apellido_m: 'Ríos',
      email: 'anfitrion@sierragorda.mx',
      telefono: '4418765432',
      password: 'Host1234',
      rol: 'anfitrion',
      estado: 'activo',
      foto: '',
      direccion: 'Carretera a Concá Km 3, Arroyo Seco',
    },
    {
      id_usuario: 3,
      nombre: 'Luis',
      apellido_p: 'Pérez',
      apellido_m: 'García',
      email: 'usuario@sierragorda.mx',
      telefono: '4429876543',
      password: 'User1234',
      rol: 'usuario',
      estado: 'activo',
      foto: '',
      direccion: 'Calle Hidalgo 45, Jalpan de Serra',
    },
    {
      id_usuario: 4,
      nombre: 'María',
      apellido_p: 'Torres',
      apellido_m: 'Luna',
      email: 'maria@example.com',
      telefono: '4411230099',
      password: 'Maria123',
      rol: 'usuario',
      estado: 'activo',
      foto: '',
      direccion: '',
    },
  ],
  hotels: [
    {
      id_hosteleria: 1,
      id_anfitrion: 2,
      nombre: 'Cabaña Río Azul',
      descripcion: 'Cabaña rústica a orillas del río Ayutla, ideal para desconectarte y disfrutar de la naturaleza en la Sierra Gorda.',
      precio_por_noche: 1450,
      habitaciones: 2,
      banos: 1,
      capacidad: 4,
      image: IMG.lago,
      estado: 'activo',
      direcciones: { ...direccionBase('Camino al río', 's/n', 'Rancho Nuevo'), ciudad: 'Jalpan de Serra' },
      direccion: { ...direccionBase('Camino al río', 's/n', 'Rancho Nuevo'), ciudad: 'Jalpan de Serra' },
    },
    {
      id_hosteleria: 2,
      id_anfitrion: 2,
      nombre: 'Cabaña Mirador del Cielo',
      descripcion: 'Vistas espectaculares a la Sierra Gorda con terraza panorámica, chimenea y estancia climatizada.',
      precio_por_noche: 1850,
      habitaciones: 3,
      banos: 2,
      capacidad: 6,
      image: IMG.cabana,
      estado: 'activo',
      direcciones: { ...direccionBase('Camino al mirador', 'km 5', 'La Ciénega'), ciudad: 'Pinal de Amoles' },
      direccion: { ...direccionBase('Camino al mirador', 'km 5', 'La Ciénega'), ciudad: 'Pinal de Amoles' },
    },
    {
      id_hosteleria: 3,
      id_anfitrion: 2,
      nombre: 'Hotel Boutique Hacienda La Loma',
      descripcion: 'Hotel boutique con piscina, restaurante regional y jacuzzi al aire libre frente al cañón del río Santa María.',
      precio_por_noche: 2600,
      habitaciones: 4,
      banos: 4,
      capacidad: 8,
      image: IMG.hotel,
      estado: 'activo',
      direcciones: { ...direccionBase('Carretera federal 69', 'km 178', 'La Loma'), ciudad: 'Jalpan de Serra' },
      direccion: { ...direccionBase('Carretera federal 69', 'km 178', 'La Loma'), ciudad: 'Jalpan de Serra' },
    },
    {
      id_hosteleria: 4,
      id_anfitrion: 2,
      nombre: 'Cabaña Los Ríos',
      descripcion: 'Frente a los manantiales de Concá, con fogata, hamacas y acceso directo al río para nadar.',
      precio_por_noche: 1200,
      habitaciones: 2,
      banos: 1,
      capacidad: 4,
      image: IMG.rio,
      estado: 'activo',
      direcciones: { ...direccionBase('Camino a Concá', 's/n', 'Puerto de San Nicolás') },
      direccion: { ...direccionBase('Camino a Concá', 's/n', 'Puerto de San Nicolás') },
    },
  ],
  experiences: [
    {
      id_experiencia: 1,
      id_anfitrion: 2,
      titulo: 'Camino al Puente de Dios',
      descripcion: 'Caminata guiada al Puente de Dios con paso por pozas cristalinas, narración de la leyenda y tiempo para nadar.',
      precio: 750,
      calificacion: 4.8,
      reviews: 12,
      image: IMG.bosque,
      duracion: '4 horas',
      tipo_experiencia: 'Aventura',
      capacidad: 12,
      estado: 'activo',
      fecha_experiencia: add(new Date(), 12),
      direcciones: { ciudad: 'Jalpan de Serra', estado: 'Querétaro' },
      punto_encuentro: 'Entrada del Parque, Jalpan de Serra',
      idioma: 'Español',
      dificultad: 'Media',
      incluye: ['Guía certificado', 'Seguro de viajero', 'Snacks regionales', 'Traslado desde Jalpan'],
    },
    {
      id_experiencia: 2,
      id_anfitrion: 2,
      titulo: 'Tour a las Grutas de Los Herrera',
      descripcion: 'Recorrido interpretativo por las grutas con estalactitas y estalagmitas, explicación geológica e historia local.',
      precio: 550,
      calificacion: 4.6,
      reviews: 8,
      image: IMG.camino,
      duracion: '3 horas',
      tipo_experiencia: 'Cultural',
      capacidad: 20,
      estado: 'activo',
      fecha_experiencia: add(new Date(), 9),
      direcciones: { ciudad: 'Arroyo Seco', estado: 'Querétaro' },
      punto_encuentro: 'Plaza Principal de Arroyo Seco',
      idioma: 'Español',
      dificultad: 'Baja',
      incluye: ['Guía local', 'Entrada a las grutas', 'Lámparas de casco'],
    },
    {
      id_experiencia: 3,
      id_anfitrion: 2,
      titulo: 'Tirolesa y Rappel Cañón del Santa María',
      descripcion: 'Adrenalina pura: 7 tirolesas sobre el cañón y rappel de 40 metros con vistas inigualables.',
      precio: 900,
      calificacion: 4.9,
      reviews: 21,
      image: IMG.montana,
      duracion: '5 horas',
      tipo_experiencia: 'Aventura',
      capacidad: 8,
      estado: 'activo',
      fecha_experiencia: add(new Date(), 15),
      direcciones: { ciudad: 'Arroyo Seco', estado: 'Querétaro' },
      punto_encuentro: 'Hotel Hacienda La Loma',
      idioma: 'Español',
      dificultad: 'Alta',
      incluye: ['Equipo completo certificado', 'Guías especializados', 'Fotos y video', 'Botiquín'],
    },
  ],
  bookings: [
    {
      reserva: {
        id_reserva: 1,
        id_usuario: 3,
        id_hosteleria: 1,
        id_experiencia: null,
        id_anfitrion: 2,
        fecha_inicio: add(new Date(), -30),
        fecha_fin: add(new Date(), -27),
        fecha: null,
        personas: 2,
        participantes: null,
        estado: 'completada',
        precio_total: 4350,
        tipo_reserva: 'hosteleria',
      },
      usuario: {
        id_usuario: 3,
        nombre: 'Luis',
        email: 'usuario@sierragorda.mx',
      },
      establecimiento: {
        id_hosteleria: 1,
        nombre: 'Cabaña Río Azul',
        image: IMG.lago,
        precio_por_noche: 1450,
        direccion: { ...direccionBase('Camino al río', 's/n', 'Rancho Nuevo'), ciudad: 'Jalpan de Serra' },
      },
      anfitrion: {
        id_usuario: 2,
        nombre: 'Carmen Hernández',
        email: 'anfitrion@sierragorda.mx',
        telefono: '4418765432',
      },
      experiencia: null,
    },
    {
      reserva: {
        id_reserva: 2,
        id_usuario: 3,
        id_hosteleria: 2,
        id_experiencia: null,
        id_anfitrion: 2,
        fecha_inicio: add(new Date(), 18),
        fecha_fin: add(new Date(), 20),
        fecha: null,
        personas: 2,
        participantes: null,
        estado: 'confirmada',
        precio_total: 3700,
        tipo_reserva: 'hosteleria',
      },
      usuario: {
        id_usuario: 3,
        nombre: 'Luis',
        email: 'usuario@sierragorda.mx',
      },
      establecimiento: {
        id_hosteleria: 2,
        nombre: 'Cabaña Mirador del Cielo',
        image: IMG.cabana,
        precio_por_noche: 1850,
        direccion: { ...direccionBase('Camino al mirador', 'km 5', 'La Ciénega'), ciudad: 'Pinal de Amoles' },
      },
      anfitrion: {
        id_usuario: 2,
        nombre: 'Carmen Hernández',
        email: 'anfitrion@sierragorda.mx',
        telefono: '4418765432',
      },
      experiencia: null,
    },
    {
      reserva: {
        id_reserva: 3,
        id_usuario: 3,
        id_hosteleria: null,
        id_experiencia: 2,
        id_anfitrion: 2,
        fecha_inicio: add(new Date(), 9),
        fecha_fin: null,
        fecha: add(new Date(), 9),
        personas: 4,
        participantes: 4,
        estado: 'confirmada',
        precio_total: 2200,
        tipo_reserva: 'experiencia',
      },
      usuario: {
        id_usuario: 3,
        nombre: 'Luis',
        email: 'usuario@sierragorda.mx',
      },
      establecimiento: null,
      anfitrion: null,
      experiencia: {
        id_experiencia: 2,
        titulo: 'Tour a las Grutas de Los Herrera',
        image: IMG.camino,
        precio: 550,
        fecha_experiencia: add(new Date(), 9),
        anfitrion: {
          id_usuario: 2,
          nombre: 'Carmen Hernández',
          email: 'anfitrion@sierragorda.mx',
          telefono: '4418765432',
        },
      },
    },
    {
      reserva: {
        id_reserva: 4,
        id_usuario: 3,
        id_hosteleria: 3,
        id_experiencia: null,
        id_anfitrion: 2,
        fecha_inicio: add(new Date(), 25),
        fecha_fin: add(new Date(), 27),
        fecha: null,
        personas: 3,
        participantes: null,
        estado: 'pendiente',
        precio_total: 5200,
        tipo_reserva: 'hosteleria',
      },
      usuario: {
        id_usuario: 3,
        nombre: 'Luis',
        email: 'usuario@sierragorda.mx',
      },
      establecimiento: {
        id_hosteleria: 3,
        nombre: 'Hotel Boutique Hacienda La Loma',
        image: IMG.hotel,
        precio_por_noche: 2600,
        direccion: { ...direccionBase('Carretera federal 69', 'km 178', 'La Loma'), ciudad: 'Jalpan de Serra' },
      },
      anfitrion: {
        id_usuario: 2,
        nombre: 'Carmen Hernández',
        email: 'anfitrion@sierragorda.mx',
        telefono: '4418765432',
      },
      experiencia: null,
    },
  ],
  reviews: [
    {
      id_calificacion: 1,
      id_reserva: 1,
      id_usuario: 3,
      nombre_usuario: 'Luis Pérez',
      id_hosteleria: 1,
      id_experiencia: null,
      calificacion: 5,
      comentario: 'Hermosa cabaña, sonido del río toda la noche y atención increíble. Volveremos pronto.',
      fecha_reseña: add(new Date(), -25),
    },
    {
      id_calificacion: 2,
      id_usuario: 4,
      nombre_usuario: 'María Torres',
      id_hosteleria: 1,
      id_experiencia: null,
      calificacion: 4,
      comentario: 'Muy bonita, solo faltó más leña para la fogata. El resto excelente.',
      fecha_reseña: add(new Date(), -20),
    },
    {
      id_calificacion: 3,
      id_usuario: 4,
      nombre_usuario: 'María Torres',
      id_hosteleria: 2,
      id_experiencia: null,
      calificacion: 5,
      comentario: 'La vista al amanecer es de otro mundo. Terraza panorámica muy recomendable.',
      fecha_reseña: add(new Date(), -10),
    },
    {
      id_calificacion: 4,
      id_usuario: 4,
      nombre_usuario: 'María Torres',
      id_hosteleria: null,
      id_experiencia: 2,
      calificacion: 5,
      comentario: 'Las grutas son impresionantes y el guía contó la historia de la región de maravilla.',
      fecha_reseña: add(new Date(), -6),
    },
  ],
  payments: [
    {
      id_pago: 1,
      id_reserva: 1,
      id_usuario: 3,
      monto: 4350,
      metodo: 'card',
      estado: 'completado',
      fecha_pago: add(new Date(), -30),
      detalles: { method: 'card' },
    },
    {
      id_pago: 2,
      id_reserva: 2,
      id_usuario: 3,
      monto: 3700,
      metodo: 'card',
      estado: 'completado',
      fecha_pago: add(new Date(), -1),
      detalles: { method: 'card' },
    },
    {
      id_pago: 3,
      id_reserva: 3,
      id_usuario: 3,
      monto: 2200,
      metodo: 'transfer',
      estado: 'completado',
      fecha_pago: add(new Date(), 0),
      detalles: { method: 'transfer' },
    },
  ],
});

let cache = null;

export function loadDb() {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      cache = JSON.parse(raw);
      if (cache && Array.isArray(cache.users)) return cache;
    }
  } catch (_err) {
    void _err;
  }
  cache = seed();
  saveDb();
  return cache;
}

export function saveDb() {
  if (!cache) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error('No se pudo guardar la base demo:', e);
  }
}

export function resetDb() {
  cache = seed();
  saveDb();
  return cache;
}

export function nextId(list, key = 'id') {
  return list.reduce((max, item) => Math.max(max, item[key] || 0), 0) + 1;
}

export function nextReservaId() {
  return cache.bookings.reduce((max, b) => Math.max(max, b.reserva.id_reserva || 0), 0) + 1;
}

export function publicUser(user) {
  if (!user) return null;
  const { password: _password, ...rest } = user;
  return rest;
}