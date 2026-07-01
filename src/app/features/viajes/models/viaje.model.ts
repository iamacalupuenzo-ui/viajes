export interface ViajePoint {
  label: 'A' | 'B';
  direccion: string;
  fecha: Date;
}

export interface Viaje {
  id: string;
  placa: string;
  codigoMotor: string;
  rating: number;
  puntoB: ViajePoint;
  puntoA: ViajePoint;
  duracion: string;
  distanciaKm: number;
  precio: number;
  fechaViaje: Date;
}

export interface ViajeGroup {
  label: string;
  viajes: Viaje[];
}
