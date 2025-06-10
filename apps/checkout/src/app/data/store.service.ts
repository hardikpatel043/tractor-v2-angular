import { Injectable, effect, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StoreService {
  store = signal<{ sku: string; quantity: number }[]>([]);

  constructor() {
    window.addEventListener('add-to-cart', (ev: Event) => {
      const { sku } = (ev as any).detail;

      const item = this.store().find((m) => m.sku === sku);

      if (item) {
        item.quantity++;
      } else {
        this.store.update((prev) => [...prev, { sku, quantity: 1 }]);
      }

      window.dispatchEvent(new CustomEvent('updated-cart'));
    });

    window.addEventListener('remove-from-cart', (ev) => {
      const { sku } = (ev as any).detail;

      const index = this.store().findIndex((m) => m.sku === sku);

      if (index >= 0) {
        this.store().splice(index, 1);
        window.dispatchEvent(new CustomEvent('updated-cart'));
      }
    });

    window.addEventListener('clear-cart', () => {
      this.store().splice(0, this.store.length);
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
}
