import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'checkout-line-item',
  imports: [CommonModule],
  templateUrl: './line-item.component.html',
  styleUrl: './line-item.component.scss',
})
export class LineItemComponent {
  @Input() item: {
    quantity: number;
    total: number;
    id: string;
    name: string;
    sku: string;
    price: number;
    image: string;
    inventory: number;
  } | null = null;
}
