import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
//import pageSettings from ''
import { FormGroup, FormBuilder } from '@angular/forms';

import { Widget } from '../../../model/widget';
import pageSettings from 'src/app/shared/config/page-settings';
@Component({
  selector: 'app-manage-widget',
  templateUrl: './manage-widget.component.html',
  styleUrls: ['./manage-widget.component.css']
})
export class ManageWidgetComponent implements OnInit {

  widgetListView = true;
  widgetFormView = true;

  dataSource: any;
  displayedColumns: string[] = ['id', 'name', 'title', 'status', 'edit'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  pageSettings = pageSettings;
  //@ViewChild('accountListHeader') accountListHeader: ElementRef;
  widgetForm: FormGroup;

  private widget: Widget = new Widget();
  href: any;
  addWidgetButton: boolean;
  widgetListHeader: string;
  constructor( private formBuilder: FormBuilder) {
    this.widgetForm = this.formBuilder.group({
    id: [null],
    widgetName:[''],
    widgetStatus:true,
    minWidgetWidth:1,
    maxWidgetWidth:1,
    isPanelReq:true,
    widgetDataType:['']
    });

  }

  ngOnInit() {
    this.widgetListView=true;
    this.widgetFormView=true;
  }
  createWidget()
  {}
  cancelWidgetForm(event)
  {}

  resetWidgetForm()
  {}
  addWidgetFormView(event)
  {}
}
