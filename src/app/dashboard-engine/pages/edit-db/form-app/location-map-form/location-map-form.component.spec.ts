import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationMapFormComponent } from './location-map-form.component';

describe('LocationMapFormComponent', () => {
  let component: LocationMapFormComponent;
  let fixture: ComponentFixture<LocationMapFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationMapFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationMapFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
