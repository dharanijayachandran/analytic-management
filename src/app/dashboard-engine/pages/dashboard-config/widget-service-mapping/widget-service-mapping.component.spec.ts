import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetServiceMappingComponent } from './widget-service-mapping.component';

describe('WidgetServiceMappingComponent', () => {
  let component: WidgetServiceMappingComponent;
  let fixture: ComponentFixture<WidgetServiceMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetServiceMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetServiceMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
