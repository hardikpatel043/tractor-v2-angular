import { Component, inject } from '@angular/core';
import { src, srcset } from '@tractor-store-angular/utils';

import { CommonModule } from '@angular/common';
import { DataService } from '../data/data.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { RecommendationsComponent } from '../recommendations/recommendations.component';

@Component({
  selector: 'explore-homepage',
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    RecommendationsComponent,
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent {
  dataSvc = inject(DataService);

  data = this.dataSvc.data;
  src = src;
  srcset = srcset;
  skus = ['CL-01-GY', 'AU-07-MT'];
}
