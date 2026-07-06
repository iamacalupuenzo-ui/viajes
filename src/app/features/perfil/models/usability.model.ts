// ============================================
// Modelos del tracker de test de usabilidad
// ============================================

export type TaskResultClass =
  | 'exito_directo'
  | 'exito_friccion'
  | 'exito_parcial'
  | 'fracaso';

export const RESULT_LABELS: Record<TaskResultClass, string> = {
  exito_directo:  'Éxito directo',
  exito_friccion: 'Éxito con fricción',
  exito_parcial:  'Éxito parcial',
  fracaso:        'Fracaso',
};

/** Hito observable dentro de una tarea. `match` valida el payload del evento. */
export interface MilestoneDef {
  id: string;
  label: string;
  /** Evento que lo dispara; por defecto es el propio id */
  on?: string;
  /** true = este hito marca el éxito de la tarea y la cierra automáticamente */
  final?: boolean;
  match?: (payload: unknown) => boolean;
}

export interface TaskDef {
  id: string;
  nombre: string;
  escenario: string;
  hitos: MilestoneDef[];
  tiempoEsperadoMs: number;
  timeoutMs: number;
  maxClicksEsperados: number;
}

export interface TestDef {
  testId: string;
  nombre: string;
  version: number;
  tareas: TaskDef[];
}

// ── Datos registrados (serializables a localStorage) ──

export interface ClickRecord {
  t: number;      // ms desde inicio de la tarea
  x: number;      // relativo al shell del teléfono
  y: number;
  ruta: string;
  target: string; // descripción del elemento tocado
}

export interface MilestoneHit {
  id: string;
  t: number; // ms desde inicio de la tarea
}

export interface TaskRun {
  taskId: string;
  inicio: string;           // ISO
  duracionMs: number | null;
  clicks: ClickRecord[];
  hitos: MilestoneHit[];
  ayudas: number;
  finalizadoPor: 'auto' | 'moderador' | 'timeout' | null;
  clasificacionAuto: TaskResultClass | null;
  clasificacionFinal: TaskResultClass | null;
}

export interface Participante {
  alias: string;
  perfil: string;
  notas: string;
}

export interface SessionRecord {
  sessionId: string;
  testId: string;
  testVersion: number;
  participante: Participante;
  fecha: string; // ISO
  runs: TaskRun[];
  cerrada: boolean;
}
