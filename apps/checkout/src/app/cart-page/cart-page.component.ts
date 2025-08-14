/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  OnInit,
  OnDestroy,
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
  styleUrl: './cart-page.component.scss',
})
export class CartPageComponent implements OnInit, OnDestroy {
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

  private cartUpdateListener: (event: Event) => void;

  constructor(private dataStore: StoreService) {
    // Create bound listener function for proper cleanup
    this.cartUpdateListener = this.onCartUpdate.bind(this);
  }

  ngOnInit(): void {
    this.loadCartItems();
    // Listen for cart updates
    window.addEventListener('updated-cart', this.cartUpdateListener);
  }

  ngOnDestroy(): void {
    // Clean up event listener
    window.removeEventListener('updated-cart', this.cartUpdateListener);
  }

  private onCartUpdate(): void {
    this.loadCartItems();
  }

  private loadCartItems(): void {
    const rawLineItems = this.dataStore.useLineItems();
    console.log('Raw line items signal:', rawLineItems);
    console.log('Raw line items value:', rawLineItems());
    this.lineItems = this.convertToLineItems(rawLineItems());
    this.total = this.lineItems.reduce((res, { total }) => res + total, 0);
    this.skus = this.lineItems.map(({ sku }) => sku);
    console.log('Converted line items:', this.lineItems);
    console.log('Total:', this.total);
  }

  clearCart(): void {
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
