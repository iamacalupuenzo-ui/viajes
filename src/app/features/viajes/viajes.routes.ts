import { Routes } from '@angular/router';

export const VIAJES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/viajes-list/viajes-list.component').then(m => m.ViajesListComponent),
  },
];
