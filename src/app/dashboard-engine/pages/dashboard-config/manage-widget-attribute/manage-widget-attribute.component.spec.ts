import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageWidgetAttributeComponent } from './manage-widget-attribute.component';

describe('ManageWidgetAttributeComponent', () => {
  let component: ManageWidgetAttributeComponent;
  let fixture: ComponentFixture<ManageWidgetAttributeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageWidgetAttributeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageWidgetAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
