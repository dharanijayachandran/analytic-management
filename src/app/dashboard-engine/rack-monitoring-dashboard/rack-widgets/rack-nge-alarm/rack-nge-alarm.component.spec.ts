import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RackNgeAlarmComponent } from './rack-nge-alarm.component';

describe('RackNgeAlarmComponent', () => {
  let component: RackNgeAlarmComponent;
  let fixture: ComponentFixture<RackNgeAlarmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RackNgeAlarmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RackNgeAlarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
