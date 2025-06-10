import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';

interface VariantOption {
  sku: string;
  name: string;
  selected?: boolean;
  color: string;
}

@Component({
  selector: 'decide-variant-option',
  imports: [CommonModule],
  templateUrl: './variant-option.component.html',
  styleUrl: './variant-option.component.scss',
})
export class VariantOptionComponent implements OnInit {
  @Input() variantOption: VariantOption = {
    color: '',
    name: '',
    sku: '',
  };
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  location = inject(Location);

  ngOnInit(): void {
    this.setStyle('--variant-color', this.variantOption.color);
  }

  setStyle(s: string, v: string) {
    document.documentElement.style.setProperty(s, v);
  }

  navigate() {
    this.router.navigate(['/decide/product'], {
      queryParams: {
        ...this.activatedRoute.snapshot.queryParams,
        ...{ sku: this.variantOption.sku },
      },
    });
  }
}
