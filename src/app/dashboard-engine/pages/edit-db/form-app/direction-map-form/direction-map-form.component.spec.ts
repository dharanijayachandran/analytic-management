import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectionMapFormComponent } from './direction-map-form.component';

describe('DirectionMapFormComponent', () => {
  let component: DirectionMapFormComponent;
  let fixture: ComponentFixture<DirectionMapFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectionMapFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectionMapFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
