import { Component, Inject, Input, OnInit, inject } from '@angular/core';

import { ButtonComponent } from '../components/Button/Button.component';
import { CommonModule } from '@angular/common';
import { DataService } from '../data/data.service';
import { Router } from '@angular/router';
import { StoreService } from '../data/store.service';

@Component({
  selector: 'checkout-add-to-cart',
  imports: [CommonModule, ButtonComponent],
  providers: [{ provide: 'token', useClass: StoreService }],
  templateUrl: './add-to-cart.component.html',
  styleUrl: './add-to-cart.component.scss',
})
export class AddToCartComponent implements OnInit {
  @Input() sku = '';

  route = inject(Router);
  dataSvc = inject(DataService);

  variant = {
    id: '',
    name: '',
    sku: '',
    price: 0,
    image: '',
    inventory: 0,
  };
  outOfStock = true;
  isClicked = false;

  constructor(@Inject('token') private storeService: StoreService) {}

  ngOnInit(): void {
    this.variant = this.dataSvc.data.variants.find(
      (p) => p.sku === this.sku
    ) as any;

    this.outOfStock = this.variant.inventory === 0;
  }

  submit(ev: any) {
    window.dispatchEvent(
      new CustomEvent('add-to-cart', {
        detail: { sku: this.sku },
      })
    );
    this.isClicked = true;
    // this.route.navigate(['/checkout/cart']);
    ev.preventDefault();
  }
}
