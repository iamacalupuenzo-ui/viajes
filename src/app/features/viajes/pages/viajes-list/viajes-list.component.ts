import { Component, ChangeDetectionStrategy, computed, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { VIAJES_MOCK } from '../../data/viajes.mock';
import { UNITS_MOCK } from '../../data/units.mock';
import { Viaje, ViajeGroup } from '../../models/viaje.model';
import { ViajeCardComponent } from '../../components/viaje-card/viaje-card.component';
import { SelectionActionsComponent } from '../../components/selection-actions/selection-actions.component';
import { FilterStateService } from '../../../../core/services/filter-state.service';
import { UsabilityTrackerService } from '../../../../core/services/usability-tracker.service';

const TOTAL_UNITS = UNITS_MOCK.length;

@Component({
  selector: 'app-viajes-list',
  standalone: true,
  imports: [ViajeCardComponent, SelectionActionsComponent],
  templateUrl: './viajes-list.component.html',
  styleUrl: './viajes-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViajesListComponent {
  readonly filterState = inject(FilterStateService);
  private readonly router = inject(Router);
  private readonly tracker = inject(UsabilityTrackerService);

  readonly MAX_SELECTION = 5;

  selectedIds   = signal<Set<string>>(new Set());
  selectedCount = computed(() => this.selectedIds().size);
  hasSelection  = computed(() => this.selectedIds().size > 0);
  isAtLimit     = computed(() => this.selectedIds().size >= this.MAX_SELECTION);

  readonly groups = computed<ViajeGroup[]>(() => {
    const cfg = this.filterState.activeConfig();
    let viajes = [...VIAJES_MOCK];

    if (cfg) {
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      if (cfg.period === 'semana') {
        const dow = todayStart.getDay();
        const monday = new Date(todayStart);
        monday.setDate(todayStart.getDate() - (dow === 0 ? 6 : dow - 1));
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        viajes = viajes.filter(v => {
          const d = startOf(v.fechaViaje);
          return d >= monday && d <= sunday;
        });
      } else if (cfg.period === 'mes') {
        const since = new Date(todayStart);
        since.setDate(since.getDate() - 30);
        viajes = viajes.filter(v => {
          const d = startOf(v.fechaViaje);
          return d >= since && d <= todayStart;
        });
      } else if (cfg.period === 'personalizado' && cfg.fromDate && cfg.toDate) {
        const from = startOf(cfg.fromDate);
        const to = startOf(cfg.toDate);
        viajes = viajes.filter(v => {
          const d = startOf(v.fechaViaje);
          return d >= from && d <= to;
        });
      }

      if (cfg.unitIds.length > 0 && cfg.unitIds.length < TOTAL_UNITS) {
        const selectedPlacas = new Set(
          cfg.unitIds
            .map(id => UNITS_MOCK.find(u => u.id === id)?.placa)
            .filter((p): p is string => !!p)
        );
        viajes = viajes.filter(v => selectedPlacas.has(v.placa));
      }
    }

    return buildGroups(viajes);
  });

  readonly isEmpty = computed(() => this.groups().length === 0);

  readonly emptyContext = computed(() => {
    const periodLabel = this.filterState.periodLabel();
    const unitCount = this.filterState.unitCount();
    if (periodLabel && unitCount) return `${periodLabel} · ${unitCount} unidades seleccionadas`;
    if (periodLabel) return periodLabel;
    if (unitCount) return `${unitCount} unidades seleccionadas`;
    return null;
  });

  isSelected(id: string): boolean {
    return this.selectedIds().has(id);
  }

  isCardDisabled(id: string): boolean {
    return this.isAtLimit() && !this.selectedIds().has(id);
  }

  onToggle(id: string): void {
    const next = new Set(this.selectedIds());
    if (next.has(id)) {
      next.delete(id);
    } else if (next.size < this.MAX_SELECTION) {
      next.add(id);
    }
    this.selectedIds.set(next);
    this.tracker.emit('viaje_seleccionado', { count: next.size });
  }

  onLimpiar(): void { this.selectedIds.set(new Set()); }

  onVerRecorrido(): void {
    const ids = [...this.selectedIds()].join(',');
    this.router.navigate(['/viajes/recorrido'], { queryParams: { ids } });
  }
}

function startOf(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function buildGroups(viajes: Viaje[]): ViajeGroup[] {
  const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const map = new Map<string, Viaje[]>();
  for (const v of viajes) {
    const d = v.fechaViaje;
    const label = `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(v);
  }
  return Array.from(map.entries()).map(([label, vs]) => ({ label, viajes: vs }));
}
