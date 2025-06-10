import { Component, computed, input, output } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'checkout-button',
  imports: [CommonModule],
  templateUrl: './Button.component.html',
  styleUrl: './Button.component.scss',
})
export class ButtonComponent {
  href = input('');
  type = input('button');
  value = input('');
  disabled = input(false);
  rounded = input(false);
  className = input('');
  dataId = input('');
  size = input('normal');
  variant = input('secondary');
  title = input('');
  classinternal = computed(
    () =>
      `c_Button c_Button--${this.variant()} ${this.className()} ${
        this.rounded() ? 'c_Button--rounded' : ''
      } c_Button--size-${this.size()}`
  );

  clicked = output<any>();
}
