import { Component, computed } from '@angular/core';

import { ButtonComponent } from '../components/Button/Button.component';
import { CommonModule } from '@angular/common';
import { StoreService } from '../data/store.service';

@Component({
  selector: 'checkout-mini-cart',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './minicart.component.html',
  styleUrl: './minicart.component.scss',
})
export class MiniCartComponent {
  constructor(private storeService: StoreService) {}

  quantity = computed(() =>
    this.storeService.store().reduce((t, { quantity }) => t + quantity, 0)
  );
}
