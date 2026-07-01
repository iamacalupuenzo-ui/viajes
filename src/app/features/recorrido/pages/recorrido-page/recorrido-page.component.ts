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

type ActiveTab    = 'mapa' | 'historial';
type FilterOpcion = 'todos' | EventoTipo;

interface FilterChip {
  value: FilterOpcion;
  label: string;
}

const FILTER_CHIPS: FilterChip[] = [
  { value: 'todos',           label: 'Todos'      },
  { value: 'alerta',          label: 'Alertas'    },
  { value: 'parada',          label: 'Paradas'    },
  { value: 'exceso_velocidad',label: 'Velocidad'  },
  { value: 'reinicio',        label: 'Reinicio'   },
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

  readonly filterChips = FILTER_CHIPS;

  viajeIds     = signal<string[]>([]);
  activeId     = signal<string>('');
  activeTab    = signal<ActiveTab>('mapa');
  activeFilter = signal<FilterOpcion>('todos');

  readonly activeRecorrido = computed<RecorridoData | undefined>(() =>
    RECORRIDO_MOCK.find(r => r.viajeId === this.activeId())
  );

  readonly filteredEventos = computed<EventoRecorrido[]>(() => {
    const recorrido = this.activeRecorrido();
    if (!recorrido) return [];
    const filter = this.activeFilter();
    if (filter === 'todos') return recorrido.eventos;
    return recorrido.eventos.filter(e => e.tipo === filter);
  });


  ngOnInit(): void {
    const raw = this.route.snapshot.queryParamMap.get('ids') ?? '';
    const ids = raw.split(',').filter(id => id.trim().length > 0);
    this.viajeIds.set(ids);
    this.activeId.set(ids[0] ?? '');
  }

  selectViaje(id: string): void {
    this.activeId.set(id);
  }

  selectFilter(f: FilterOpcion): void {
    this.activeFilter.set(f);
  }

  goBack(): void {
    this.router.navigate(['/viajes']);
  }

  tripLabel(index: number): string {
    return `Viaje ${index + 1}`;
  }
}
