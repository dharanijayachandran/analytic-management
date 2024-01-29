import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgeChartComponent } from './nge-chart.component';

describe('NgeChartComponent', () => {
  let component: NgeChartComponent;
  let fixture: ComponentFixture<NgeChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgeChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
