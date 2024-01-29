import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgeChartLinezoneComponent } from './nge-chart-linezone.component';

describe('NgeChartLinezoneComponent', () => {
  let component: NgeChartLinezoneComponent;
  let fixture: ComponentFixture<NgeChartLinezoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgeChartLinezoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgeChartLinezoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
