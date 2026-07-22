import { Routes } from '@angular/router';

export const RECORRIDOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/recorridos-page/recorridos-page.component').then(
        m => m.RecorridosPageComponent
      ),
  },
];
