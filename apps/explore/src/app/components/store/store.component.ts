import { Component, Input } from '@angular/core';
import { src, srcset } from "@tractor-store-angular/utils";

import { CommonModule } from '@angular/common';

interface Store {
  image: string;
  street: string;
  name: string;
  city: string;
}

@Component({
  selector: 'explore-store',
  imports: [CommonModule],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss',
})
export class StoreComponent {
  src = src;
  srcset = srcset;
  @Input() store: Store = { image: '', city: '', name: '', street: '' };
}
