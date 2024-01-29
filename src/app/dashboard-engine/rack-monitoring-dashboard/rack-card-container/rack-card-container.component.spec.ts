import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RackCardContainerComponent } from './rack-card-container.component';

describe('RackCardContainerComponent', () => {
  let component: RackCardContainerComponent;
  let fixture: ComponentFixture<RackCardContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RackCardContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RackCardContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
