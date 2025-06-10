import { Component, Input, input } from '@angular/core';
import { src, srcset } from "@tractor-store-angular/utils";

import { CommonModule } from '@angular/common';

interface RecommendationProps {
  image: string;
  url: string;
  name: string;
}

@Component({
  selector: 'explore-recommendation',
  imports: [CommonModule],
  templateUrl: './recommendation.component.html',
  styleUrl: './recommendation.component.scss',
})
export class RecommendationComponent {
  src = src;
  srcset = srcset;

  @Input() props: RecommendationProps = { image: '', url: '', name: '' };
}
