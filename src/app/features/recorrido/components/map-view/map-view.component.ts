import {
  Component,
  input,
  effect,
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

  recorrido = input<RecorridoData | undefined>(undefined);
  eventos   = input<EventoRecorrido[]>([]);

  private map?: L.Map;
  private layers: L.Layer[] = [];
  private readonly zone = inject(NgZone);

  constructor() {
    effect(() => {
      const r  = this.recorrido();
      const ev = this.eventos();
      if (this.map) {
        this.zone.runOutsideAngular(() => this.renderLayers(r, ev));
      }
    });
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.map = L.map(this.mapEl.nativeElement, {
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(this.map);

      L.control.zoom({ position: 'bottomright' }).addTo(this.map);

      // Defer so the flex container has its final dimensions
      setTimeout(() => {
        this.map!.invalidateSize();
        this.renderLayers(this.recorrido(), this.eventos());
      }, 80);
    });
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  private renderLayers(recorrido: RecorridoData | undefined, eventos: EventoRecorrido[]): void {
    this.layers.forEach(l => l.remove());
    this.layers = [];

    if (!recorrido || !this.map) return;

    const { puntoA, puntoB, ruta } = recorrido;
    const routePoints: [number, number][] = [puntoA.coords, ...ruta, puntoB.coords];

    const polyline = L.polyline(routePoints, {
      color: '#292622',
      weight: 3,
      opacity: 0.9,
    }).addTo(this.map);
    this.layers.push(polyline);

    const markerA = L.marker(puntoA.coords, { icon: this.pointIcon('A') })
      .bindPopup(`<b>Punto A — Inicio</b><br>${puntoA.direccion}`)
      .addTo(this.map);

    const markerB = L.marker(puntoB.coords, { icon: this.pointIcon('B') })
      .bindPopup(`<b>Punto B — Destino</b><br>${puntoB.direccion}`)
      .addTo(this.map);

    this.layers.push(markerA, markerB);

    for (const ev of eventos) {
      const m = L.marker(ev.coords, { icon: this.eventoIcon(ev.tipo) })
        .bindPopup(`<b>${EVENTO_LABELS[ev.tipo]}</b><br>${ev.descripcion}`)
        .addTo(this.map);
      this.layers.push(m);
    }

    const allPoints: [number, number][] = [
      puntoA.coords,
      puntoB.coords,
      ...ruta,
      ...eventos.map(e => e.coords),
    ];
    this.map.fitBounds(allPoints as L.LatLngTuple[], { padding: [48, 32] });
  }

  private pointIcon(label: 'A' | 'B'): L.DivIcon {
    return L.divIcon({
      className: '',
      html: `<div class="map-point map-point--${label.toLowerCase()}">${label}</div>`,
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
