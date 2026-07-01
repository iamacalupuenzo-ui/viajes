import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-status-bar',
  standalone: true,
  imports: [],
  templateUrl: './status-bar.component.html',
  styleUrl: './status-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBarComponent {
  readonly time = '9:41';
}
