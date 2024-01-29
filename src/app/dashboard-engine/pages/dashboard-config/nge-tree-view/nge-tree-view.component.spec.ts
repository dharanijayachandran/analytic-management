import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgeTreeViewComponent } from './nge-tree-view.component';

describe('NgeTreeViewComponent', () => {
  let component: NgeTreeViewComponent;
  let fixture: ComponentFixture<NgeTreeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgeTreeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgeTreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
