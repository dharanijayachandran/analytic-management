import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RackLandingCardComponent } from './rack-landing-card.component';

describe('RackLandingCardComponent', () => {
  let component: RackLandingCardComponent;
  let fixture: ComponentFixture<RackLandingCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RackLandingCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RackLandingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
