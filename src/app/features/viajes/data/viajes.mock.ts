import { Viaje } from '../models/viaje.model';

// Referencia de fechas (mock fijo al 2026-07-01 como "hoy")
// Esta semana (ISO Lun-Dom): Jun 29 – Jul 5
// Este mes (últimos 30 días): Jun 1 – Jul 1

export const VIAJES_MOCK: Viaje[] = [

  // ── Mié 1 Jul ── D4G-821 ─────────────────────
  {
    id: '1',
    placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.1,
    puntoA: { label: 'A', direccion: 'Av. Javier Prado Este 4200, Surco',    fecha: new Date('2026-07-01T08:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Argentina 3093, Callao',           fecha: new Date('2026-07-01T10:00:00') },
    duracion: '1h 55m', distanciaKm: 32, precio: 210.00, fechaViaje: new Date('2026-07-01'),
  },
  {
    id: '13',
    placa: 'D4G-821', codigoMotor: '2847391020', rating: 3.9,
    puntoA: { label: 'A', direccion: 'Av. Argentina 3093, Callao',           fecha: new Date('2026-07-01T11:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Nicolás Ayllón 2408, Ate',        fecha: new Date('2026-07-01T12:30:00') },
    duracion: '1h 30m', distanciaKm: 24, precio: 165.00, fechaViaje: new Date('2026-07-01'),
  },
  {
    id: '14',
    placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.4,
    puntoA: { label: 'A', direccion: 'Av. Nicolás Ayllón 2408, Ate',        fecha: new Date('2026-07-01T14:00:00') },
    puntoB: { label: 'B', direccion: 'Av. República de Panamá 3055, San Isidro', fecha: new Date('2026-07-01T15:20:00') },
    duracion: '1h 20m', distanciaKm: 18, precio: 142.00, fechaViaje: new Date('2026-07-01'),
  },

  // ── Mié 1 Jul ── H2P-783 ─────────────────────
  {
    id: '15',
    placa: 'H2P-783', codigoMotor: '3318927401', rating: 4.7,
    puntoA: { label: 'A', direccion: 'Av. Separadora Industrial 2450, Ate', fecha: new Date('2026-07-01T07:00:00') },
    puntoB: { label: 'B', direccion: 'Calle Los Ingenieros 480, La Molina', fecha: new Date('2026-07-01T09:10:00') },
    duracion: '2h 10m', distanciaKm: 19, precio: 155.00, fechaViaje: new Date('2026-07-01'),
  },
  {
    id: '2',
    placa: 'H2P-783', codigoMotor: '3318927401', rating: 4.8,
    puntoA: { label: 'A', direccion: 'Calle Los Ingenieros 480, La Molina', fecha: new Date('2026-07-01T13:30:00') },
    puntoB: { label: 'B', direccion: 'Av. Industrial 2340, Breña',          fecha: new Date('2026-07-01T15:45:00') },
    duracion: '2h 15m', distanciaKm: 38, precio: 265.00, fechaViaje: new Date('2026-07-01'),
  },
  {
    id: '16',
    placa: 'H2P-783', codigoMotor: '3318927401', rating: 4.5,
    puntoA: { label: 'A', direccion: 'Av. Industrial 2340, Breña',          fecha: new Date('2026-07-01T17:00:00') },
    puntoB: { label: 'B', direccion: 'Av. San Borja Norte 952, San Borja',  fecha: new Date('2026-07-01T18:30:00') },
    duracion: '1h 30m', distanciaKm: 21, precio: 160.00, fechaViaje: new Date('2026-07-01'),
  },

  // ── Mié 1 Jul ── C9B-447 ─────────────────────
  {
    id: '17',
    placa: 'C9B-447', codigoMotor: '0934127856', rating: 3.8,
    puntoA: { label: 'A', direccion: 'Av. Néstor Gambetta 3500, Callao',    fecha: new Date('2026-07-01T07:30:00') },
    puntoB: { label: 'B', direccion: 'Av. República de Panamá 3055, San Isidro', fecha: new Date('2026-07-01T09:30:00') },
    duracion: '2h 00m', distanciaKm: 31, precio: 210.00, fechaViaje: new Date('2026-07-01'),
  },
  {
    id: '18',
    placa: 'C9B-447', codigoMotor: '0934127856', rating: 3.3,
    puntoA: { label: 'A', direccion: 'Av. República de Panamá 3055, San Isidro', fecha: new Date('2026-07-01T11:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Túpac Amaru 3100, Comas',         fecha: new Date('2026-07-01T13:30:00') },
    duracion: '2h 30m', distanciaKm: 35, precio: 235.00, fechaViaje: new Date('2026-07-01'),
  },
  {
    id: '3',
    placa: 'C9B-447', codigoMotor: '0934127856', rating: 3.5,
    puntoA: { label: 'A', direccion: 'Av. República de Panamá 3055, San Isidro', fecha: new Date('2026-07-01T15:10:00') },
    puntoB: { label: 'B', direccion: 'Av. Universitaria 1801, Los Olivos',  fecha: new Date('2026-07-01T17:00:00') },
    duracion: '1h 50m', distanciaKm: 23, precio: 175.00, fechaViaje: new Date('2026-07-01'),
  },

  // ── Mar 30 Jun ── F7K-392 ─────────────────────
  {
    id: '19',
    placa: 'F7K-392', codigoMotor: '1293847562', rating: 3.5,
    puntoA: { label: 'A', direccion: 'Av. El Sol 1050, La Molina',          fecha: new Date('2026-06-30T07:30:00') },
    puntoB: { label: 'B', direccion: 'Av. Alfredo Benavides 3866, Miraflores', fecha: new Date('2026-06-30T09:30:00') },
    duracion: '2h 00m', distanciaKm: 22, precio: 168.00, fechaViaje: new Date('2026-06-30'),
  },
  {
    id: '4',
    placa: 'F7K-392', codigoMotor: '1293847562', rating: 2.8,
    puntoA: { label: 'A', direccion: 'Av. Tomás Marsano 2800, Surquillo',   fecha: new Date('2026-06-30T12:45:00') },
    puntoB: { label: 'B', direccion: 'Av. Nicolás Ayllón 2408, Ate',        fecha: new Date('2026-06-30T14:30:00') },
    duracion: '1h 45m', distanciaKm: 28, precio: 185.00, fechaViaje: new Date('2026-06-30'),
  },
  {
    id: '20',
    placa: 'F7K-392', codigoMotor: '1293847562', rating: 4.0,
    puntoA: { label: 'A', direccion: 'Av. Nicolás Ayllón 2408, Ate',        fecha: new Date('2026-06-30T16:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Tomás Marsano 2800, Surquillo',   fecha: new Date('2026-06-30T17:30:00') },
    duracion: '1h 30m', distanciaKm: 17, precio: 130.00, fechaViaje: new Date('2026-06-30'),
  },

  // ── Mar 30 Jun ── A3M-156 ─────────────────────
  {
    id: '5',
    placa: 'A3M-156', codigoMotor: '5521034891', rating: 3.7,
    puntoA: { label: 'A', direccion: 'Av. Los Frutales 390, Ate Vitarte',   fecha: new Date('2026-06-30T07:30:00') },
    puntoB: { label: 'B', direccion: 'Prolongación Huaylas 340, Chorrillos', fecha: new Date('2026-06-30T09:15:00') },
    duracion: '1h 45m', distanciaKm: 41, precio: 245.50, fechaViaje: new Date('2026-06-30'),
  },
  {
    id: '21',
    placa: 'A3M-156', codigoMotor: '5521034891', rating: 4.1,
    puntoA: { label: 'A', direccion: 'Prolongación Huaylas 340, Chorrillos', fecha: new Date('2026-06-30T11:00:00') },
    puntoB: { label: 'B', direccion: 'Av. República de Panamá 3055, San Isidro', fecha: new Date('2026-06-30T12:45:00') },
    duracion: '1h 45m', distanciaKm: 27, precio: 188.00, fechaViaje: new Date('2026-06-30'),
  },
  {
    id: '22',
    placa: 'A3M-156', codigoMotor: '5521034891', rating: 3.6,
    puntoA: { label: 'A', direccion: 'Av. República de Panamá 3055, San Isidro', fecha: new Date('2026-06-30T14:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Néstor Gambetta 3500, Callao',    fecha: new Date('2026-06-30T15:30:00') },
    duracion: '1h 30m', distanciaKm: 22, precio: 162.00, fechaViaje: new Date('2026-06-30'),
  },

  // ── Lun 29 Jun ── B5T-219 ─────────────────────
  {
    id: '6',
    placa: 'B5T-219', codigoMotor: '7762019345', rating: 4.3,
    puntoA: { label: 'A', direccion: 'Av. Alfredo Benavides 3866, Miraflores', fecha: new Date('2026-06-29T08:45:00') },
    puntoB: { label: 'B', direccion: 'Av. Próceres de la Independencia 1580, SJL', fecha: new Date('2026-06-29T11:00:00') },
    duracion: '2h 15m', distanciaKm: 47, precio: 310.00, fechaViaje: new Date('2026-06-29'),
  },
  {
    id: '23',
    placa: 'B5T-219', codigoMotor: '7762019345', rating: 4.0,
    puntoA: { label: 'A', direccion: 'Av. Próceres de la Independencia 1580, SJL', fecha: new Date('2026-06-29T12:30:00') },
    puntoB: { label: 'B', direccion: 'Av. Néstor Gambetta 3500, Callao',    fecha: new Date('2026-06-29T14:30:00') },
    duracion: '2h 00m', distanciaKm: 36, precio: 245.00, fechaViaje: new Date('2026-06-29'),
  },
  {
    id: '24',
    placa: 'B5T-219', codigoMotor: '7762019345', rating: 4.5,
    puntoA: { label: 'A', direccion: 'Av. Néstor Gambetta 3500, Callao',    fecha: new Date('2026-06-29T16:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Separadora Industrial 2450, Ate', fecha: new Date('2026-06-29T17:30:00') },
    duracion: '1h 30m', distanciaKm: 29, precio: 198.00, fechaViaje: new Date('2026-06-29'),
  },

  // ── Lun 29 Jun ── M8V-064 ─────────────────────
  {
    id: '25',
    placa: 'M8V-064', codigoMotor: '4481673920', rating: 4.7,
    puntoA: { label: 'A', direccion: 'Av. Separadora Industrial 2450, Ate', fecha: new Date('2026-06-29T07:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Alfredo Benavides 3866, Miraflores', fecha: new Date('2026-06-29T09:30:00') },
    duracion: '2h 30m', distanciaKm: 31, precio: 212.00, fechaViaje: new Date('2026-06-29'),
  },
  {
    id: '26',
    placa: 'M8V-064', codigoMotor: '4481673920', rating: 4.8,
    puntoA: { label: 'A', direccion: 'Av. Alfredo Benavides 3866, Miraflores', fecha: new Date('2026-06-29T10:30:00') },
    puntoB: { label: 'B', direccion: 'Av. Naranjal 890, Independencia',     fecha: new Date('2026-06-29T12:30:00') },
    duracion: '2h 00m', distanciaKm: 28, precio: 192.00, fechaViaje: new Date('2026-06-29'),
  },
  {
    id: '7',
    placa: 'M8V-064', codigoMotor: '4481673920', rating: 4.9,
    puntoA: { label: 'A', direccion: 'Calle Schell 391, Miraflores',        fecha: new Date('2026-06-29T14:05:00') },
    puntoB: { label: 'B', direccion: 'Av. Naranjal 890, Independencia',     fecha: new Date('2026-06-29T16:20:00') },
    duracion: '2h 15m', distanciaKm: 34, precio: 228.00, fechaViaje: new Date('2026-06-29'),
  },

  // ── Vie 26 Jun ── P1L-935 ─────────────────────
  {
    id: '8',
    placa: 'P1L-935', codigoMotor: '2109584736', rating: 4.6,
    puntoA: { label: 'A', direccion: 'Av. Separadora Industrial 2450, Ate', fecha: new Date('2026-06-26T05:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Néstor Gambetta 3500, Callao',    fecha: new Date('2026-06-26T07:15:00') },
    duracion: '2h 15m', distanciaKm: 52, precio: 340.00, fechaViaje: new Date('2026-06-26'),
  },
  {
    id: '27',
    placa: 'P1L-935', codigoMotor: '2109584736', rating: 4.3,
    puntoA: { label: 'A', direccion: 'Av. Néstor Gambetta 3500, Callao',    fecha: new Date('2026-06-26T08:30:00') },
    puntoB: { label: 'B', direccion: 'Av. El Sol 1050, La Molina',          fecha: new Date('2026-06-26T10:30:00') },
    duracion: '2h 00m', distanciaKm: 48, precio: 318.00, fechaViaje: new Date('2026-06-26'),
  },
  {
    id: '28',
    placa: 'P1L-935', codigoMotor: '2109584736', rating: 4.8,
    puntoA: { label: 'A', direccion: 'Av. El Sol 1050, La Molina',          fecha: new Date('2026-06-26T14:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Separadora Industrial 2450, Ate', fecha: new Date('2026-06-26T16:00:00') },
    duracion: '2h 00m', distanciaKm: 22, precio: 175.00, fechaViaje: new Date('2026-06-26'),
  },

  // ── Vie 26 Jun ── D4G-821 ─────────────────────
  {
    id: '29',
    placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.2,
    puntoA: { label: 'A', direccion: 'Av. República de Panamá 3055, San Isidro', fecha: new Date('2026-06-26T07:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Angamos Este 1600, Surquillo',    fecha: new Date('2026-06-26T08:30:00') },
    duracion: '1h 30m', distanciaKm: 12, precio: 98.00, fechaViaje: new Date('2026-06-26'),
  },
  {
    id: '9',
    placa: 'D4G-821', codigoMotor: '2847391020', rating: 3.2,
    puntoA: { label: 'A', direccion: 'Av. Angamos Este 1600, Surquillo',    fecha: new Date('2026-06-26T12:10:00') },
    puntoB: { label: 'B', direccion: 'Jr. Lampa 1035, Lima Cercado',        fecha: new Date('2026-06-26T13:40:00') },
    duracion: '1h 30m', distanciaKm: 15, precio: 120.00, fechaViaje: new Date('2026-06-26'),
  },
  {
    id: '30',
    placa: 'D4G-821', codigoMotor: '2847391020', rating: 3.8,
    puntoA: { label: 'A', direccion: 'Jr. Lampa 1035, Lima Cercado',        fecha: new Date('2026-06-26T15:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Alfredo Benavides 3866, Miraflores', fecha: new Date('2026-06-26T16:30:00') },
    duracion: '1h 30m', distanciaKm: 14, precio: 112.00, fechaViaje: new Date('2026-06-26'),
  },

  // ── D4G-821 · 25 días adicionales (Jun 25 → May 28) ─────────────

  // Jue 25 Jun
  { id: '31', placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.5,
    puntoA: { label: 'A', direccion: 'Av. Javier Prado Este 4200, Surco',         fecha: new Date('2026-06-25T07:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Argentina 3093, Callao',                fecha: new Date('2026-06-25T09:10:00') },
    duracion: '2h 10m', distanciaKm: 38, precio: 255.00, fechaViaje: new Date('2026-06-25') },
  { id: '32', placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.2,
    puntoA: { label: 'A', direccion: 'Av. Argentina 3093, Callao',                fecha: new Date('2026-06-25T13:00:00') },
    puntoB: { label: 'B', direccion: 'Av. San Borja Norte 952, San Borja',        fecha: new Date('2026-06-25T15:20:00') },
    duracion: '2h 20m', distanciaKm: 29, precio: 195.00, fechaViaje: new Date('2026-06-25') },

  // Mié 24 Jun
  { id: '33', placa: 'D4G-821', codigoMotor: '2847391020', rating: 3.7,
    puntoA: { label: 'A', direccion: 'Av. Separadora Industrial 2450, Ate',       fecha: new Date('2026-06-24T06:30:00') },
    puntoB: { label: 'B', direccion: 'Av. Túpac Amaru 3100, Comas',              fecha: new Date('2026-06-24T09:00:00') },
    duracion: '2h 30m', distanciaKm: 44, precio: 290.00, fechaViaje: new Date('2026-06-24') },
  { id: '34', placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.0,
    puntoA: { label: 'A', direccion: 'Av. Túpac Amaru 3100, Comas',              fecha: new Date('2026-06-24T14:00:00') },
    puntoB: { label: 'B', direccion: 'Av. República de Panamá 3055, San Isidro', fecha: new Date('2026-06-24T16:00:00') },
    duracion: '2h 00m', distanciaKm: 36, precio: 240.00, fechaViaje: new Date('2026-06-24') },

  // Mar 23 Jun
  { id: '35', placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.6,
    puntoA: { label: 'A', direccion: 'Av. El Sol 1050, La Molina',               fecha: new Date('2026-06-23T07:30:00') },
    puntoB: { label: 'B', direccion: 'Av. Néstor Gambetta 3500, Callao',         fecha: new Date('2026-06-23T10:00:00') },
    duracion: '2h 30m', distanciaKm: 52, precio: 345.00, fechaViaje: new Date('2026-06-23') },
  { id: '36', placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.3,
    puntoA: { label: 'A', direccion: 'Av. Néstor Gambetta 3500, Callao',         fecha: new Date('2026-06-23T15:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Alfredo Benavides 3866, Miraflores',   fecha: new Date('2026-06-23T17:30:00') },
    duracion: '2h 30m', distanciaKm: 41, precio: 278.00, fechaViaje: new Date('2026-06-23') },

  // Lun 22 Jun
  { id: '37', placa: 'D4G-821', codigoMotor: '2847391020', rating: 3.5,
    puntoA: { label: 'A', direccion: 'Av. Nicolás Ayllón 2408, Ate',             fecha: new Date('2026-06-22T08:00:00') },
    puntoB: { label: 'B', direccion: 'Jr. Lampa 1035, Lima Cercado',             fecha: new Date('2026-06-22T09:45:00') },
    duracion: '1h 45m', distanciaKm: 22, precio: 148.00, fechaViaje: new Date('2026-06-22') },
  { id: '38', placa: 'D4G-821', codigoMotor: '2847391020', rating: 3.9,
    puntoA: { label: 'A', direccion: 'Jr. Lampa 1035, Lima Cercado',             fecha: new Date('2026-06-22T12:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Universitaria 1801, Los Olivos',       fecha: new Date('2026-06-22T14:00:00') },
    duracion: '2h 00m', distanciaKm: 31, precio: 208.00, fechaViaje: new Date('2026-06-22') },

  // Dom 21 Jun
  { id: '39', placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.8,
    puntoA: { label: 'A', direccion: 'Av. Naranjal 890, Independencia',          fecha: new Date('2026-06-21T07:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Industrial 2340, Breña',               fecha: new Date('2026-06-21T08:30:00') },
    duracion: '1h 30m', distanciaKm: 18, precio: 122.00, fechaViaje: new Date('2026-06-21') },
  { id: '40', placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.6,
    puntoA: { label: 'A', direccion: 'Av. Industrial 2340, Breña',               fecha: new Date('2026-06-21T11:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Tomás Marsano 2800, Surquillo',        fecha: new Date('2026-06-21T13:00:00') },
    duracion: '2h 00m', distanciaKm: 27, precio: 182.00, fechaViaje: new Date('2026-06-21') },

  // Sáb 20 Jun
  { id: '41', placa: 'D4G-821', codigoMotor: '2847391020', rating: 3.8,
    puntoA: { label: 'A', direccion: 'Av. Petit Thouars 4550, Miraflores',       fecha: new Date('2026-06-20T09:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Próceres de la Independencia 1580, SJL', fecha: new Date('2026-06-20T11:30:00') },
    duracion: '2h 30m', distanciaKm: 48, precio: 318.00, fechaViaje: new Date('2026-06-20') },
  { id: '42', placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.1,
    puntoA: { label: 'A', direccion: 'Av. Próceres de la Independencia 1580, SJL', fecha: new Date('2026-06-20T15:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Javier Prado Este 4200, Surco',        fecha: new Date('2026-06-20T17:00:00') },
    duracion: '2h 00m', distanciaKm: 39, precio: 260.00, fechaViaje: new Date('2026-06-20') },

  // Vie 19 Jun
  { id: '43', placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.4,
    puntoA: { label: 'A', direccion: 'Av. La Marina 2100, San Miguel',           fecha: new Date('2026-06-19T06:00:00') },
    puntoB: { label: 'B', direccion: 'Av. El Sol 1050, La Molina',               fecha: new Date('2026-06-19T08:30:00') },
    duracion: '2h 30m', distanciaKm: 43, precio: 285.00, fechaViaje: new Date('2026-06-19') },
  { id: '44', placa: 'D4G-821', codigoMotor: '2847391020', rating: 3.6,
    puntoA: { label: 'A', direccion: 'Av. El Sol 1050, La Molina',               fecha: new Date('2026-06-19T13:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Colonial 1250, Lima Cercado',          fecha: new Date('2026-06-19T15:00:00') },
    duracion: '2h 00m', distanciaKm: 35, precio: 233.00, fechaViaje: new Date('2026-06-19') },

  // Jue 18 Jun
  { id: '45', placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.7,
    puntoA: { label: 'A', direccion: 'Av. Santa Rosa 1200, Los Olivos',          fecha: new Date('2026-06-18T07:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Angamos Este 1600, Surquillo',         fecha: new Date('2026-06-18T09:30:00') },
    duracion: '2h 30m', distanciaKm: 46, precio: 308.00, fechaViaje: new Date('2026-06-18') },
  { id: '46', placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.2,
    puntoA: { label: 'A', direccion: 'Av. Angamos Este 1600, Surquillo',         fecha: new Date('2026-06-18T14:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Los Frutales 390, Ate Vitarte',        fecha: new Date('2026-06-18T15:45:00') },
    duracion: '1h 45m', distanciaKm: 24, precio: 162.00, fechaViaje: new Date('2026-06-18') },

  // Mié 17 Jun
  { id: '47', placa: 'D4G-821', codigoMotor: '2847391020', rating: 3.4,
    puntoA: { label: 'A', direccion: 'Calle Schell 391, Miraflores',             fecha: new Date('2026-06-17T08:30:00') },
    puntoB: { label: 'B', direccion: 'Av. Separadora Industrial 2450, Ate',      fecha: new Date('2026-06-17T10:30:00') },
    duracion: '2h 00m', distanciaKm: 33, precio: 220.00, fechaViaje: new Date('2026-06-17') },
  { id: '48', placa: 'D4G-821', codigoMotor: '2847391020', rating: 3.9,
    puntoA: { label: 'A', direccion: 'Av. Separadora Industrial 2450, Ate',      fecha: new Date('2026-06-17T13:30:00') },
    puntoB: { label: 'B', direccion: 'Av. República de Panamá 3055, San Isidro', fecha: new Date('2026-06-17T15:00:00') },
    duracion: '1h 30m', distanciaKm: 21, precio: 140.00, fechaViaje: new Date('2026-06-17') },

  // Mar 16 Jun
  { id: '49', placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.9,
    puntoA: { label: 'A', direccion: 'Av. Universitaria 1801, Los Olivos',       fecha: new Date('2026-06-16T07:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Néstor Gambetta 3500, Callao',         fecha: new Date('2026-06-16T09:00:00') },
    duracion: '2h 00m', distanciaKm: 37, precio: 248.00, fechaViaje: new Date('2026-06-16') },
  { id: '50', placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.5,
    puntoA: { label: 'A', direccion: 'Av. Néstor Gambetta 3500, Callao',         fecha: new Date('2026-06-16T14:00:00') },
    puntoB: { label: 'B', direccion: 'Av. San Borja Norte 952, San Borja',       fecha: new Date('2026-06-16T16:30:00') },
    duracion: '2h 30m', distanciaKm: 42, precio: 282.00, fechaViaje: new Date('2026-06-16') },

  // Lun 15 Jun
  { id: '51', placa: 'D4G-821', codigoMotor: '2847391020', rating: 3.6,
    puntoA: { label: 'A', direccion: 'Av. Alfredo Benavides 3866, Miraflores',   fecha: new Date('2026-06-15T06:30:00') },
    puntoB: { label: 'B', direccion: 'Av. Túpac Amaru 3100, Comas',              fecha: new Date('2026-06-15T09:00:00') },
    duracion: '2h 30m', distanciaKm: 49, precio: 325.00, fechaViaje: new Date('2026-06-15') },
  { id: '52', placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.0,
    puntoA: { label: 'A', direccion: 'Av. Túpac Amaru 3100, Comas',              fecha: new Date('2026-06-15T13:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Javier Prado Este 4200, Surco',        fecha: new Date('2026-06-15T15:30:00') },
    duracion: '2h 30m', distanciaKm: 45, precio: 300.00, fechaViaje: new Date('2026-06-15') },

  // Sáb 13 Jun
  { id: '53', placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.3,
    puntoA: { label: 'A', direccion: 'Av. Argentina 3093, Callao',               fecha: new Date('2026-06-13T08:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Los Frutales 390, Ate Vitarte',        fecha: new Date('2026-06-13T10:30:00') },
    duracion: '2h 30m', distanciaKm: 51, precio: 338.00, fechaViaje: new Date('2026-06-13') },
  { id: '54', placa: 'D4G-821', codigoMotor: '2847391020', rating: 3.8,
    puntoA: { label: 'A', direccion: 'Av. Los Frutales 390, Ate Vitarte',        fecha: new Date('2026-06-13T14:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Colonial 1250, Lima Cercado',          fecha: new Date('2026-06-13T15:30:00') },
    duracion: '1h 30m', distanciaKm: 28, precio: 188.00, fechaViaje: new Date('2026-06-13') },

  // Vie 12 Jun
  { id: '55', placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.1,
    puntoA: { label: 'A', direccion: 'Av. Tomás Marsano 2800, Surquillo',        fecha: new Date('2026-06-12T07:30:00') },
    puntoB: { label: 'B', direccion: 'Av. Próceres de la Independencia 1580, SJL', fecha: new Date('2026-06-12T09:45:00') },
    duracion: '2h 15m', distanciaKm: 40, precio: 268.00, fechaViaje: new Date('2026-06-12') },
  { id: '56', placa: 'D4G-821', codigoMotor: '2847391020', rating: 3.5,
    puntoA: { label: 'A', direccion: 'Av. Próceres de la Independencia 1580, SJL', fecha: new Date('2026-06-12T13:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Industrial 2340, Breña',               fecha: new Date('2026-06-12T14:30:00') },
    duracion: '1h 30m', distanciaKm: 22, precio: 148.00, fechaViaje: new Date('2026-06-12') },

  // Jue 11 Jun
  { id: '57', placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.7,
    puntoA: { label: 'A', direccion: 'Av. Naranjal 890, Independencia',          fecha: new Date('2026-06-11T07:00:00') },
    puntoB: { label: 'B', direccion: 'Av. El Sol 1050, La Molina',               fecha: new Date('2026-06-11T09:30:00') },
    duracion: '2h 30m', distanciaKm: 47, precio: 312.00, fechaViaje: new Date('2026-06-11') },
  { id: '58', placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.4,
    puntoA: { label: 'A', direccion: 'Av. El Sol 1050, La Molina',               fecha: new Date('2026-06-11T14:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Angamos Este 1600, Surquillo',         fecha: new Date('2026-06-11T15:30:00') },
    duracion: '1h 30m', distanciaKm: 19, precio: 128.00, fechaViaje: new Date('2026-06-11') },

  // Mié 10 Jun
  { id: '59', placa: 'D4G-821', codigoMotor: '2847391020', rating: 3.3,
    puntoA: { label: 'A', direccion: 'Av. Santa Rosa 1200, Los Olivos',          fecha: new Date('2026-06-10T08:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Nicolás Ayllón 2408, Ate',             fecha: new Date('2026-06-10T10:30:00') },
    duracion: '2h 30m', distanciaKm: 44, precio: 292.00, fechaViaje: new Date('2026-06-10') },
  { id: '60', placa: 'D4G-821', codigoMotor: '2847391020', rating: 3.7,
    puntoA: { label: 'A', direccion: 'Av. Nicolás Ayllón 2408, Ate',             fecha: new Date('2026-06-10T14:00:00') },
    puntoB: { label: 'B', direccion: 'Av. La Marina 2100, San Miguel',           fecha: new Date('2026-06-10T15:45:00') },
    duracion: '1h 45m', distanciaKm: 30, precio: 200.00, fechaViaje: new Date('2026-06-10') },

  // Mar 9 Jun
  { id: '61', placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.2,
    puntoA: { label: 'A', direccion: 'Av. Separadora Industrial 2450, Ate',      fecha: new Date('2026-06-09T06:30:00') },
    puntoB: { label: 'B', direccion: 'Jr. Lampa 1035, Lima Cercado',             fecha: new Date('2026-06-09T08:30:00') },
    duracion: '2h 00m', distanciaKm: 35, precio: 234.00, fechaViaje: new Date('2026-06-09') },
  { id: '62', placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.6,
    puntoA: { label: 'A', direccion: 'Jr. Lampa 1035, Lima Cercado',             fecha: new Date('2026-06-09T13:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Petit Thouars 4550, Miraflores',       fecha: new Date('2026-06-09T14:30:00') },
    duracion: '1h 30m', distanciaKm: 16, precio: 108.00, fechaViaje: new Date('2026-06-09') },

  // Lun 8 Jun
  { id: '63', placa: 'D4G-821', codigoMotor: '2847391020', rating: 3.9,
    puntoA: { label: 'A', direccion: 'Av. Alfredo Benavides 3866, Miraflores',   fecha: new Date('2026-06-08T07:30:00') },
    puntoB: { label: 'B', direccion: 'Av. Argentina 3093, Callao',               fecha: new Date('2026-06-08T09:30:00') },
    duracion: '2h 00m', distanciaKm: 38, precio: 254.00, fechaViaje: new Date('2026-06-08') },
  { id: '64', placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.3,
    puntoA: { label: 'A', direccion: 'Av. Argentina 3093, Callao',               fecha: new Date('2026-06-08T14:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Universitaria 1801, Los Olivos',       fecha: new Date('2026-06-08T15:30:00') },
    duracion: '1h 30m', distanciaKm: 14, precio: 95.00, fechaViaje: new Date('2026-06-08') },

  // Sáb 6 Jun
  { id: '65', placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.8,
    puntoA: { label: 'A', direccion: 'Av. Javier Prado Este 4200, Surco',        fecha: new Date('2026-06-06T08:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Néstor Gambetta 3500, Callao',         fecha: new Date('2026-06-06T10:30:00') },
    duracion: '2h 30m', distanciaKm: 53, precio: 352.00, fechaViaje: new Date('2026-06-06') },
  { id: '66', placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.5,
    puntoA: { label: 'A', direccion: 'Av. Néstor Gambetta 3500, Callao',         fecha: new Date('2026-06-06T14:30:00') },
    puntoB: { label: 'B', direccion: 'Av. San Borja Norte 952, San Borja',       fecha: new Date('2026-06-06T16:30:00') },
    duracion: '2h 00m', distanciaKm: 40, precio: 268.00, fechaViaje: new Date('2026-06-06') },

  // Vie 5 Jun
  { id: '67', placa: 'D4G-821', codigoMotor: '2847391020', rating: 3.4,
    puntoA: { label: 'A', direccion: 'Av. Túpac Amaru 3100, Comas',              fecha: new Date('2026-06-05T07:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Tomás Marsano 2800, Surquillo',        fecha: new Date('2026-06-05T09:30:00') },
    duracion: '2h 30m', distanciaKm: 46, precio: 305.00, fechaViaje: new Date('2026-06-05') },
  { id: '68', placa: 'D4G-821', codigoMotor: '2847391020', rating: 3.8,
    puntoA: { label: 'A', direccion: 'Av. Tomás Marsano 2800, Surquillo',        fecha: new Date('2026-06-05T13:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Los Frutales 390, Ate Vitarte',        fecha: new Date('2026-06-05T15:00:00') },
    duracion: '2h 00m', distanciaKm: 32, precio: 215.00, fechaViaje: new Date('2026-06-05') },

  // Jue 4 Jun
  { id: '69', placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.1,
    puntoA: { label: 'A', direccion: 'Av. Colonial 1250, Lima Cercado',          fecha: new Date('2026-06-04T08:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Separadora Industrial 2450, Ate',      fecha: new Date('2026-06-04T10:00:00') },
    duracion: '2h 00m', distanciaKm: 36, precio: 240.00, fechaViaje: new Date('2026-06-04') },
  { id: '70', placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.4,
    puntoA: { label: 'A', direccion: 'Av. Separadora Industrial 2450, Ate',      fecha: new Date('2026-06-04T14:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Naranjal 890, Independencia',          fecha: new Date('2026-06-04T16:00:00') },
    duracion: '2h 00m', distanciaKm: 33, precio: 222.00, fechaViaje: new Date('2026-06-04') },

  // Mié 3 Jun
  { id: '71', placa: 'D4G-821', codigoMotor: '2847391020', rating: 3.6,
    puntoA: { label: 'A', direccion: 'Av. La Marina 2100, San Miguel',           fecha: new Date('2026-06-03T07:30:00') },
    puntoB: { label: 'B', direccion: 'Av. El Sol 1050, La Molina',               fecha: new Date('2026-06-03T10:00:00') },
    duracion: '2h 30m', distanciaKm: 45, precio: 298.00, fechaViaje: new Date('2026-06-03') },
  { id: '72', placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.0,
    puntoA: { label: 'A', direccion: 'Av. El Sol 1050, La Molina',               fecha: new Date('2026-06-03T14:00:00') },
    puntoB: { label: 'B', direccion: 'Av. República de Panamá 3055, San Isidro', fecha: new Date('2026-06-03T15:30:00') },
    duracion: '1h 30m', distanciaKm: 20, precio: 135.00, fechaViaje: new Date('2026-06-03') },

  // Mar 2 Jun
  { id: '73', placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.5,
    puntoA: { label: 'A', direccion: 'Av. Nicolás Ayllón 2408, Ate',             fecha: new Date('2026-06-02T07:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Argentina 3093, Callao',               fecha: new Date('2026-06-02T09:30:00') },
    duracion: '2h 30m', distanciaKm: 50, precio: 332.00, fechaViaje: new Date('2026-06-02') },
  { id: '74', placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.2,
    puntoA: { label: 'A', direccion: 'Av. Argentina 3093, Callao',               fecha: new Date('2026-06-02T13:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Angamos Este 1600, Surquillo',         fecha: new Date('2026-06-02T14:30:00') },
    duracion: '1h 30m', distanciaKm: 20, precio: 135.00, fechaViaje: new Date('2026-06-02') },

  // Lun 1 Jun
  { id: '75', placa: 'D4G-821', codigoMotor: '2847391020', rating: 3.7,
    puntoA: { label: 'A', direccion: 'Calle Schell 391, Miraflores',             fecha: new Date('2026-06-01T08:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Túpac Amaru 3100, Comas',              fecha: new Date('2026-06-01T10:30:00') },
    duracion: '2h 30m', distanciaKm: 47, precio: 312.00, fechaViaje: new Date('2026-06-01') },
  { id: '76', placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.1,
    puntoA: { label: 'A', direccion: 'Av. Túpac Amaru 3100, Comas',              fecha: new Date('2026-06-01T14:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Javier Prado Este 4200, Surco',        fecha: new Date('2026-06-01T16:30:00') },
    duracion: '2h 30m', distanciaKm: 43, precio: 288.00, fechaViaje: new Date('2026-06-01') },

  // Vie 29 May
  { id: '77', placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.6,
    puntoA: { label: 'A', direccion: 'Av. Universitaria 1801, Los Olivos',       fecha: new Date('2026-05-29T07:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Alfredo Benavides 3866, Miraflores',   fecha: new Date('2026-05-29T09:30:00') },
    duracion: '2h 30m', distanciaKm: 44, precio: 292.00, fechaViaje: new Date('2026-05-29') },
  { id: '78', placa: 'D4G-821', codigoMotor: '2847391020', rating: 3.9,
    puntoA: { label: 'A', direccion: 'Av. Alfredo Benavides 3866, Miraflores',   fecha: new Date('2026-05-29T13:30:00') },
    puntoB: { label: 'B', direccion: 'Av. Próceres de la Independencia 1580, SJL', fecha: new Date('2026-05-29T16:00:00') },
    duracion: '2h 30m', distanciaKm: 49, precio: 325.00, fechaViaje: new Date('2026-05-29') },

  // Jue 28 May
  { id: '79', placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.3,
    puntoA: { label: 'A', direccion: 'Av. Industrial 2340, Breña',               fecha: new Date('2026-05-28T08:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Néstor Gambetta 3500, Callao',         fecha: new Date('2026-05-28T10:00:00') },
    duracion: '2h 00m', distanciaKm: 29, precio: 195.00, fechaViaje: new Date('2026-05-28') },
  { id: '80', placa: 'D4G-821', codigoMotor: '2847391020', rating: 4.7,
    puntoA: { label: 'A', direccion: 'Av. Néstor Gambetta 3500, Callao',         fecha: new Date('2026-05-28T13:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Santa Rosa 1200, Los Olivos',          fecha: new Date('2026-05-28T15:00:00') },
    duracion: '2h 00m', distanciaKm: 34, precio: 228.00, fechaViaje: new Date('2026-05-28') },

  // ── Vie 15 May ───────────────────────────────
  {
    id: '10',
    placa: 'H2P-783', codigoMotor: '3318927401', rating: 4.4,
    puntoA: { label: 'A', direccion: 'Av. El Sol 1050, La Molina',          fecha: new Date('2026-05-15T08:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Santa Rosa 1200, Los Olivos',     fecha: new Date('2026-05-15T10:30:00') },
    duracion: '2h 30m', distanciaKm: 44, precio: 295.00, fechaViaje: new Date('2026-05-15'),
  },
  {
    id: '11',
    placa: 'F7K-392', codigoMotor: '1293847562', rating: 3.6,
    puntoA: { label: 'A', direccion: 'Av. Petit Thouars 4550, Miraflores',  fecha: new Date('2026-05-15T15:20:00') },
    puntoB: { label: 'B', direccion: 'Av. Túpac Amaru 3100, Comas',         fecha: new Date('2026-05-15T17:50:00') },
    duracion: '2h 30m', distanciaKm: 39, precio: 258.00, fechaViaje: new Date('2026-05-15'),
  },

  // ── Mié 22 Abr ───────────────────────────────
  {
    id: '12',
    placa: 'C9B-447', codigoMotor: '0934127856', rating: 4.0,
    puntoA: { label: 'A', direccion: 'Av. La Marina 2100, San Miguel',      fecha: new Date('2026-04-22T18:00:00') },
    puntoB: { label: 'B', direccion: 'Av. Colonial 1250, Lima Cercado',     fecha: new Date('2026-04-22T19:30:00') },
    duracion: '1h 30m', distanciaKm: 19, precio: 148.00, fechaViaje: new Date('2026-04-22'),
  },
];
