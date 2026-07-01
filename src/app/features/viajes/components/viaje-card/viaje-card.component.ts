import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { Viaje } from '../../models/viaje.model';

@Component({
  selector: 'app-viaje-card',
  standalone: true,
  imports: [],
  templateUrl: './viaje-card.component.html',
  styleUrl: './viaje-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViajeCardComponent {
  viaje    = input.required<Viaje>();
  selected = input<boolean>(false);
  disabled = input<boolean>(false);
  toggle   = output<string>();

  onToggle(): void {
    if (this.disabled() && !this.selected()) return;
    this.toggle.emit(this.viaje().id);
  }

  formatDate(date: Date): string {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const h = date.getHours();
    const m = date.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} · ${h12}:${m} ${ampm}`;
  }

  formatPrice(precio: number): string {
    return `S/ ${precio.toFixed(2)}`;
  }
}
