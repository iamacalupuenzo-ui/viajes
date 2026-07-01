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
  eventSelected = output<EventoRecorrido | null>();

  private map?: L.Map;
  private layers: L.Layer[] = [];
  private readonly zone = inject(NgZone);

  constructor() {
    // Re-render capas cuando cambien los datos
    effect(() => {
      const recorridos = this.recorridos();
      const eventos    = this.eventos();
      const colors     = this.tripColors();
      if (this.map) {
        this.zone.runOutsideAngular(() => this.renderLayers(recorridos, eventos, colors));
      }
    });

    // Fly to viaje enfocado (usa untracked para no depender de recorridos aquí)
    effect(() => {
      const id = this.focusedId();
      if (!this.map) return;

      this.zone.runOutsideAngular(() => {
        if (!id) {
          // Deseleccionado: vuelve a ver todos
          const all = untracked(() => this.recorridos());
          const bounds = all.flatMap(r => [r.puntoA.coords, r.puntoB.coords, ...r.ruta]);
          if (bounds.length) this.map!.flyToBounds(bounds as L.LatLngTuple[], { padding: [48, 32], duration: 0.7 });
        } else {
          const all = untracked(() => this.recorridos());
          const r   = all.find(rec => rec.viajeId === id);
          if (!r) return;
          const bounds: [number, number][] = [r.puntoA.coords, ...r.ruta, r.puntoB.coords];
          this.map!.flyToBounds(bounds as L.LatLngTuple[], { padding: [48, 32], maxZoom: 15, duration: 0.7 });
        }
      });
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

          // Click en fondo del mapa → cierra el card
          this.map.on('click', () => {
            this.zone.run(() => this.eventSelected.emit(null));
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

    if (!this.map || recorridos.length === 0) return;

    const allBounds: [number, number][] = [];

    recorridos.forEach((recorrido, i) => {
      const color = colors[i] ?? '#292622';
      const { puntoA, puntoB, ruta } = recorrido;
      const routePoints: [number, number][] = [puntoA.coords, ...ruta, puntoB.coords];

      const polyline = L.polyline(routePoints, { color, weight: 3.5, opacity: 0.9 }).addTo(this.map!);
      this.layers.push(polyline);

      const markerA = L.marker(puntoA.coords, { icon: this.pointIcon('A', color) })
        .bindPopup(`<b>Inicio — Viaje ${i + 1}</b><br>${puntoA.direccion}`, { offset: [0, 20] })
        .addTo(this.map!);
      const markerB = L.marker(puntoB.coords, { icon: this.pointIcon('B', color) })
        .bindPopup(`<b>Destino — Viaje ${i + 1}</b><br>${puntoB.direccion}`, { offset: [0, 20] })
        .addTo(this.map!);

      this.layers.push(markerA, markerB);
      allBounds.push(puntoA.coords, puntoB.coords, ...ruta);
    });

    for (const ev of eventos) {
      const m = L.marker(ev.coords, { icon: this.eventoIcon(ev.tipo) }).addTo(this.map!);
      m.on('click', (e: L.LeafletMouseEvent) => {
        L.DomEvent.stopPropagation(e);
        this.zone.run(() => this.eventSelected.emit(ev));
      });
      this.layers.push(m);
      allBounds.push(ev.coords);
    }

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
