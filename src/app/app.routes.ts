import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'viajes', pathMatch: 'full' },
  {
    path: 'viajes',
    loadChildren: () =>
      import('./features/viajes/viajes.routes').then(m => m.VIAJES_ROUTES),
  },
  {
    path: 'indicadores',
    loadChildren: () =>
      import('./features/indicadores/indicadores.routes').then(m => m.INDICADORES_ROUTES),
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
