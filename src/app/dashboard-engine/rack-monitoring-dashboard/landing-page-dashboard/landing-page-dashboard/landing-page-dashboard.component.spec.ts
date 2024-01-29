import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageDashboardComponent } from './landing-page-dashboard.component';

describe('LandingPageDashboardComponent', () => {
  let component: LandingPageDashboardComponent;
  let fixture: ComponentFixture<LandingPageDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingPageDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
