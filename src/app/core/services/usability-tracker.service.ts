import { Injectable, signal, computed, inject, NgZone } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { TEST_CONFIG } from '../../features/perfil/data/test-config';
import {
  SessionRecord,
  TaskRun,
  TaskDef,
  TaskResultClass,
  Participante,
  ClickRecord,
} from '../../features/perfil/models/usability.model';

const STORAGE_KEY = 'usab-sessions-v1';

@Injectable({ providedIn: 'root' })
export class UsabilityTrackerService {
  private readonly router = inject(Router);
  private readonly zone = inject(NgZone);

  readonly config = TEST_CONFIG;

  // ── Estado ──
  readonly session = signal<SessionRecord | null>(null);
  readonly activeRun = signal<TaskRun | null>(null);
  readonly elapsedMs = signal(0);
  readonly sessions = signal<SessionRecord[]>(this.loadAll());

  readonly activeTask = computed<TaskDef | null>(() => {
    const run = this.activeRun();
    if (!run) return null;
    return this.config.tareas.find(t => t.id === run.taskId) ?? null;
  });

  readonly hitosAlcanzados = computed<Set<string>>(() => {
    const run = this.activeRun();
    return new Set(run?.hitos.map(h => h.id) ?? []);
  });

  private runStartEpoch = 0;
  private timerHandle: ReturnType<typeof setInterval> | null = null;
  private timeoutHandle: ReturnType<typeof setTimeout> | null = null;
  private clickListener = (e: MouseEvent) => this.recordClick(e);

