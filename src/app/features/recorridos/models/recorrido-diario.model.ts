export interface RecorridoDia {
  id: string;
  fechaViaje: Date;
  viajeIds: string[];
  unidades: string[];
  puntoA: { label: 'A'; direccion: string; fecha: Date };
  puntoB: { label: 'B'; direccion: string; fecha: Date };
  duracion: string;
  tiempoMovimiento: string;
  tiempoParado: string;
  totalKm: number;
  rating: number;
}

export interface RecorridoDiaGroup {
  label: string;
  recorridos: RecorridoDia[];
}
