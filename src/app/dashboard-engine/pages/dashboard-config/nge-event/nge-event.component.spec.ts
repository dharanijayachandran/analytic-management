import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgeEventComponent } from './nge-event.component';

describe('NgeEventComponent', () => {
  let component: NgeEventComponent;
  let fixture: ComponentFixture<NgeEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgeEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgeEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
