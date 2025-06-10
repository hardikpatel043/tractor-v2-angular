import { Component, Input } from '@angular/core';
import { fmtprice, src, srcset } from "@tractor-store-angular/utils";

import { CommonModule } from '@angular/common';

interface Product {
  name: string;
  url: string;
  image: string;
  startPrice: number;
}
@Component({
  selector: 'explore-product',
  imports: [CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent {
  @Input() product: Product = {
    image: '',
    name: '',
    url: '',
    startPrice: 0,
  };
  src = src;
  srcset = srcset;
  fmtprice = fmtprice;
}
