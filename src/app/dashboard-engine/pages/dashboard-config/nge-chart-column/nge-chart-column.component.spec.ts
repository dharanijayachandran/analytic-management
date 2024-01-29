import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgeChartColumnComponent } from './nge-chart-column.component';

describe('NgeChartColumnComponent', () => {
  let component: NgeChartColumnComponent;
  let fixture: ComponentFixture<NgeChartColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgeChartColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgeChartColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
