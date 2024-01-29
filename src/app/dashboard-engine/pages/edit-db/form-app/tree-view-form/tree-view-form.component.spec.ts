import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeViewFormComponent } from './tree-view-form.component';

describe('TreeViewFormComponent', () => {
  let component: TreeViewFormComponent;
  let fixture: ComponentFixture<TreeViewFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeViewFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeViewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
