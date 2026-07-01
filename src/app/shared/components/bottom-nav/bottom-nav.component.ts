import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: 'home' | 'chart' | 'car' | 'person';
}

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomNavComponent {
  readonly items: NavItem[] = [
    { label: 'Home', route: '/home', icon: 'home' },
    { label: 'Indicadores', route: '/indicadores', icon: 'chart' },
    { label: 'Viajes', route: '/viajes', icon: 'car' },
    { label: 'Perfil', route: '/perfil', icon: 'person' },
  ];
}
