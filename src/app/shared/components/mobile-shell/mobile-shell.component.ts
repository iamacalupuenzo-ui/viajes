import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StatusBarComponent } from '../status-bar/status-bar.component';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';
import { FilterDrawerComponent } from '../../../features/viajes/components/filter-drawer/filter-drawer.component';
import { FilterStateService } from '../../../core/services/filter-state.service';

@Component({
  selector: 'app-mobile-shell',
  standalone: true,
  imports: [RouterOutlet, StatusBarComponent, BottomNavComponent, FilterDrawerComponent],
  templateUrl: './mobile-shell.component.html',
  styleUrl: './mobile-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileShellComponent {
  readonly filterState = inject(FilterStateService);
}
