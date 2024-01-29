import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RackNgeEventComponent } from './rack-nge-event.component';

describe('RackNgeEventComponent', () => {
  let component: RackNgeEventComponent;
  let fixture: ComponentFixture<RackNgeEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RackNgeEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RackNgeEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
