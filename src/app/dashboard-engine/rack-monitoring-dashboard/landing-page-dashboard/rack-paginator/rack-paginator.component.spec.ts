import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RackPaginatorComponent } from './rack-paginator.component';

describe('RackPaginatorComponent', () => {
  let component: RackPaginatorComponent;
  let fixture: ComponentFixture<RackPaginatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RackPaginatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RackPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
