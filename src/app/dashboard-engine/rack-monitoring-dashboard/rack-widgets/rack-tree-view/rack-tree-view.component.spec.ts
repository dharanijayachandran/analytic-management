import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RackTreeViewComponent } from './rack-tree-view.component';

describe('RackTreeViewComponent', () => {
  let component: RackTreeViewComponent;
  let fixture: ComponentFixture<RackTreeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RackTreeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RackTreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
