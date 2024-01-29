import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgmDirectionMapComponent } from './agm-direction-map.component';

describe('AgmDirectionMapComponent', () => {
  let component: AgmDirectionMapComponent;
  let fixture: ComponentFixture<AgmDirectionMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgmDirectionMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgmDirectionMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
