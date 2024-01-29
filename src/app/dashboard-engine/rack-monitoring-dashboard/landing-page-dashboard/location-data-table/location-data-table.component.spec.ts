import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationDataTableComponent } from './location-data-table.component';

describe('LocationDataTableComponent', () => {
  let component: LocationDataTableComponent;
  let fixture: ComponentFixture<LocationDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
