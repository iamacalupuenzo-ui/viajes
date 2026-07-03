import {
  Component,
  input,
  output,
  effect,
  untracked,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  NgZone,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import * as L from 'leaflet';
import { RecorridoData, EventoRecorrido, EventoTipo } from '../../models/recorrido.model';

export interface PointInfo {
  tipo: 'Inicio' | 'Destino';
  tripNum: number;
  direccion: string;
  color: string;
}

@Component({
  selector: 'app-map-view',
  standalone: true,
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MapViewComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapEl') mapEl!: ElementRef<HTMLDivElement>;

  recorridos    = input<RecorridoData[]>([]);
  eventos       = input<EventoRecorrido[]>([]);
  focusedId     = input<string>('');
  tripColors    = input<string[]>([]);
  zoomBottom    = input<number>(16);
  eventSelected = output<EventoRecorrido | null>();
  pointSelected = output<PointInfo | null>();
  tripSelected  = output<string>();

  private map?: L.Map;
  private layers: L.Layer[] = [];
  private layersByTrip: { polyline: L.Polyline; markers: L.Marker[]; eventMarkers: L.Marker[] }[] = [];
  private readonly zone = inject(NgZone);

  constructor() {
    // Re-render capas cuando cambien los datos
    effect(() => {
      const recorridos = this.recorridos();
      const eventos    = this.eventos();
      const colors     = this.tripColors();
      if (this.map) {
        this.zone.runOutsideAngular(() => {
          this.renderLayers(recorridos, eventos, colors);
          this.applyFocusOpacity(untracked(() => this.focusedId()), recorridos);
        });
      }
    });

    // Fly to viaje enfocado + aplicar opacidad
    effect(() => {
      const id = this.focusedId();
      if (!this.map) return;

      this.zone.runOutsideAngular(() => {
        const all = untracked(() => this.recorridos());
        this.applyFocusOpacity(id, all);

        if (!id) {
          const bounds = all.flatMap(r => [r.puntoA.coords, r.puntoB.coords, ...r.ruta]);
          if (bounds.length) this.map!.flyToBounds(bounds as L.LatLngTuple[], {
            padding: [40, 28],
            duration: 0.9,
            easeLinearity: 0.25,
          });
        } else {
          const r = all.find(rec => rec.viajeId === id);
          if (!r) return;
          const bounds: [number, number][] = [r.puntoA.coords, ...r.ruta, r.puntoB.coords];
          this.map!.flyToBounds(bounds as L.LatLngTuple[], {
            paddingTopLeft:    [24, 24],
            paddingBottomRight:[24, 80],
            maxZoom: 15,
            duration: 1.1,
            easeLinearity: 0.2,
          });
        }
      });
    });
  }

  private applyFocusOpacity(focusedId: string, recorridos: RecorridoData[]): void {
    this.layersByTrip.forEach((group, i) => {
      const isActive        = !focusedId || recorridos[i]?.viajeId === focusedId;
      const routeOpacity    = isActive ? 0.9  : 0.2;
      const markerOpacity   = isActive ? 1    : 0.25;
      group.polyline.setStyle({ opacity: routeOpacity });
      group.markers.forEach(m => m.setOpacity(markerOpacity));
      group.eventMarkers.forEach(m => m.setOpacity(markerOpacity));
    });
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.map = L.map(this.mapEl.nativeElement, {
            zoomControl: false,
            attributionControl: false,
          });

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
          }).addTo(this.map);

          L.control.zoom({ position: 'bottomright' }).addTo(this.map);

          // Click en fondo del mapa → cierra cards y limpia selección
          this.map.on('click', () => {
            this.zone.run(() => {
              this.eventSelected.emit(null);
              this.pointSelected.emit(null);
              this.tripSelected.emit('');
            });
          });

          this.renderLayers(this.recorridos(), this.eventos(), this.tripColors());
        });
      });
    });
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  private renderLayers(
    recorridos: RecorridoData[],
    eventos: EventoRecorrido[],
    colors: string[],
  ): void {
    this.layers.forEach(l => l.remove());
    this.layers = [];
    this.layersByTrip = [];

    if (!this.map || recorridos.length === 0) return;

    const allBounds: [number, number][] = [];

    // Set de IDs visibles (ya filtrados por tipo desde el padre)
    const visibleEventIds = new Set(eventos.map(e => e.id));

    recorridos.forEach((recorrido, i) => {
      const color = colors[i] ?? '#292622';
      const { puntoA, puntoB, ruta } = recorrido;
      const routePoints: [number, number][] = [puntoA.coords, ...ruta, puntoB.coords];

      const viajeId = recorrido.viajeId;

      const polyline = L.polyline(routePoints, { color, weight: 3.5, opacity: 0.9 }).addTo(this.map!);
      polyline.on('click', (e: L.LeafletMouseEvent) => {
        L.DomEvent.stopPropagation(e);
        this.zone.run(() => this.tripSelected.emit(viajeId));
      });

      const markerA = L.marker(puntoA.coords, { icon: this.pointIcon('A', color) }).addTo(this.map!);
      markerA.on('click', (e: L.LeafletMouseEvent) => {
        L.DomEvent.stopPropagation(e);
        this.zone.run(() => {
          this.tripSelected.emit(viajeId);
          this.pointSelected.emit({ tipo: 'Inicio', tripNum: i + 1, direccion: puntoA.direccion, color });
        });
      });

      const markerB = L.marker(puntoB.coords, { icon: this.pointIcon('B', color) }).addTo(this.map!);
      markerB.on('click', (e: L.LeafletMouseEvent) => {
        L.DomEvent.stopPropagation(e);
        this.zone.run(() => {
          this.tripSelected.emit(viajeId);
          this.pointSelected.emit({ tipo: 'Destino', tripNum: i + 1, direccion: puntoB.direccion, color });
        });
      });

      // Eventos de este viaje que están visibles (respetan el filtro de tipo)
      const eventMarkers: L.Marker[] = [];
      for (const ev of recorrido.eventos) {
        if (!visibleEventIds.has(ev.id)) continue;
        const m = L.marker(ev.coords, { icon: this.eventoIcon(ev.tipo) }).addTo(this.map!);
        m.on('click', (e: L.LeafletMouseEvent) => {
          L.DomEvent.stopPropagation(e);
          this.zone.run(() => {
            this.tripSelected.emit(viajeId);
            this.eventSelected.emit(ev);
          });
        });
        eventMarkers.push(m);
        allBounds.push(ev.coords);
      }

      this.layersByTrip.push({ polyline, markers: [markerA, markerB], eventMarkers });
      this.layers.push(polyline, markerA, markerB, ...eventMarkers);
      allBounds.push(puntoA.coords, puntoB.coords, ...ruta);
    });

    if (allBounds.length) {
      this.map.fitBounds(allBounds as L.LatLngTuple[], { padding: [48, 32] });
    }
  }

  private pointIcon(label: 'A' | 'B', color: string): L.DivIcon {
    return L.divIcon({
      className: '',
      html: `<div class="map-point" style="background:${color}">${label}</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  }

  private eventoIcon(tipo: EventoTipo): L.DivIcon {
    const glyphs: Record<EventoTipo, string> = {
      alerta:           '!',
      reinicio:         '↺',
      exceso_velocidad: '⚡',
      parada:           'P',
    };
    return L.divIcon({
      className: '',
      html: `<div class="map-evento map-evento--${tipo}">${glyphs[tipo]}</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
  }
}

const EVENTO_LABELS: Record<EventoTipo, string> = {
  alerta:           'Alerta',
  reinicio:         'Reinicio de motor',
  exceso_velocidad: 'Exceso de velocidad',
  parada:           'Parada',
};
