import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'viajes', pathMatch: 'full' },
  {
    path: 'viajes',
    loadChildren: () =>
      import('./features/viajes/viajes.routes').then(m => m.VIAJES_ROUTES),
  },
  {
    path: 'recorridos',
    loadChildren: () =>
      import('./features/recorridos/recorridos.routes').then(m => m.RECORRIDOS_ROUTES),
  },
  {
    path: 'perfil',
    loadComponent: () =>
      import('./features/perfil/pages/perfil-page/perfil-page.component').then(
        m => m.PerfilPageComponent
      ),
  },
  { path: '**', redirectTo: 'viajes' },
];
