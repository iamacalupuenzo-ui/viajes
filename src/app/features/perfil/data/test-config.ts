import { TestDef } from '../models/usability.model';
import { FilterConfig } from '../../viajes/models/filter.model';

// ============================================
// CONFIG DEL TEST ACTIVO
// Para un test nuevo: duplicar este objeto con otro testId/version.
// Las sesiones guardadas quedan ligadas al testId con el que corrieron.
// ============================================

export const TEST_CONFIG: TestDef = {
  testId: 'viajes-v1',
  nombre: 'Test de usabilidad — Viajes (flota)',
  version: 1,
  tareas: [
    {
      id: 'T1',
      nombre: 'Acotar viajes',
      escenario:
        'La semana pasada el camión de placa D4G-821 hizo varios viajes. ' +
        'Quieres ver en pantalla únicamente los viajes de ese camión en ese período.',
      hitos: [
        { id: 'filtro_abierto', label: 'Abrió el panel de filtros' },
        {
          id: 'filtro_aplicado',
          label: 'Aplicó filtro con período y unidad',
          final: true,
          match: p => {
            const cfg = p as FilterConfig;
            return !!cfg && cfg.period !== 'todo' && cfg.unitIds.length >= 1;
          },
        },
      ],
      tiempoEsperadoMs: 2 * 60_000,
      timeoutMs: 4 * 60_000,
      maxClicksEsperados: 10,
    },
    {
      id: 'T2',
      nombre: 'Comparar rutas',
      escenario:
        'Quieres ver por dónde condujeron dos de tus unidades el 1 de julio, al mismo tiempo.',
      hitos: [
        {
          id: 'viaje_seleccionado',
          label: 'Seleccionó un viaje',
          match: p => (p as { count: number }).count >= 1,
        },
        {
          id: 'viaje_seleccionado_2',
          label: 'Seleccionó el segundo viaje',
          on: 'viaje_seleccionado',
          match: p => (p as { count: number }).count >= 2,
        },
        {
          id: 'recorrido_abierto',
          label: 'Abrió el recorrido con 2 viajes',
          final: true,
          match: p => (p as { ids: number }).ids >= 2,
        },
      ],
      tiempoEsperadoMs: 2 * 60_000,
      timeoutMs: 4 * 60_000,
      maxClicksEsperados: 8,
    },
    {
      id: 'T3',
      nombre: 'Investigar incidentes',
      escenario:
        'Te avisaron que la unidad D4G-821 tuvo problemas en su viaje del 1 de julio. ' +
        'Quieres saber qué pasó exactamente y a qué hora.',
      hitos: [
        {
          id: 'recorrido_abierto',
          label: 'Abrió el recorrido de un viaje',
          match: p => (p as { ids: number }).ids >= 1,
        },
        { id: 'historial_abierto', label: 'Llegó a la lista de eventos', final: true },
      ],
      tiempoEsperadoMs: 2.5 * 60_000,
      timeoutMs: 5 * 60_000,
      maxClicksEsperados: 10,
    },
    {
      id: 'T4',
      nombre: 'Enviar reporte',
      escenario:
        'Tu jefe te pide el detalle de esos incidentes en un documento PDF ' +
        'para revisarlo en su computadora. Envíaselo.',
      hitos: [
        { id: 'compartir_abierto', label: 'Abrió las opciones de envío' },
        {
          id: 'compartir_confirmado',
          label: 'Confirmó el envío con formato PDF',
          final: true,
          match: p => (p as { formatos: string[] }).formatos?.includes('pdf'),
        },
      ],
      tiempoEsperadoMs: 1.5 * 60_000,
      timeoutMs: 3 * 60_000,
      maxClicksEsperados: 6,
    },
  ],
};
