import { Routes } from '@angular/router';

export const RECORRIDO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/recorrido-page/recorrido-page.component').then(
        m => m.RecorridoPageComponent
      ),
  },
];
