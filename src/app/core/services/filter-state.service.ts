import { Injectable, signal, computed, inject } from '@angular/core';
import { FilterConfig, FilterPeriod } from '../../features/viajes/models/filter.model';
import { UNITS_MOCK } from '../../features/viajes/data/units.mock';
import { UsabilityTrackerService } from './usability-tracker.service';

const TOTAL_UNITS = UNITS_MOCK.length;

const PERIOD_LABELS: Record<FilterPeriod, string> = {
  todo: 'Todo',
  semana: 'Esta semana',
  mes: 'Este mes',
  personalizado: 'Personalizado',
};

@Injectable({ providedIn: 'root' })
export class FilterStateService {
  private readonly tracker = inject(UsabilityTrackerService);

  readonly isOpen = signal(false);
  readonly activeConfig = signal<FilterConfig | null>(null);
  readonly drawerShowPeriod = signal(true);

  readonly periodLabel = computed(() => {
    const cfg = this.activeConfig();
    if (!cfg || cfg.period === 'todo') return null;
    if (cfg.period === 'personalizado' && cfg.fromDate && cfg.toDate) {
      return `${this.fmtDate(cfg.fromDate)} - ${this.fmtDate(cfg.toDate)}`;
    }
    return PERIOD_LABELS[cfg.period];
  });

  readonly unitCount = computed(() => {
    const cfg = this.activeConfig();
    if (!cfg) return null;
    const count = cfg.unitIds.length;
    return (count === 0 || count >= TOTAL_UNITS) ? null : count;
  });

  open(): void {
    this.drawerShowPeriod.set(true);
    this.isOpen.set(true);
    this.tracker.emit('filtro_abierto');
  }

  openUnitsOnly(): void {
    this.drawerShowPeriod.set(false);
    this.isOpen.set(true);
    this.tracker.emit('filtro_abierto');
  }

  close(): void { this.isOpen.set(false); }

  apply(config: FilterConfig): void {
    this.activeConfig.set(config);
    this.close();
    this.tracker.emit('filtro_aplicado', config);
  }

  private fmtDate(d: Date): string {
    const m = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    return `${d.getDate()} ${m[d.getMonth()]}`;
  }
}
