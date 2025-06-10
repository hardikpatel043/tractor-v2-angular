import { CategoryPageComponent } from './categorypage/categorypage.component';
import { HomepageComponent } from './homepage/homepage.component';
import { Route } from '@angular/router';
import { StorePageComponent } from './store-page/store-page.component';

export const remoteRoutes: Route[] = [
  { path: '', component: HomepageComponent },
  {
    path: 'products',
    component: CategoryPageComponent
  },
  {
    path: 'stores',
    component: StorePageComponent
  },
];
