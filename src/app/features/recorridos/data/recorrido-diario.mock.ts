import { VIAJES_MOCK } from '../../viajes/data/viajes.mock';
import { Viaje } from '../../viajes/models/viaje.model';
import { RecorridoDia } from '../models/recorrido-diario.model';

function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function fmtMs(ms: number): string {
  const totalMin = Math.max(0, Math.round(ms / 60000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function buildDias(): RecorridoDia[] {
  // Agrupar por (fecha + placa) → un recorrido por unidad por día
  const map = new Map<string, Viaje[]>();

  for (const v of VIAJES_MOCK) {
    const key = `${toDateKey(v.fechaViaje)}_${v.placa}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(v);
  }

  return Array.from(map.entries())
    .map(([key, viajes]) => {
      const sorted = [...viajes].sort((a, b) => a.puntoA.fecha.getTime() - b.puntoA.fecha.getTime());

      const firstA = sorted[0].puntoA;
      const lastB  = sorted.reduce(
        (latest, v) => (v.puntoB.fecha.getTime() > latest.fecha.getTime() ? v.puntoB : latest),
        sorted[0].puntoB,
      );

      const totalKm      = viajes.reduce((sum, v) => sum + v.distanciaKm, 0);
      const rating       = Math.round((viajes.reduce((sum, v) => sum + v.rating, 0) / viajes.length) * 10) / 10;
      const totalMs      = lastB.fecha.getTime() - firstA.fecha.getTime();
      const movimientoMs = sorted.reduce((sum, v) => sum + (v.puntoB.fecha.getTime() - v.puntoA.fecha.getTime()), 0);
      const paradoMs     = Math.max(0, totalMs - movimientoMs);

      return {
        id:               key,
        fechaViaje:       sorted[0].fechaViaje,
        viajeIds:         viajes.map(v => v.id),
        unidades:         [sorted[0].placa],
        puntoA:           { label: 'A' as const, direccion: firstA.direccion, fecha: firstA.fecha },
        puntoB:           { label: 'B' as const, direccion: lastB.direccion,  fecha: lastB.fecha  },
        duracion:         fmtMs(totalMs),
        tiempoMovimiento: fmtMs(movimientoMs),
        tiempoParado:     fmtMs(paradoMs),
        totalKm,
        rating,
      };
    })
    .sort((a, b) => b.fechaViaje.getTime() - a.fechaViaje.getTime());
}

export const RECORRIDO_DIAS_MOCK: RecorridoDia[] = buildDias();
