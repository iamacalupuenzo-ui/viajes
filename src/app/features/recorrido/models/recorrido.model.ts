export type EventoTipo = 'alerta' | 'reinicio' | 'exceso_velocidad' | 'parada';

export interface EventoRecorrido {
  id: string;
  tipo: EventoTipo;
  coords: [number, number];
  direccion: string;
  descripcion: string;
  fecha: Date;
}

export interface RecorridoData {
  viajeId: string;
  placa: string;
  codigoMotor: string;
  rating: number;
  puntoA: { label: 'A'; direccion: string; fecha: Date; coords: [number, number] };
  puntoB: { label: 'B'; direccion: string; fecha: Date; coords: [number, number] };
  ruta: [number, number][];
  eventos: EventoRecorrido[];
}
