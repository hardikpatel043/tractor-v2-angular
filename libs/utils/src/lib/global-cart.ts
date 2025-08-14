// Global cart store that works across module federation boundaries
export interface CartItem {
  sku: string;
  quantity: number;
}

export interface GlobalCartStore {
  items: CartItem[];
  listeners: Set<() => void>;
  addItem: (sku: string) => void;
  removeItem: (sku: string) => void;
  clearCart: () => void;
  getItems: () => CartItem[];
  subscribe: (callback: () => void) => () => void;
  notifyListeners: () => void;
}

declare global {
  interface Window {
    __GLOBAL_CART_STORE__: GlobalCartStore;
  }
}

// Initialize global cart store if it doesn't exist
export function initializeGlobalCart(): GlobalCartStore {
  if (typeof window === 'undefined') {
    throw new Error('Global cart can only be initialized in browser environment');
  }

  if (!window.__GLOBAL_CART_STORE__) {
    console.log('Initializing global cart store');
    
    window.__GLOBAL_CART_STORE__ = {
      items: [],
      listeners: new Set(),
      
      addItem(sku: string) {
        console.log('Global cart: Adding item', sku);
        const existingItemIndex = this.items.findIndex(item => item.sku === sku);
        
        if (existingItemIndex >= 0) {
          this.items[existingItemIndex].quantity++;
        } else {
          this.items.push({ sku, quantity: 1 });
        }
        
        console.log('Global cart updated:', this.items);
        this.notifyListeners();
      },
      
      removeItem(sku: string) {
        console.log('Global cart: Removing item', sku);
        this.items = this.items.filter(item => item.sku !== sku);
        console.log('Global cart updated:', this.items);
        this.notifyListeners();
      },
      
      clearCart() {
        console.log('Global cart: Clearing cart');
        this.items = [];
        console.log('Global cart cleared');
        this.notifyListeners();
      },
      
      getItems() {
        return [...this.items]; // Return a copy
      },
      
      subscribe(callback: () => void) {
        this.listeners.add(callback);
        return () => {
          this.listeners.delete(callback);
        };
      },
      
      notifyListeners() {
        this.listeners.forEach(callback => callback());
        // Also dispatch the legacy event for backward compatibility
        window.dispatchEvent(new CustomEvent('updated-cart'));
      }
    };
  }

  return window.__GLOBAL_CART_STORE__;
}

// Get the global cart store (initialize if needed)
export function getGlobalCart(): GlobalCartStore {
  return initializeGlobalCart();
}

// Utility functions for cart operations
export function addToCart(sku: string): void {
  getGlobalCart().addItem(sku);
}

export function removeFromCart(sku: string): void {
  getGlobalCart().removeItem(sku);
}

export function clearCart(): void {
  getGlobalCart().clearCart();
}

export function getCartItems(): CartItem[] {
  return getGlobalCart().getItems();
}

export function subscribeToCart(callback: () => void): () => void {
  return getGlobalCart().subscribe(callback);
}

export function getCartItemCount(): number {
  return getGlobalCart().getItems().reduce((total, item) => total + item.quantity, 0);
}
