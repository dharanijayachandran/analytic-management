import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GaugeMeterFormComponent } from './gauge-meter-form.component';

describe('GaugeMeterFormComponent', () => {
  let component: GaugeMeterFormComponent;
  let fixture: ComponentFixture<GaugeMeterFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GaugeMeterFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GaugeMeterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
