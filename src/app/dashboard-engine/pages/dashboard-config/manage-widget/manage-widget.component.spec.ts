import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageWidgetComponent } from './manage-widget.component';

describe('ManageWidgetComponent', () => {
  let component: ManageWidgetComponent;
  let fixture: ComponentFixture<ManageWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
