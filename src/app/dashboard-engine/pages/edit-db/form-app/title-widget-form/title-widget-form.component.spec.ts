import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleWidgetFormComponent } from './title-widget-form.component';

describe('TitleWidgetFormComponent', () => {
  let component: TitleWidgetFormComponent;
  let fixture: ComponentFixture<TitleWidgetFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitleWidgetFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleWidgetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
