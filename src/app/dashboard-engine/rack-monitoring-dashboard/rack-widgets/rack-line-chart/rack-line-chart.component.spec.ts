import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RackLineChartComponent } from './rack-line-chart.component';

describe('RackLineChartComponent', () => {
  let component: RackLineChartComponent;
  let fixture: ComponentFixture<RackLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RackLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RackLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
