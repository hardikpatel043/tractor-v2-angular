import { CommonModule } from '@angular/common';
import { LoadRemoteComponentService } from './services/load-remote-component.service';
import { MfeComponentLoaderComponent } from './components/mfe-component-loader.component';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [CommonModule],
  declarations: [MfeComponentLoaderComponent],
  exports: [MfeComponentLoaderComponent],
  providers: [LoadRemoteComponentService],
})
export class MfeLoaderModule {}
