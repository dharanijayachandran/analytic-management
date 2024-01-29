import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableMatrixFormComponent } from './table-matrix-form.component';

describe('TableMatrixFormComponent', () => {
  let component: TableMatrixFormComponent;
  let fixture: ComponentFixture<TableMatrixFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableMatrixFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableMatrixFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
