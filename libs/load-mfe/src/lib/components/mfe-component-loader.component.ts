import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { LoadRemoteComponentService } from '../services/load-remote-component.service';

@Component({
  selector: 'lib-mfe-loader',
  templateUrl: './mfe-component-loader.component.html',
  styleUrls: ['./mfe-component-loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
})
export class MfeComponentLoaderComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  isLoading = true;
  private destroy$ = new Subject<void>();
  @Input() config: any;
  @Input() inputs: any;
  @ViewChild('mfeSelector', { read: ViewContainerRef })
  viewContainer!: ViewContainerRef;

  constructor(
    private cdr: ChangeDetectorRef,
    private loadRemoteComponentService: LoadRemoteComponentService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    if (this.inputs) {
      this.loadRemoteMFEComponent(this.inputs);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['inputs'] &&
      changes['inputs'].currentValue &&
      !changes['inputs'].firstChange &&
      changes['inputs'].currentValue !== changes['inputs'].previousValue
    ) {
      this.loadRemoteMFEComponent(this.inputs);
    }
  }

  loadRemoteMFEComponent(data: any) {
    this.isLoading = true;
    if (this.viewContainer) {
      this.loadRemoteComponentService
        .loadAndCreateRemoteComponent(
          this.viewContainer,
          this.config.REMOTE_URL,
          this.config.EXPOSED_MODULE,
          this.config.MODULE_NAME
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .pipe(takeUntil(this.destroy$))
        .subscribe((compInstance: any) => {
          this.isLoading = false;
          Object.keys(data).forEach((key) => {
            compInstance[key] = data[key];
          });
          this.cdr.detectChanges();
        });
    }
  }
}
