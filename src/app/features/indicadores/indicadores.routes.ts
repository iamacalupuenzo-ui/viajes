import { Routes } from '@angular/router';

export const INDICADORES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/indicadores-page/indicadores-page.component').then(
        m => m.IndicadoresPageComponent
      ),
  },
];
