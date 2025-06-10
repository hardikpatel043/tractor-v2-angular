import { Component, Signal, computed, inject } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../data/data.service';
import { FilterComponent } from '../components/filter/filter.component';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { ProductComponent } from '../components/product/product.component';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'explore-categorypage',
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    FilterComponent,
    ProductComponent,
  ],
  templateUrl: './categorypage.component.html',
  styleUrl: './categorypage.component.scss',
})
export class CategoryPageComponent {
  activatedRoute = inject(ActivatedRoute);
  dataSvc = inject(DataService);
  category: Signal<string> = toSignal(
    this.activatedRoute.queryParams.pipe(
      map((params) => {
        return params['category'];
      })
    )
  );

  cat = computed(() =>
    this.dataSvc.data.categories.find((c) => c.key === this.category())
  );

  title = computed(() => {
    if (this.cat()) {
      return this.cat()?.name;
    }
    return 'All Machines';
  });

  products = computed(() => {
    const p = this.cat()
      ? this.cat()?.products
      : this.dataSvc.data.categories.flatMap((c) => c.products);

    p?.map((a) => {
      const name = a.url.replace('/product/', '');
      a.url = '/decide/product?product=' + name;
    });

    return p?.sort((a, b) => b.startPrice - a.startPrice);
  });

  filters = computed(() => [
    { url: '/explore/products', name: 'All', active: !this.cat() },
    ...this.dataSvc.data.categories.map((c) => ({
      url: `/explore/products?category=${c.key}`,
      name: c.name,
      active: c.key === this.category(),
    })),
  ]);
}
