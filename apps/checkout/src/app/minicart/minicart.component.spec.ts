import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniCartComponent } from './minicart.component';

describe('MiniCartComponent', () => {
  let component: MiniCartComponent;
  let fixture: ComponentFixture<MiniCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniCartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MiniCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
