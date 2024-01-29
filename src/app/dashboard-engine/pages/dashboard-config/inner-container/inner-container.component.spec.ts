import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerContainerComponent } from './inner-container.component';

describe('InnerContainerComponent', () => {
  let component: InnerContainerComponent;
  let fixture: ComponentFixture<InnerContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InnerContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InnerContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