  constructor() {
    // Hito por navegación: /viajes/recorrido?ids=1,2 → recorrido_abierto
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => {
        const url = e.urlAfterRedirects;
        if (url.includes('/recorrido')) {
          const match = url.match(/[?&]ids=([^&]+)/);
          const ids = match ? decodeURIComponent(match[1]).split(',').filter(Boolean).length : 0;
          this.emit('recorrido_abierto', { ids });
        }
      });
  }

  // ── Sesión ──

  startSession(participante: Participante): void {
    const s: SessionRecord = {
      sessionId: `s-${Date.now()}`,
      testId: this.config.testId,
      testVersion: this.config.version,
      participante,
      fecha: new Date().toISOString(),
      runs: [],
      cerrada: false,
    };
    this.session.set(s);
  }

  endSession(): void {
    const s = this.session();
    if (!s) return;
    if (this.activeRun()) this.stopTask('moderador');
    s.cerrada = true;
    this.sessions.update(all => [...all, s]);
    this.persist();
    this.session.set(null);
  }

  // ── Tareas ──

  startTask(taskId: string): void {
    if (!this.session() || this.activeRun()) return;
    const task = this.config.tareas.find(t => t.id === taskId);
    if (!task) return;

    const run: TaskRun = {
      taskId,
      inicio: new Date().toISOString(),
      duracionMs: null,
      clicks: [],
      hitos: [],
      ayudas: 0,
      finalizadoPor: null,
      clasificacionAuto: null,
      clasificacionFinal: null,
    };
    this.activeRun.set(run);
    this.runStartEpoch = Date.now();
    this.elapsedMs.set(0);

    document.addEventListener('click', this.clickListener, true);

    this.zone.runOutsideAngular(() => {
      this.timerHandle = setInterval(() => {
        this.zone.run(() => this.elapsedMs.set(Date.now() - this.runStartEpoch));
      }, 1000);
    });
    this.timeoutHandle = setTimeout(() => this.stopTask('timeout'), task.timeoutMs);
  }

  markHelp(): void {
    const run = this.activeRun();
    if (!run) return;
    this.activeRun.set({ ...run, ayudas: run.ayudas + 1 });
  }

  stopTask(por: 'auto' | 'moderador' | 'timeout'): void {
    const run = this.activeRun();
    const task = this.activeTask();
    const s = this.session();
    if (!run || !task || !s) return;

    this.teardownRun();

    run.duracionMs = Date.now() - this.runStartEpoch;
    run.finalizadoPor = por;
    run.clasificacionAuto = this.classify(run, task);
    run.clasificacionFinal = run.clasificacionAuto;

    // Reemplaza run previo de la misma tarea si el moderador la repitió
    s.runs = [...s.runs.filter(r => r.taskId !== run.taskId), run];
    this.session.set({ ...s });
    this.activeRun.set(null);
  }

  /** Punto de entrada de la instrumentación: componentes emiten eventos aquí. */
  emit(eventId: string, payload?: unknown): void {
    const run = this.activeRun();
    const task = this.activeTask();
    if (!run || !task) return;

    for (const hito of task.hitos) {
      if ((hito.on ?? hito.id) !== eventId) continue;
      if (run.hitos.some(h => h.id === hito.id)) continue;          // ya alcanzado
      if (hito.match && !hito.match(payload)) continue;              // payload no cumple

      const updated: TaskRun = {
        ...run,
        hitos: [...run.hitos, { id: hito.id, t: Date.now() - this.runStartEpoch }],
      };
      this.activeRun.set(updated);

      if (hito.final) {
        // pequeño delay para que el click que cerró la tarea quede registrado
        setTimeout(() => this.stopTask('auto'), 150);
        return;
      }
    }
  }

  // ── Resultados ──

  overrideClassification(sessionId: string, taskId: string, cls: TaskResultClass): void {
    this.sessions.update(all =>
      all.map(s => {
        if (s.sessionId !== sessionId) return s;
        return {
          ...s,
          runs: s.runs.map(r => (r.taskId === taskId ? { ...r, clasificacionFinal: cls } : r)),
        };
      })
    );
    this.persist();
  }

  deleteSession(sessionId: string): void {
    this.sessions.update(all => all.filter(s => s.sessionId !== sessionId));
    this.persist();
  }

  exportSession(sessionId: string): void {
    const s = this.sessions().find(x => x.sessionId === sessionId);
    if (s) this.download(`sesion-${s.participante.alias}-${s.sessionId}.json`, [s]);
  }

  exportAll(): void {
    this.download(`test-${this.config.testId}-sesiones.json`, this.sessions());
  }

  // ── Internos ──

  private classify(run: TaskRun, task: TaskDef): TaskResultClass {
    const finalHit = task.hitos.some(
      h => h.final && run.hitos.some(r => r.id === h.id)
    );
    if (finalHit) {
      const conFriccion =
        run.ayudas > 0 ||
        run.clicks.length > task.maxClicksEsperados ||
        (run.duracionMs ?? 0) > task.tiempoEsperadoMs;
      return conFriccion ? 'exito_friccion' : 'exito_directo';
    }
    const alcanzados = run.hitos.length;
    const total = task.hitos.length;
    return alcanzados >= Math.ceil(total / 2) ? 'exito_parcial' : 'fracaso';
  }

  private recordClick(e: MouseEvent): void {
    const run = this.activeRun();
    if (!run) return;

    const phone = document.querySelector('.shell__phone');
    const rect = phone?.getBoundingClientRect();
    const x = Math.round(e.clientX - (rect?.left ?? 0));
    const y = Math.round(e.clientY - (rect?.top ?? 0));

    const el = e.target as HTMLElement;
    // No registrar clics sobre la consola de test ni el HUD
    if (el.closest('.test-hud') || el.closest('.perfil')) return;

    const click: ClickRecord = {
      t: Date.now() - this.runStartEpoch,
      x,
      y,
      ruta: this.router.url,
      target: this.describe(el),
    };
    this.activeRun.set({ ...run, clicks: [...run.clicks, click] });
  }

  private describe(el: HTMLElement): string {
    const btn = el.closest('button, a, [role="checkbox"], [role="tab"]') as HTMLElement | null;
    const target = btn ?? el;
    const label = target.getAttribute('aria-label') || target.textContent?.trim().slice(0, 40) || '';
    const cls = target.className && typeof target.className === 'string'
      ? '.' + target.className.split(' ')[0]
      : '';
    return `${target.tagName.toLowerCase()}${cls}${label ? ` "${label}"` : ''}`;
  }

  private teardownRun(): void {
    document.removeEventListener('click', this.clickListener, true);
    if (this.timerHandle) { clearInterval(this.timerHandle); this.timerHandle = null; }
    if (this.timeoutHandle) { clearTimeout(this.timeoutHandle); this.timeoutHandle = null; }
  }

  private persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.sessions()));
    } catch { /* storage lleno o no disponible: los datos siguen en memoria */ }
  }

  private loadAll(): SessionRecord[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  }

  private download(filename: string, data: unknown): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
