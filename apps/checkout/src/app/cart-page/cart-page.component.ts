/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';

import { ButtonComponent } from '../components/Button/Button.component';
import { CommonModule } from '@angular/common';
import { DataService } from '../data/data.service';
import { LineItemComponent } from '../components/line-item/line-item.component';
import { MfeLoaderModule } from '@tractor-store-angular/load-mfe';
import { StoreService } from '../data/store.service';

@Component({
  selector: 'checkout-cart',
  imports: [CommonModule, ButtonComponent, LineItemComponent, MfeLoaderModule],
  templateUrl: './cart-page.component.html',
  providers: [{ provide: 'token', useClass: StoreService }],
  styleUrl: './cart-page.component.scss',
})
export class CartPageComponent implements OnInit {
  dataSvc = inject(DataService);

  headerConfig = {
    REMOTE_URL: 'http://localhost:4202/remoteEntry.js',
    EXPOSED_MODULE: './Header',
    MODULE_NAME: 'HeaderComponent',
  };

  headerInputs = {};

  total = 0;
  skus: any[] = [];
  lineItems: {
    quantity: number;
    total: number;
    id: string;
    name: string;
    sku: string;
    price: number;
    image: string;
    inventory: number;
  }[] = [];

  constructor(@Inject('token') private dataStore: StoreService) {}

  ngOnInit(): void {
    const rawLineItems = this.dataStore.useLineItems();
    console.log(rawLineItems());
    this.lineItems = this.convertToLineItems(rawLineItems());
    this.total = this.lineItems.reduce((res, { total }) => res + total, 0);
    this.skus = this.lineItems.map(({ sku }) => sku);
  }

  convertToLineItems(items: Array<{ sku: string; quantity: number }>) {
    return items.reduce(
      (
        res: Array<{
          quantity: number;
          total: number;
          id: string;
          name: string;
          sku: string;
          price: number;
          image: string;
          inventory: number;
        }>,
        { sku, quantity }
      ) => {
        const variant = this.dataSvc.data.variants.find((p) => p.sku === sku);
        if (variant) {
          res.push({ ...variant, quantity, total: variant.price * quantity });
        }
        return res;
      },
      []
    );
  }
}
