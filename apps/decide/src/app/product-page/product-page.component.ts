import {
  Component,
  ComponentRef,
  CreateSignalOptions,
  Signal,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Observable, concat, map, of } from 'rxjs';
import { ToSignalOptions, toSignal } from '@angular/core/rxjs-interop';
import { src, srcset } from '@tractor-store-angular/utils';

import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../data/data.service';
import { MfeLoaderModule } from '@tractor-store-angular/load-mfe';
import { VariantOptionComponent } from '../components/variant-option/variant-option.component';

@Component({
  selector: 'decide-product-page',
  imports: [CommonModule, VariantOptionComponent, MfeLoaderModule],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss',
})
export class ProductPageComponent {
  activatedRoute = inject(ActivatedRoute);
  dataSvc = inject(DataService);
  src = src;
  srcset = srcset;

  product: Signal<string> = toSignal(
    this.activatedRoute.queryParams.pipe(
      map((params) => {
        return params['product'];
      })
    )
  );

  sku = toSignal(
    this.activatedRoute.queryParams.pipe(
      map((params) => {
        return params['sku'];
      })
    )
  );

  productObj = computed(
    () =>
      this.dataSvc.data.products.find((p) => p.id == this.product()) || {
        name: '',
        id: '',
        category: '',
        highlights: [],
        variants: [],
      }
  );

  variant = computed(
    () =>
      this.productObj().variants.find((v) => v.sku === this.sku()) ||
      this.productObj().variants[0]
  );

  variants = computed(() =>
    this.productObj().variants.map((v) => {
      return { ...v, selected: this.variant().sku === v.sku };
    })
  );

  name = computed(() => this.productObj().name);
  highlights = computed(() => this.productObj().highlights || []);
  ref!: ComponentRef<any>;

  addToCartConfig = {
    REMOTE_URL: 'http://localhost:4201/remoteEntry.js',
    EXPOSED_MODULE: './addToCart',
    MODULE_NAME: 'AddToCartComponent',
  };

  addToCartInputs = {};

  headerConfig = {
    REMOTE_URL: 'http://localhost:4202/remoteEntry.js',
    EXPOSED_MODULE: './Header',
    MODULE_NAME: 'HeaderComponent',
  };

  headerInputs = {};

  footerConfig = {
    REMOTE_URL: 'http://localhost:4202/remoteEntry.js',
    EXPOSED_MODULE: './Footer',
    MODULE_NAME: 'FooterComponent',
  };

  footerInputs = {};

  recommendationConfig = {
    REMOTE_URL: 'http://localhost:4202/remoteEntry.js',
    EXPOSED_MODULE: './Recommendations',
    MODULE_NAME: 'RecommendationsComponent',
  };

  recommendationInputs = {};

  constructor() {
    effect(() => {
      this.recommendationInputs = {
        skus: [this.variant().sku],
      };

      this.addToCartInputs = {
        sku: this.variant().sku,
      };
    });
  }
}

export function toWritableSignal<T>(
  source: Observable<T>,
  { initialValue, equal, ...options }: ToWritableSignalOptions<T>
) {
  const writableSignal = signal(initialValue as any, { equal });

  const readonlySignal = toSignal<T>(concat(of(initialValue as any), source), {
    ...options,
    requireSync: true,
  });

  effect(
    () => {
      writableSignal.set(readonlySignal());
    },
    { allowSignalWrites: true }
  );

  return writableSignal;
}

export type ToWritableSignalOptions<T> = Omit<
  RequireKeys<ToSignalOptions<T>, 'initialValue'> &
    Pick<CreateSignalOptions<T>, 'equal'>,
  'requireSync'
>;

type RequireKeys<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>;
