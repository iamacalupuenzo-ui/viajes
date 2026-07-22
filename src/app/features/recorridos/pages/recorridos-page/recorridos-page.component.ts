import { Component, ChangeDetectionStrategy, computed, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RECORRIDO_DIAS_MOCK } from '../../data/recorrido-diario.mock';
import { UNITS_MOCK } from '../../../viajes/data/units.mock';
import { RecorridoDia, RecorridoDiaGroup } from '../../models/recorrido-diario.model';
import { RecorridoDiaCardComponent } from '../../components/recorrido-dia-card/recorrido-dia-card.component';
import { SelectionActionsComponent } from '../../../viajes/components/selection-actions/selection-actions.component';
import { FilterStateService } from '../../../../core/services/filter-state.service';
import { DateRangePickerComponent } from '../../../viajes/components/date-range-picker/date-range-picker.component';

const TOTAL_UNITS = UNITS_MOCK.length;

const DAYS   = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

function startOf(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

@Component({
  selector: 'app-recorridos-page',
  standalone: true,
  imports: [RecorridoDiaCardComponent, SelectionActionsComponent, DateRangePickerComponent],
  templateUrl: './recorridos-page.component.html',
  styleUrl: './recorridos-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecorridosPageComponent {
  readonly filterState = inject(FilterStateService);
  private readonly router = inject(Router);

  readonly MAX_SELECTION = 15;

  showDatePicker = signal(false);

  private readonly selectedDias = computed(() =>
    RECORRIDO_DIAS_MOCK.filter(d => this.selectedIds().has(d.id))
  );

  readonly selectedFrom = computed<Date | null>(() => {
    const dias = this.selectedDias();
    if (dias.length === 0) return null;
    return new Date(Math.min(...dias.map(d => d.fechaViaje.getTime())));
  });

  readonly selectedTo = computed<Date | null>(() => {
    const dias = this.selectedDias();
    if (dias.length === 0) return null;
    return new Date(Math.max(...dias.map(d => d.fechaViaje.getTime())));
  });

  readonly selectedDateRange = computed<string | null>(() => {
    const from = this.selectedFrom();
    const to   = this.selectedTo();
    if (!from || !to) return null;
    const m = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    if (from.getTime() === to.getTime()) return `${from.getDate()} ${m[from.getMonth()]}`;
    return `${from.getDate()} ${m[from.getMonth()]} - ${to.getDate()} ${m[to.getMonth()]}`;
  });

  onDateApply(range: { from: Date; to: Date }): void {
    const from = startOf(range.from);
    const to   = startOf(range.to);

    // Placa activa (la de los recorridos ya seleccionados)
    const activePlaca = this.selectedDias()[0]?.unidades[0] ?? null;

    const inRange = RECORRIDO_DIAS_MOCK.filter(d => {
      const f = startOf(d.fechaViaje);
      const matchesRange = f >= from && f <= to;
      return activePlaca ? matchesRange && d.unidades[0] === activePlaca : matchesRange;
    });

    const next = new Set<string>();
    for (const d of inRange) {
      if (next.size >= this.MAX_SELECTION) break;
      next.add(d.id);
    }
    this.selectedIds.set(next);
    this.showDatePicker.set(false);
  }

  selectedIds   = signal<Set<string>>(new Set());
  selectedCount = computed(() => this.selectedIds().size);
  hasSelection  = computed(() => this.selectedIds().size > 0);
  isAtLimit     = computed(() => this.selectedIds().size >= this.MAX_SELECTION);

  readonly groups = computed<RecorridoDiaGroup[]>(() => {
    const cfg   = this.filterState.activeConfig();
    let dias    = [...RECORRIDO_DIAS_MOCK];

    if (cfg) {
      const today     = new Date();
      const todayStart = startOf(today);

      if (cfg.period === 'semana') {
        const dow    = todayStart.getDay();
        const monday = new Date(todayStart);
        monday.setDate(todayStart.getDate() - (dow === 0 ? 6 : dow - 1));
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        dias = dias.filter(d => {
          const f = startOf(d.fechaViaje);
          return f >= monday && f <= sunday;
        });
      } else if (cfg.period === 'mes') {
        const since = new Date(todayStart);
        since.setDate(since.getDate() - 30);
        dias = dias.filter(d => {
          const f = startOf(d.fechaViaje);
          return f >= since && f <= todayStart;
        });
      } else if (cfg.period === 'personalizado' && cfg.fromDate && cfg.toDate) {
        const from = startOf(cfg.fromDate);
        const to   = startOf(cfg.toDate);
        dias = dias.filter(d => {
          const f = startOf(d.fechaViaje);
          return f >= from && f <= to;
        });
      }

      if (cfg.unitIds.length > 0 && cfg.unitIds.length < TOTAL_UNITS) {
        const selectedPlacas = new Set(
          cfg.unitIds
            .map(id => UNITS_MOCK.find(u => u.id === id)?.placa)
            .filter((p): p is string => !!p)
        );
        dias = dias.filter(d => d.unidades.some(placa => selectedPlacas.has(placa)));
      }
    }

    // Si hay selección activa, solo mostrar la unidad seleccionada
    const activeIds = this.selectedIds();
    if (activeIds.size > 0) {
      const firstId      = [...activeIds][0];
      const activePlaca  = RECORRIDO_DIAS_MOCK.find(d => d.id === firstId)?.unidades[0];
      if (activePlaca) {
        dias = dias.filter(d => d.unidades[0] === activePlaca);
      }
    }

    return buildGroups(dias);
  });

  readonly isEmpty = computed(() => this.groups().length === 0);

  readonly emptyContext = computed(() => {
    const periodLabel = this.filterState.periodLabel();
    const unitCount   = this.filterState.unitCount();
    if (periodLabel && unitCount) return `${periodLabel} · ${unitCount} unidades seleccionadas`;
    if (periodLabel) return periodLabel;
    if (unitCount)   return `${unitCount} unidades seleccionadas`;
    return null;
  });

  isSelected(id: string):     boolean { return this.selectedIds().has(id); }
  isCardDisabled(id: string): boolean { return this.isAtLimit() && !this.selectedIds().has(id); }

  onToggle(id: string): void {
    const next = new Set(this.selectedIds());
    if (next.has(id)) next.delete(id);
    else if (next.size < this.MAX_SELECTION) next.add(id);
    this.selectedIds.set(next);
  }

  onLimpiar(): void {
    this.selectedIds.set(new Set());
  }

  onVerRecorrido(): void {
    const selectedDias = RECORRIDO_DIAS_MOCK.filter(d => this.selectedIds().has(d.id));
    const allViajeIds  = selectedDias.flatMap(d => d.viajeIds);
    this.router.navigate(['/viajes/recorrido'], { queryParams: { ids: allViajeIds.join(',') } });
  }
}

function buildGroups(dias: RecorridoDia[]): RecorridoDiaGroup[] {
  const map = new Map<string, RecorridoDia[]>();
  for (const d of dias) {
    const f     = d.fechaViaje;
    const label = `${DAYS[f.getDay()]} ${f.getDate()} ${MONTHS[f.getMonth()]}`;
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(d);
  }
  return Array.from(map.entries()).map(([label, recorridos]) => ({ label, recorridos }));
}
