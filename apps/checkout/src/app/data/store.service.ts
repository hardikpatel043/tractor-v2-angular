declare global {
  interface Window {
    cartStore: { sku: string; quantity: number }[];
  }
}

import { Injectable, effect, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StoreService {
  store = signal<{ sku: string; quantity: number }[]>(window.cartStore ?? []);

  private syncGlobalStore() {
    window.cartStore = this.store();
  }

  constructor() {
    window.addEventListener('add-to-cart', (ev: Event) => {
      const { sku } = (ev as any).detail;
      const prev = this.store();
      const idx = prev.findIndex((m) => m.sku === sku);
      let next;
      if (idx >= 0) {
        next = prev.map((m, i) =>
          i === idx ? { ...m, quantity: m.quantity + 1 } : m
        );
      } else {
        next = [...prev, { sku, quantity: 1 }];
      }
      this.store.set(next);
      this.syncGlobalStore();
      window.dispatchEvent(new CustomEvent('updated-cart'));
    });

    window.addEventListener('remove-from-cart', (ev) => {
      const { sku } = (ev as any).detail;
      const prev = this.store();
      const next = prev.filter((m) => m.sku !== sku);
      this.store.set(next);
      this.syncGlobalStore();
      window.dispatchEvent(new CustomEvent('updated-cart'));
    });

    window.addEventListener('clear-cart', () => {
      this.store.set([]);
      this.syncGlobalStore();
      window.dispatchEvent(new CustomEvent('updated-cart'));
    });

    effect(() => {
      const refresh = () => {
        // Sync from global store
        if (Array.isArray(window.cartStore)) {
          this.store.set([...window.cartStore]);
        }
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
}
