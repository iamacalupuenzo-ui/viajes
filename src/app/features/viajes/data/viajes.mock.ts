import { Viaje } from '../models/viaje.model';

export const VIAJES_MOCK: Viaje[] = [
  {
    id: '1',
    unidad: 'Unidad A',
    gpsId: 'GPS001',
    rating: 4.1,
    puntoB: {
      label: 'B',
      direccion: 'Av. Republica de Panama, Miraflores',
      fecha: new Date('2025-02-13T10:00:00'),
    },
    puntoA: {
      label: 'A',
      direccion: 'Av. Angamos Este, Surquillo',
      fecha: new Date('2025-02-13T08:00:00'),
    },
    duracion: '1h 30m',
    distanciaKm: 25,
    precio: 175.00,
    fechaViaje: new Date('2025-02-13'),
  },
  {
    id: '2',
    unidad: 'Unidad B',
    gpsId: 'GPS002',
    rating: 2.5,
    puntoB: {
      label: 'B',
      direccion: 'Jr. de la Union, Cercado de Lima',
      fecha: new Date('2025-02-12T10:00:00'),
    },
    puntoA: {
      label: 'A',
      direccion: 'Av. Angamos Este, Surquillo',
      fecha: new Date('2025-02-12T10:00:00'),
    },
    duracion: '1h 30m',
    distanciaKm: 25,
    precio: 175.00,
    fechaViaje: new Date('2025-02-12'),
  },
  {
    id: '3',
    unidad: 'Unidad B',
    gpsId: 'GPS002',
    rating: 3.2,
    puntoB: {
      label: 'B',
      direccion: 'Av. Angamos Este, Surquillo',
      fecha: new Date('2025-02-12T10:00:00'),
    },
    puntoA: {
      label: 'A',
      direccion: 'Av. Angamos Este, Surquillo',
      fecha: new Date('2025-02-12T10:00:00'),
    },
    duracion: '1h 30m',
    distanciaKm: 25,
    precio: 120.00,
    fechaViaje: new Date('2025-02-12'),
  },
];
