import {
  Component,
  ChangeDetectionStrategy,
  computed,
  signal,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsabilityTrackerService } from '../../../../core/services/usability-tracker.service';
import { RECORRIDO_MOCK } from '../../data/recorrido.mock';
import { RecorridoData, EventoRecorrido, EventoTipo } from '../../models/recorrido.model';
import { MapViewComponent, PointInfo } from '../../components/map-view/map-view.component';

type ActiveTab = 'mapa' | 'historial';

type HistorialItem =
  | { kind: 'header'; id: string; recorrido: RecorridoData }
  | { kind: 'evento'; id: string; evento: EventoRecorrido; isLast: boolean };

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

interface ShareFormat { id: string; label: string; }
const SHARE_FORMATS: ShareFormat[] = [
  { id: 'xlm',  label: 'Formato XLM'  },
  { id: 'pdf',  label: 'Formato PDF'  },
  { id: 'html', label: 'Formato HTML' },
];

// Paleta de rutas: evita los colores semánticos de eventos
// (rojo=alerta, naranja=exceso, azul=ignition, violeta=zona) y el brand.
const TRIP_COLORS: TripColor[] = [
  { route: '#0D9488', chipBg: '#F0FDFA', chipBorder: '#99F6E4', chipText: '#0F766E' }, // teal
  { route: '#4F46E5', chipBg: '#EEF2FF', chipBorder: '#C7D2FE', chipText: '#4338CA' }, // indigo
  { route: '#DB2777', chipBg: '#FDF2F8', chipBorder: '#FBCFE8', chipText: '#BE185D' }, // magenta
  { route: '#059669', chipBg: '#ECFDF5', chipBorder: '#A7F3D0', chipText: '#047857' }, // green
  { route: '#0891B2', chipBg: '#ECFEFF', chipBorder: '#A5F3FC', chipText: '#0E7490' }, // cyan
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
  private readonly usabTracker = inject(UsabilityTrackerService);

  readonly sheetItems   = SHEET_ITEMS;
  readonly shareFormats = SHARE_FORMATS;

  viajeIds      = signal<string[]>([]);
  activeId      = signal<string>('');   // viaje enfocado en el mapa (vacío = ver todos)
  activeTab     = signal<ActiveTab>('mapa');
  sheetOpen       = signal(false);
  shareOpen       = signal(false);
  selectedTypes   = signal<Set<EventoTipo>>(new Set());
  selectedFormats = signal<Set<string>>(new Set());

  readonly selectedFormatCount = computed(() => this.selectedFormats().size);

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

  readonly historialItems = computed<HistorialItem[]>(() => {
    const focused = this.focusedRecorrido();

    if (focused) {
      const sorted = [...focused.eventos].sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
      return sorted.map((ev, i) => ({
        kind: 'evento' as const,
        id: `e-${ev.id}`,
        evento: ev,
        isLast: i === sorted.length - 1,
      }));
    }

    const items: HistorialItem[] = [];
    for (const r of this.allRecorridos()) {
      const sorted = [...r.eventos].sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
      if (sorted.length === 0) continue;
      items.push({ kind: 'header', id: `h-${r.viajeId}`, recorrido: r });
      sorted.forEach((ev, i) =>
        items.push({ kind: 'evento', id: `e-${ev.id}`, evento: ev, isLast: i === sorted.length - 1 })
      );
    }
    return items;
  });

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

  setTab(tab: ActiveTab): void {
    this.activeTab.set(tab);
    if (tab === 'historial') this.usabTracker.emit('historial_abierto');
  }

  openShare(): void {
    this.shareOpen.set(true);
    this.usabTracker.emit('compartir_abierto');
  }

  toggleFormat(id: string): void {
    const next = new Set(this.selectedFormats());
    if (next.has(id)) next.delete(id); else next.add(id);
    this.selectedFormats.set(next);
  }

  isFormatSelected(id: string): boolean {
    return this.selectedFormats().has(id);
  }

  applyShare(): void {
    this.dragY.set(0);
    this.isDragging.set(false);
    this.shareOpen.set(false);
  }

  confirmShare(): void {
    this.usabTracker.emit('compartir_confirmado', { formatos: [...this.selectedFormats()] });
    this.applyShare();
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

  historialLabel(tipo: EventoTipo): string {
    const labels: Record<EventoTipo, string> = {
      alerta:           'Frenada brusca',
      exceso_velocidad: 'Exceso de velocidad',
      reinicio:         'Ignition On',
      parada:           'Zona restringida',
    };
    return labels[tipo];
  }

  formatHistorialDate(fecha: Date): string {
    const days   = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const d   = days[fecha.getDay()];
    const mo  = months[fecha.getMonth()];
    const day = fecha.getDate();
    const h   = fecha.getHours();
    const m   = fecha.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12  = h % 12 || 12;
    return `${d} ${day} ${mo} · ${h12}:${m} ${ampm}`;
  }
}
