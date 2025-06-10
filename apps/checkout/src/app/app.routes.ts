import { AddToCartComponent } from './add-to-cart/add-to-cart.component';
import { MiniCartComponent } from './minicart/minicart.component';
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () => import('./entry.routes').then((m) => m.remoteRoutes),
  },
  {
    path: 'minicart',
    component: MiniCartComponent,
  },
  {
    path: 'addToCart',
    component: AddToCartComponent,
  },
];
