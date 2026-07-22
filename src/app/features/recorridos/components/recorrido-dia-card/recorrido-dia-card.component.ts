import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { RecorridoDia } from '../../models/recorrido-diario.model';

@Component({
  selector: 'app-recorrido-dia-card',
  standalone: true,
  templateUrl: './recorrido-dia-card.component.html',
  styleUrl: './recorrido-dia-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecorridoDiaCardComponent {
  recorrido = input.required<RecorridoDia>();
  selected  = input<boolean>(false);
  disabled  = input<boolean>(false);
  toggle    = output<string>();

  onToggle(): void {
    if (this.disabled() && !this.selected()) return;
    this.toggle.emit(this.recorrido().id);
  }

  get unidadLabel(): string {
    return this.recorrido().unidades[0] ?? '—';
  }

  formatDate(date: Date): string {
    const days   = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const h    = date.getHours();
    const m    = date.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12  = h % 12 || 12;
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} · ${h12}:${m} ${ampm}`;
  }
}
