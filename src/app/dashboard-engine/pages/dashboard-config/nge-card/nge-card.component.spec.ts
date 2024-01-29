import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgeCardComponent } from './nge-card.component';

describe('NgeCardComponent', () => {
  let component: NgeCardComponent;
  let fixture: ComponentFixture<NgeCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgeCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
