import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgmEuMapComponent } from './agm-eu-map.component';

describe('AgmEuMapComponent', () => {
  let component: AgmEuMapComponent;
  let fixture: ComponentFixture<AgmEuMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgmEuMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgmEuMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
