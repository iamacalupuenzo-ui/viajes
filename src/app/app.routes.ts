import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'viajes', pathMatch: 'full' },
  {
    path: 'viajes',
    loadChildren: () =>
      import('./features/viajes/viajes.routes').then(m => m.VIAJES_ROUTES),
  },
  { path: '**', redirectTo: 'viajes' },
];
