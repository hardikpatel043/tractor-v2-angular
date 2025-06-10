import { ProductPageComponent } from './product-page/product-page.component';
import { Route } from '@angular/router';

export const remoteRoutes: Route[] = [
  { path: 'product', component: ProductPageComponent },
];
