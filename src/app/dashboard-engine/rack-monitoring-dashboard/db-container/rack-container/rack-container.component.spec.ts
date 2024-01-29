import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RackContainerComponent } from './rack-container.component';

describe('RackContainerComponent', () => {
  let component: RackContainerComponent;
  let fixture: ComponentFixture<RackContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RackContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RackContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
