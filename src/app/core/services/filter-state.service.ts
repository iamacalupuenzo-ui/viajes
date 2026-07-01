import { Injectable, signal, computed } from '@angular/core';
import { FilterConfig, FilterPeriod } from '../../features/viajes/models/filter.model';

const PERIOD_LABELS: Record<FilterPeriod, string> = {
  todo: 'Todo',
  semana: 'Esta semana',
  mes: 'Este mes',
  personalizado: 'Personalizado',
};

@Injectable({ providedIn: 'root' })
export class FilterStateService {
  readonly isOpen = signal(false);
  readonly activeConfig = signal<FilterConfig | null>(null);

  readonly periodLabel = computed(() => {
    const cfg = this.activeConfig();
    return cfg ? PERIOD_LABELS[cfg.period] : null;
  });

  readonly unitCount = computed(() => this.activeConfig()?.unitIds.length ?? null);

  open(): void { this.isOpen.set(true); }
  close(): void { this.isOpen.set(false); }

  apply(config: FilterConfig): void {
    this.activeConfig.set(config);
    this.close();
  }
}
