import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartFormComponent } from './pie-chart-form.component';

describe('PieChartFormComponent', () => {
  let component: PieChartFormComponent;
  let fixture: ComponentFixture<PieChartFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PieChartFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieChartFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
