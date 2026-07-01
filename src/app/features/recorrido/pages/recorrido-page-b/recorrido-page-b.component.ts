/**
 * RECORRIDO PAGE — Type B (A/B Test)
 *
 * Diseño single-trip: muestra un viaje a la vez en el mapa.
 * Seleccionar un chip cambia qué viaje se muestra (no hace zoom).
 * Filtro de eventos: bottom sheet multi-select (mismo estándar que Type A).
 *
 * Usar en: features/indicadores
 * Comparar con: recorrido-page (Type A) — multi-trip simultáneo con zoom
 */
import {
  Component,
  ChangeDetectionStrategy,
  computed,
  signal,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RECORRIDO_MOCK } from '../../data/recorrido.mock';
import { RecorridoData, EventoRecorrido, EventoTipo } from '../../models/recorrido.model';
import { MapViewSingleComponent } from '../../components/map-view-single/map-view-single.component';

type ActiveTab = 'mapa' | 'historial';

interface SheetItem {
  tipo: EventoTipo;
  label: string;
}

const SHEET_ITEMS: SheetItem[] = [
  { tipo: 'alerta',           label: 'Alerta / Frenada brusca' },
  { tipo: 'exceso_velocidad', label: 'Exceso de velocidad'     },
  { tipo: 'reinicio',         label: 'Ignition On / Off'       },
  { tipo: 'parada',           label: 'Parada prolongada'       },
];

@Component({
  selector: 'app-recorrido-page-b',
  standalone: true,
  imports: [MapViewSingleComponent],
  templateUrl: './recorrido-page-b.component.html',
  styleUrl: './recorrido-page-b.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecorridoPageBComponent implements OnInit {
  private readonly route  = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly sheetItems = SHEET_ITEMS;

  viajeIds      = signal<string[]>([]);
  activeId      = signal<string>('');
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
    if (types.size === 0) return r.eventos;
    return r.eventos.filter(e => types.has(e.tipo));
  });

  readonly activeFilterCount = computed(() => this.selectedTypes().size);

  ngOnInit(): void {
    const raw = this.route.snapshot.queryParamMap.get('ids') ?? '';
    const ids = raw.split(',').filter(id => id.trim().length > 0);
    this.viajeIds.set(ids);
    this.activeId.set(ids[0] ?? '');
  }

  selectViaje(id: string): void {
    this.activeId.set(id);
  }

  toggleType(tipo: EventoTipo): void {
    const next = new Set(this.selectedTypes());
    if (next.has(tipo)) next.delete(tipo); else next.add(tipo);
    this.selectedTypes.set(next);
  }

  isTypeSelected(tipo: EventoTipo): boolean {
    return this.selectedTypes().has(tipo);
  }

  clearFilter(): void {
    this.selectedTypes.set(new Set());
  }

  applySheet(): void {
    this.dragY.set(0);
    this.isDragging.set(false);
    this.sheetOpen.set(false);
  }

  onDragStart(event: TouchEvent): void {
    this.dragStartY = event.touches[0].clientY;
    this.isDragging.set(true);
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

  goBack(): void {
    this.router.navigate(['/viajes']);
  }

  tripLabel(index: number): string {
    return `Viaje ${index + 1}`;
  }
}
