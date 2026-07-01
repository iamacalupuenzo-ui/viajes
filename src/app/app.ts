import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MobileShellComponent } from './shared/components/mobile-shell/mobile-shell.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MobileShellComponent],
  template: '<app-mobile-shell />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
