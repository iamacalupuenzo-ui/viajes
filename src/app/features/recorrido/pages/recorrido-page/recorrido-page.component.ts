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
import { MapViewComponent, PointInfo } from '../../components/map-view/map-view.component';

type ActiveTab = 'mapa' | 'historial';

interface SheetItem {
  tipo: EventoTipo;
  label: string;
}

interface TripColor {
  route:  string;
  chipBg: string;
  chipBorder: string;
  chipText: string;
}

const SHEET_ITEMS: SheetItem[] = [
  { tipo: 'alerta',           label: 'Alerta / Frenada brusca' },
  { tipo: 'exceso_velocidad', label: 'Exceso de velocidad'     },
  { tipo: 'reinicio',         label: 'Ignition On / Off'       },
  { tipo: 'parada',           label: 'Parada prolongada'       },
];

const TRIP_COLORS: TripColor[] = [
  { route: '#3B82F6', chipBg: '#EFF6FF', chipBorder: '#BFDBFE', chipText: '#1D4ED8' },
  { route: '#10B981', chipBg: '#ECFDF5', chipBorder: '#A7F3D0', chipText: '#065F46' },
  { route: '#8B5CF6', chipBg: '#F5F3FF', chipBorder: '#DDD6FE', chipText: '#5B21B6' },
  { route: '#F97316', chipBg: '#FFF7ED', chipBorder: '#FED7AA', chipText: '#C2410C' },
  { route: '#EC4899', chipBg: '#FDF2F8', chipBorder: '#FBCFE8', chipText: '#9D174D' },
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
  activeId      = signal<string>('');   // viaje enfocado en el mapa (vacío = ver todos)
  activeTab     = signal<ActiveTab>('mapa');
  sheetOpen     = signal(false);
  selectedTypes = signal<Set<EventoTipo>>(new Set());

  selectedEvent = signal<EventoRecorrido | null>(null);
  selectedPoint = signal<PointInfo | null>(null);

  // Drag-to-close
  dragY       = signal(0);
  isDragging  = signal(false);
  private dragStartY = 0;

  // Todos los recorridos activos
  readonly allRecorridos = computed<RecorridoData[]>(() =>
    this.viajeIds()
      .map(id => RECORRIDO_MOCK.find(r => r.viajeId === id))
      .filter((r): r is RecorridoData => !!r)
  );

  // Colores de ruta para el mapa (en el mismo orden que allRecorridos)
  readonly tripRouteColors = computed<string[]>(() =>
    this.allRecorridos().map((_, i) => TRIP_COLORS[i % TRIP_COLORS.length].route)
  );

  // Info del viaje enfocado (para la sección de datos)
  readonly focusedRecorrido = computed<RecorridoData | undefined>(() =>
    this.allRecorridos().find(r => r.viajeId === this.activeId())
  );

  // Conteo de eventos sumando todos los viajes
  readonly eventCounts = computed<Partial<Record<EventoTipo, number>>>(() => {
    const allEvents = this.allRecorridos().flatMap(r => r.eventos);
    return allEvents.reduce((acc, e) => {
      acc[e.tipo] = (acc[e.tipo] ?? 0) + 1;
      return acc;
    }, {} as Partial<Record<EventoTipo, number>>);
  });

  // Eventos de todos los viajes filtrados por tipo
  readonly filteredEventos = computed<EventoRecorrido[]>(() => {
    const types = this.selectedTypes();
    const allEvents = this.allRecorridos().flatMap(r => r.eventos);
    if (types.size === 0) return allEvents;
    return allEvents.filter(e => types.has(e.tipo));
  });

  readonly activeFilterCount = computed(() => this.selectedTypes().size);

  ngOnInit(): void {
    const raw = this.route.snapshot.queryParamMap.get('ids') ?? '';
    const ids = raw.split(',').filter(id => id.trim().length > 0);
    this.viajeIds.set(ids);
    if (ids.length === 1) this.activeId.set(ids[0]);
  }

  tripColor(index: number): TripColor {
    return TRIP_COLORS[index % TRIP_COLORS.length];
  }

  // Toggle desde chip: segundo click deselecciona
  selectViaje(id: string): void {
    if (this.viajeIds().length === 1) return;
    this.activeId.set(this.activeId() === id ? '' : id);
  }

  // Selección desde mapa: siempre establece, nunca deselecciona al re-click
  focusViaje(id: string): void {
    if (id === '') {
      if (this.viajeIds().length === 1) return;
      this.activeId.set('');
    } else {
      this.activeId.set(id);
    }
  }

  readonly cardVisible = computed(() => !!this.selectedEvent() || !!this.selectedPoint());

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

  eventoLabel(tipo: EventoTipo): string {
    const labels: Record<EventoTipo, string> = {
      alerta:           'Alerta / Frenada brusca',
      exceso_velocidad: 'Exceso de velocidad',
      reinicio:         'Ignition On / Off',
      parada:           'Parada prolongada',
    };
    return labels[tipo];
  }
}
