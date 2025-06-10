import { Component, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { DataService } from '../data/data.service';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { StoreComponent } from '../components/store/store.component';

@Component({
  selector: 'explore-store-page',
  imports: [CommonModule, HeaderComponent, FooterComponent, StoreComponent],
  templateUrl: './store-page.component.html',
  styleUrl: './store-page.component.scss',
})
export class StorePageComponent {
  dataSvc = inject(DataService);

  stores = this.dataSvc.data.stores;
  
}
