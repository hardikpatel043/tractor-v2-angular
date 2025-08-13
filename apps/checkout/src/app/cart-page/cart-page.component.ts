/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  inject,
  signal,
  effect,
  computed,
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
  styleUrl: './cart-page.component.scss',
})
export class CartPageComponent implements OnInit {
  dataSvc = inject(DataService);
  dataStore = inject(StoreService);

  headerConfig = {
    REMOTE_URL: 'http://localhost:4202/remoteEntry.js',
    EXPOSED_MODULE: './Header',
    MODULE_NAME: 'HeaderComponent',
  };

  headerInputs = {};

  lineItems = signal<{
    quantity: number;
    total: number;
    id: string;
    name: string;
    sku: string;
    price: number;
    image: string;
    inventory: number;
  }[]>([]);

  total = computed(() => 
    this.lineItems().reduce((res, { total }) => res + total, 0)
  );

  skus = computed(() => 
    this.lineItems().map(({ sku }) => sku)
  );

  constructor() {
    // Make cart page reactive to cart changes
    effect(() => {
      const rawLineItems = this.dataStore.useLineItems()();
      console.log('Cart page effect triggered with items:', rawLineItems);
      this.lineItems.set(this.convertToLineItems(rawLineItems));
    });
  }

  ngOnInit(): void {
    // Ensure StoreService is initialized
    console.log('CartPageComponent initialized, current cart state:', this.dataStore.store());
    
    // Force an initial update in case we missed any events
    const currentItems = this.dataStore.useLineItems()();
    this.lineItems.set(this.convertToLineItems(currentItems));
  }

  onRemoveItem(sku: string) {
    window.dispatchEvent(
      new CustomEvent('remove-from-cart', {
        detail: { sku },
      })
    );
  }

  clearCart() {
    window.dispatchEvent(new CustomEvent('clear-cart'));
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
