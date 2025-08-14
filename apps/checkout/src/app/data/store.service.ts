import { Injectable, effect, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StoreService {
  store = signal<{ sku: string; quantity: number }[]>([]);
  private readonly CART_STORAGE_KEY = 'tractor-cart-items';

  constructor() {
    console.log('🔧 StoreService constructor called - Instance created!', new Date().toISOString());
    
    // Initialize from localStorage to support Module Federation
    this.loadFromStorage();
    console.log('🔧 Current store state after loading from storage:', this.store());
    console.trace('StoreService instantiation stack trace');
    window.addEventListener('add-to-cart', (ev: Event) => {
      const { sku } = (ev as any).detail;
      console.log('Adding to cart:', sku);

      this.store.update((prev) => {
        const existingItemIndex = prev.findIndex((m) => m.sku === sku);
        
        let newState;
        if (existingItemIndex >= 0) {
          // Create new array with updated quantity
          newState = prev.map((item, index) => 
            index === existingItemIndex 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          // Add new item
          newState = [...prev, { sku, quantity: 1 }];
        }
        
        // Save to localStorage for Module Federation compatibility
        this.saveToStorage(newState);
        return newState;
      });

      console.log('Cart after add:', this.store());
      window.dispatchEvent(new CustomEvent('updated-cart'));
    });

    window.addEventListener('remove-from-cart', (ev) => {
      const { sku } = (ev as any).detail;
      console.log('Removing from cart:', sku);

      this.store.update((prev) => {
        const newState = prev.filter((item) => item.sku !== sku);
        this.saveToStorage(newState);
        return newState;
      });

      console.log('Cart after remove:', this.store());
      window.dispatchEvent(new CustomEvent('updated-cart'));
    });

    window.addEventListener('clear-cart', () => {
      console.log('Clearing cart');
      const newState: { sku: string; quantity: number }[] = [];
      this.store.set(newState);
      this.saveToStorage(newState);
      console.log('Cart after clear:', this.store());
      window.dispatchEvent(new CustomEvent('updated-cart'));
    });

    // Listen for storage changes from other Module Federation contexts
    window.addEventListener('storage', (ev) => {
      if (ev.key === this.CART_STORAGE_KEY) {
        this.loadFromStorage();
        window.dispatchEvent(new CustomEvent('updated-cart'));
      }
    });
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.CART_STORAGE_KEY);
      if (stored) {
        const cartItems = JSON.parse(stored);
        this.store.set(cartItems);
        console.log('📦 Loaded cart from localStorage:', cartItems);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }

  private saveToStorage(cartItems: { sku: string; quantity: number }[]): void {
    try {
      localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(cartItems));
      console.log('💾 Saved cart to localStorage:', cartItems);
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }

  useLineItems() {
    return this.store;
  }
}
