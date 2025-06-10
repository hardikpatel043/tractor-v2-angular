import { Component, Input, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { DataService } from '../data/data.service';
import { RecommendationComponent } from '../components/recommendation/recommendation.component';

@Component({
  selector: 'explore-recommendations',
  imports: [CommonModule, RecommendationComponent],
  templateUrl: './recommendations.component.html',
  styleUrl: './recommendations.component.scss',
})
export class RecommendationsComponent implements OnInit {
  dataSvc = inject(DataService);
  r: { [key: string]: any } = JSON.parse(
    JSON.stringify(this.dataSvc.data.recommendations as any)
  );

  @Input() skus: string[] = [];
  recos = [];
  ngOnInit(): void {
    Object.keys(this.r).forEach((i) => {
      let url: string = this.r[i].url;
      console.log(url);
      url = url.replace('/product/', '');
      const sku = url.substring(url.indexOf('?sku=') + 5);
      url = url.substring(0, url.indexOf('?'));
      this.r[i].url = '/decide/product?product=' + url + '&sku=' + sku;
    });
    this.recos = this.recosForSkus(this.skus) as any;
  }
  averageColor(colors: Array<[number, number, number]>) {
    const total = colors.reduce(
      (acc, [r, g, b]) => [acc[0] + r, acc[1] + g, acc[2] + b],
      [0, 0, 0]
    );
    return total.map((c) => Math.round(c / colors.length)) as [
      number,
      number,
      number
    ];
  }

  skusToColors(skus: Array<string>) {
    return skus.filter((sku) => this.r[sku]).map((sku) => this.r[sku].rgb);
  }

  colorDistance(
    rgb1: [number, number, number],
    rgb2: [number, number, number]
  ) {
    const [r1, g1, b1] = rgb1;
    const [r2, g2, b2] = rgb2;
    return Math.sqrt(
      Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2)
    );
  }

  recosForSkus(skus: Array<string>, length = 4) {
    const targetRgb = this.averageColor(this.skusToColors(skus));
    const distances = [];

    for (const sku in this.r) {
      if (!skus.includes(sku)) {
        const distance = this.colorDistance(targetRgb, this.r[sku].rgb);
        distances.push({ sku, distance });
      }
    }

    distances.sort((a, b) => a.distance - b.distance);
    return distances.slice(0, length).map((d) => this.r[d.sku]);
  }
}
