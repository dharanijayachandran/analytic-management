import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatChartFormComponent } from './float-chart-form.component';

describe('FloatChartFormComponent', () => {
  let component: FloatChartFormComponent;
  let fixture: ComponentFixture<FloatChartFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FloatChartFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloatChartFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
