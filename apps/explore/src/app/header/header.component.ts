import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MfeLoaderModule } from '@tractor-store-angular/load-mfe';
import { NavigationComponent } from '../components/navigation/navigation.component';

@Component({
  selector: 'explore-header',
  imports: [CommonModule, NavigationComponent, MfeLoaderModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  config = {
    REMOTE_URL: 'http://localhost:4201/remoteEntry.js',
    EXPOSED_MODULE: './miniCart',
    MODULE_NAME: 'MiniCartComponent',
  };
}
