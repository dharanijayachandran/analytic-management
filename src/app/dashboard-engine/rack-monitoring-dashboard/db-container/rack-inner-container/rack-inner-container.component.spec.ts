import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RackInnerContainerComponent } from './rack-inner-container.component';

describe('RackInnerContainerComponent', () => {
  let component: RackInnerContainerComponent;
  let fixture: ComponentFixture<RackInnerContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RackInnerContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RackInnerContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
