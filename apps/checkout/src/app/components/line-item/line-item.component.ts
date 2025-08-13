import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../Button/Button.component';

@Component({
  selector: 'checkout-line-item',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './line-item.component.html',
  styleUrl: './line-item.component.scss',
})
export class LineItemComponent {
  @Input() item!: {
    quantity: number;
    total: number;
    id: string;
    name: string;
    sku: string;
    price: number;
    image: string;
    inventory: number;
  };

  @Output() removeItem = new EventEmitter<string>();

  onRemove() {
    this.removeItem.emit(this.item.sku);
  }

  updateQuantity(delta: number) {
    const newQuantity = this.item.quantity + delta;
    if (newQuantity > 0 && newQuantity <= this.item.inventory) {
      // Dispatch event for quantity update
      window.dispatchEvent(
        new CustomEvent('update-cart-quantity', {
          detail: { sku: this.item.sku, quantity: newQuantity },
        })
      );
    }
  }
}
