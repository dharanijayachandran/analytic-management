import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgeGaugeComponent } from './nge-gauge.component';

describe('NgeGaugeComponent', () => {
  let component: NgeGaugeComponent;
  let fixture: ComponentFixture<NgeGaugeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgeGaugeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgeGaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
