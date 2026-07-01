import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-selection-actions',
  standalone: true,
  imports: [],
  templateUrl: './selection-actions.component.html',
  styleUrl: './selection-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionActionsComponent {
  count = input<number>(0);
  limpiar = output<void>();
  verRecorrido = output<void>();
}
