import { Viaje } from '../models/viaje.model';

export const VIAJES_MOCK: Viaje[] = [
  {
    id: '1',
    placa: 'D4G-821',
    codigoMotor: '2847391020',
    rating: 4.1,
    puntoB: {
      label: 'B',
      direccion: 'Av. Argentina 3093, Callao',
      fecha: new Date('2025-02-13T10:00:00'),
    },
    puntoA: {
      label: 'A',
      direccion: 'Av. Javier Prado Este 4200, Surco',
      fecha: new Date('2025-02-13T08:00:00'),
    },
    duracion: '1h 55m',
    distanciaKm: 32,
    precio: 210.00,
    fechaViaje: new Date('2025-02-13'),
  },
  {
    id: '2',
    placa: 'F7K-392',
    codigoMotor: '1293847562',
    rating: 2.8,
    puntoB: {
      label: 'B',
      direccion: 'Av. Nicolás Ayllón 2408, Ate',
      fecha: new Date('2025-02-12T14:30:00'),
    },
    puntoA: {
      label: 'A',
      direccion: 'Av. Tomás Marsano 2800, Surquillo',
      fecha: new Date('2025-02-12T12:45:00'),
    },
    duracion: '1h 45m',
    distanciaKm: 28,
    precio: 185.00,
    fechaViaje: new Date('2025-02-12'),
  },
  {
    id: '3',
    placa: 'A3M-156',
    codigoMotor: '5521034891',
    rating: 3.7,
    puntoB: {
      label: 'B',
      direccion: 'Prolongación Huaylas 340, Chorrillos',
      fecha: new Date('2025-02-12T09:15:00'),
    },
    puntoA: {
      label: 'A',
      direccion: 'Av. Los Frutales 390, Ate Vitarte',
      fecha: new Date('2025-02-12T07:30:00'),
    },
    duracion: '1h 45m',
    distanciaKm: 41,
    precio: 245.50,
    fechaViaje: new Date('2025-02-12'),
  },
  {
    id: '4',
    placa: 'C9B-447',
    codigoMotor: '0934127856',
    rating: 4.6,
    puntoB: {
      label: 'B',
      direccion: 'Av. Universitaria 1801, Los Olivos',
      fecha: new Date('2025-02-12T17:00:00'),
    },
    puntoA: {
      label: 'A',
      direccion: 'Av. República de Panamá 3055, San Isidro',
      fecha: new Date('2025-02-12T15:10:00'),
    },
    duracion: '1h 50m',
    distanciaKm: 23,
    precio: 175.00,
    fechaViaje: new Date('2025-02-12'),
  },
];
