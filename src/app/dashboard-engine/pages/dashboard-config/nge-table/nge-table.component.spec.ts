import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgeTableComponent } from './nge-table.component';

describe('NgeTableComponent', () => {
  let component: NgeTableComponent;
  let fixture: ComponentFixture<NgeTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgeTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
