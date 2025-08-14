/* eslint-disable @nx/enforce-module-boundaries */

import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  computed,
  effect,
  inject,
} from '@angular/core';

import { ButtonComponent } from '../components/Button/Button.component';
import { CartItem } from '@tractor-store-angular/utils';
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
export class CartPageComponent implements OnInit, OnDestroy {
  dataSvc = inject(DataService);
  dataStore = inject(StoreService);

  headerConfig = {
    REMOTE_URL: 'http://localhost:4202/remoteEntry.js',
    EXPOSED_MODULE: './Header',
    MODULE_NAME: 'HeaderComponent',
  };

  headerInputs = {};

  // Use computed signals for reactive data
  lineItems = computed(() => {
    const rawItems = this.dataStore.useLineItems()();
    console.log('Computing line items from raw data:', rawItems);
    return this.convertToLineItems(rawItems);
  });

  total = computed(() => {
    const items = this.lineItems();
    const totalAmount = items.reduce((res, { total }) => res + total, 0);
    console.log('Computing total:', totalAmount);
    return totalAmount;
  });

  skus = computed(() => {
    return this.lineItems().map(({ sku }) => sku);
  });

  private updateCartHandler = () => {
    console.log('Cart update event received');
    // No need to manually update since we're using computed signals
  };

  ngOnInit(): void {
    console.log('Cart page initialized');
    // Listen for cart updates (though computed signals should handle reactivity)
    window.addEventListener('updated-cart', this.updateCartHandler);
    
    // Create an effect to log changes
    effect(() => {
      console.log('Cart effect triggered, current items:', this.lineItems());
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('updated-cart', this.updateCartHandler);
  }

  convertToLineItems(items: CartItem[]) {
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
