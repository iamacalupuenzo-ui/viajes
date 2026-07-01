import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
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
  private readonly router = inject(Router);

  private isMapRoute(url: string): boolean {
    return url.includes('/recorrido') || url.includes('/indicadores');
  }

  readonly isFullscreen = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map((e: NavigationEnd) => this.isMapRoute(e.urlAfterRedirects)),
      startWith(this.isMapRoute(this.router.url)),
    ),
    { initialValue: false },
  );
}
