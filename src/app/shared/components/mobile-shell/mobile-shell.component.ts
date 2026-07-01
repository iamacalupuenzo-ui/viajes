import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StatusBarComponent } from '../status-bar/status-bar.component';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-mobile-shell',
  standalone: true,
  imports: [RouterOutlet, StatusBarComponent, BottomNavComponent],
  templateUrl: './mobile-shell.component.html',
  styleUrl: './mobile-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileShellComponent {}
