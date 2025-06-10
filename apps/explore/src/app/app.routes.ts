import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () => import('./entry.routes').then((m) => m.remoteRoutes),
  },
];
