import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RackNgeCardComponent } from './rack-nge-card.component';

describe('RackNgeCardComponent', () => {
  let component: RackNgeCardComponent;
  let fixture: ComponentFixture<RackNgeCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RackNgeCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RackNgeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
