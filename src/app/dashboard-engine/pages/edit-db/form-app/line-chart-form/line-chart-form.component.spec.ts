import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineChartFormComponent } from './line-chart-form.component';

describe('LineChartFormComponent', () => {
  let component: LineChartFormComponent;
  let fixture: ComponentFixture<LineChartFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineChartFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineChartFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
