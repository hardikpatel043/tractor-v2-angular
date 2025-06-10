import { Component, input } from '@angular/core';

import { CommonModule } from '@angular/common';

interface Filter {
  active?: boolean;
  name: string;
  url: string;
}

@Component({
  selector: 'explore-filter',
  imports: [CommonModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
})
export class FilterComponent {
  filters = input<Filter[]>();
}
