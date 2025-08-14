import { CartItem, getGlobalCart } from '@tractor-store-angular/utils';
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private globalStore = getGlobalCart();
  store = signal<CartItem[]>(this.globalStore.getItems());

  constructor() {
    console.log('StoreService initialized with global cart');
    
    // Subscribe to global store changes
    this.globalStore.subscribe(() => {
      console.log('StoreService: Global store changed, updating local signal');
      this.store.set(this.globalStore.getItems());
    });

    // Listen for legacy events and forward to global store
    window.addEventListener('add-to-cart', (ev: Event) => {
      const { sku } = (ev as any).detail;
      this.globalStore.addItem(sku);
    });

    window.addEventListener('remove-from-cart', (ev) => {
      const { sku } = (ev as any).detail;
      this.globalStore.removeItem(sku);
    });

    window.addEventListener('clear-cart', () => {
      this.globalStore.clearCart();
    });
  }

  useLineItems() {
    return this.store;
  }
  
  // Direct methods for programmatic access
  addItem(sku: string) {
    this.globalStore.addItem(sku);
  }
  
  removeItem(sku: string) {
    this.globalStore.removeItem(sku);
  }
  
  clearCart() {
    this.globalStore.clearCart();
  }
}
