import { Route } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'explore',
  },
  {
    path: 'explore',
    loadChildren: () =>
      loadRemoteModule({
        type: 'manifest',
        remoteName: 'explore',
        exposedModule: './Routes',
      }).then((m) => m.remoteRoutes),
  },
  {
    path: 'decide',
    loadChildren: () =>
      loadRemoteModule({
        type: 'manifest',
        remoteName: 'decide',
        exposedModule: './Routes',
      }).then((m) => m.remoteRoutes),
  },
  {
    path: 'checkout',
    loadChildren: () =>
      loadRemoteModule({
        type: 'manifest',
        remoteName: 'checkout',
        exposedModule: './Routes',
      }).then((m) => m.remoteRoutes),
  },
];
