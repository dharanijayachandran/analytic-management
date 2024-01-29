import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgeChartAreaComponent } from './nge-chart-area.component';

describe('NgeChartAreaComponent', () => {
  let component: NgeChartAreaComponent;
  let fixture: ComponentFixture<NgeChartAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgeChartAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgeChartAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
