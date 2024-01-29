import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartFormComponent } from './bar-chart-form.component';

describe('BarChartFormComponent', () => {
  let component: BarChartFormComponent;
  let fixture: ComponentFixture<BarChartFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarChartFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
