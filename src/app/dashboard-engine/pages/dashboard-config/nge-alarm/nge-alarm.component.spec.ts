import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgeAlarmComponent } from './nge-alarm.component';

describe('NgeAlarmComponent', () => {
  let component: NgeAlarmComponent;
  let fixture: ComponentFixture<NgeAlarmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgeAlarmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgeAlarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
