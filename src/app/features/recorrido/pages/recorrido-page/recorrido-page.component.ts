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
import { MapViewComponent } from '../../components/map-view/map-view.component';

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
  selector: 'app-recorrido-page',
  standalone: true,
  imports: [MapViewComponent],
  templateUrl: './recorrido-page.component.html',
  styleUrl: './recorrido-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecorridoPageComponent implements OnInit {
  private readonly route  = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly sheetItems = SHEET_ITEMS;

  viajeIds      = signal<string[]>([]);
  activeId      = signal<string>('');
  activeTab     = signal<ActiveTab>('mapa');
  sheetOpen     = signal(false);
  selectedTypes = signal<Set<EventoTipo>>(new Set());

  // Drag-to-close
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
    const recorrido = this.activeRecorrido();
    if (!recorrido) return [];
    const types = this.selectedTypes();
    if (types.size === 0) return recorrido.eventos;
    return recorrido.eventos.filter(e => types.has(e.tipo));
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
    if (next.has(tipo)) next.delete(tipo);
    else next.add(tipo);
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
    const delta = Math.max(0, event.touches[0].clientY - this.dragStartY);
    this.dragY.set(delta);
  }

  onDragEnd(): void {
    if (!this.isDragging()) return;
    if (this.dragY() > 110) {
      this.applySheet();
    } else {
      this.dragY.set(0);
      this.isDragging.set(false);
    }
  }

  goBack(): void {
    this.router.navigate(['/viajes']);
  }

  tripLabel(index: number): string {
    return `Viaje ${index + 1}`;
  }
}
