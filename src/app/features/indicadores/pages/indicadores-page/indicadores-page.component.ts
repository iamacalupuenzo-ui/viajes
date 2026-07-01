import {
  Component,
  ChangeDetectionStrategy,
  computed,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { RECORRIDO_MOCK } from '../../../recorrido/data/recorrido.mock';
import { RecorridoData, EventoRecorrido, EventoTipo } from '../../../recorrido/models/recorrido.model';
import { MapViewSingleComponent } from '../../../recorrido/components/map-view-single/map-view-single.component';

type ActiveTab = 'mapa' | 'historial';

interface SheetItem { tipo: EventoTipo; label: string; }

const SHEET_ITEMS: SheetItem[] = [
  { tipo: 'alerta',           label: 'Alerta / Frenada brusca' },
  { tipo: 'exceso_velocidad', label: 'Exceso de velocidad'     },
  { tipo: 'reinicio',         label: 'Ignition On / Off'       },
  { tipo: 'parada',           label: 'Parada prolongada'       },
];

// Indicadores carga todos los viajes disponibles del mock
const ALL_IDS = RECORRIDO_MOCK.map(r => r.viajeId);

@Component({
  selector: 'app-indicadores-page',
  standalone: true,
  imports: [MapViewSingleComponent],
  templateUrl: './indicadores-page.component.html',
  styleUrl: './indicadores-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndicadoresPageComponent {
  private readonly router = inject(Router);

  readonly sheetItems = SHEET_ITEMS;
  readonly viajeIds   = ALL_IDS;

  activeId      = signal<string>(ALL_IDS[0] ?? '');
  activeTab     = signal<ActiveTab>('mapa');
  sheetOpen     = signal(false);
  selectedTypes = signal<Set<EventoTipo>>(new Set());

  dragY       = signal(0);
  isDragging  = signal(false);
  private dragStartY = 0;

  readonly activeRecorrido = computed<RecorridoData | undefined>(() =>
    RECORRIDO_MOCK.find(r => r.viajeId === this.activeId())
  );

  readonly eventCounts = computed<Partial<Record<EventoTipo, number>>>(() => {
    const r = this.activeRecorrido();
    if (!r) return {};
    return r.eventos.reduce((acc, e) => {
      acc[e.tipo] = (acc[e.tipo] ?? 0) + 1;
      return acc;
    }, {} as Partial<Record<EventoTipo, number>>);
  });

  readonly filteredEventos = computed<EventoRecorrido[]>(() => {
    const r = this.activeRecorrido();
    if (!r) return [];
    const types = this.selectedTypes();
    return types.size === 0 ? r.eventos : r.eventos.filter(e => types.has(e.tipo));
  });

  readonly activeFilterCount = computed(() => this.selectedTypes().size);

  selectViaje(id: string): void { this.activeId.set(id); }

  toggleType(tipo: EventoTipo): void {
    const next = new Set(this.selectedTypes());
    if (next.has(tipo)) next.delete(tipo); else next.add(tipo);
    this.selectedTypes.set(next);
  }

  isTypeSelected(tipo: EventoTipo): boolean { return this.selectedTypes().has(tipo); }
  clearFilter(): void { this.selectedTypes.set(new Set()); }

  applySheet(): void {
    this.dragY.set(0); this.isDragging.set(false); this.sheetOpen.set(false);
  }

  onDragStart(event: TouchEvent): void {
    this.dragStartY = event.touches[0].clientY; this.isDragging.set(true);
  }
  onDragMove(event: TouchEvent): void {
    if (!this.isDragging()) return;
    this.dragY.set(Math.max(0, event.touches[0].clientY - this.dragStartY));
  }
  onDragEnd(): void {
    if (!this.isDragging()) return;
    if (this.dragY() > 110) this.applySheet();
    else { this.dragY.set(0); this.isDragging.set(false); }
  }

  goBack(): void { this.router.navigate(['/viajes']); }
  tripLabel(index: number): string { return `Viaje ${index + 1}`; }
}
