import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerContainerFormComponent } from './inner-container-form.component';

describe('InnerContainerFormComponent', () => {
  let component: InnerContainerFormComponent;
  let fixture: ComponentFixture<InnerContainerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InnerContainerFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InnerContainerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
