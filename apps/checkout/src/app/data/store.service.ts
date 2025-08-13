import { Injectable, effect, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private readonly STORAGE_KEY = 'tractor-cart-items';
  store = signal<{ sku: string; quantity: number }[]>(this.loadFromStorage());

  constructor() {
    console.log('StoreService constructor called - initial cart:', this.store());
    
    // Save to localStorage whenever cart changes
    effect(() => {
      this.saveToStorage(this.store());
    });
    
    window.addEventListener('add-to-cart', (ev: Event) => {
      const { sku } = (ev as any).detail;
      console.log('add-to-cart event received for sku:', sku);

      const currentStore = this.store();
      const item = currentStore.find((m) => m.sku === sku);

      if (item) {
        // Update existing item
        this.store.update((prev) => 
          prev.map(cartItem => 
            cartItem.sku === sku 
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          )
        );
      } else {
        // Add new item
        this.store.update((prev) => [...prev, { sku, quantity: 1 }]);
      }

      console.log('Cart updated to:', this.store());
      window.dispatchEvent(new CustomEvent('updated-cart'));
    });

    window.addEventListener('remove-from-cart', (ev) => {
      const { sku } = (ev as any).detail;

      const index = this.store().findIndex((m) => m.sku === sku);

      if (index >= 0) {
        this.store.update((prev) => prev.filter((item) => item.sku !== sku));
        window.dispatchEvent(new CustomEvent('updated-cart'));
      }
    });

    window.addEventListener('update-cart-quantity', (ev) => {
      const { sku, quantity } = (ev as any).detail;

      this.store.update((prev) =>
        prev.map((item) =>
          item.sku === sku ? { ...item, quantity } : item
        )
      );
      window.dispatchEvent(new CustomEvent('updated-cart'));
    });

    window.addEventListener('clear-cart', () => {
      this.store.set([]);
      window.dispatchEvent(new CustomEvent('updated-cart'));
    });

    effect(() => {
      const refresh = () => {
        this.store.set([...this.store()]);
      };

      window.addEventListener('updated-cart', refresh);
      return () => {
        window.removeEventListener('updated-cart', refresh);
      };
    });
  }

  useLineItems() {
    return this.store;
  }

  private loadFromStorage(): { sku: string; quantity: number }[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const result = stored ? JSON.parse(stored) : [];
      console.log('Loaded cart from storage:', result);
      return result;
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      return [];
    }
  }

  private saveToStorage(items: { sku: string; quantity: number }[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
      console.log('Saved cart to storage:', items);
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }
}
