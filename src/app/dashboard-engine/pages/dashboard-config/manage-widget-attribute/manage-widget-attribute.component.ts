import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import pageSettings from 'src/app/shared/config/page-settings';

@Component({
  selector: 'app-manage-widget-attribute',
  templateUrl: './manage-widget-attribute.component.html',
  styleUrls: ['./manage-widget-attribute.component.css']
})
export class ManageWidgetAttributeComponent implements OnInit {

  widgetListView = true;
  widgetAttributeFormView = true;
  addWidgetAttributeButton=true;
  widgetPropForm:FormGroup;
  dataSourceProp: any;
  displayedColumnsProp: string[] = ['id', 'key', 'value', 'propStatus', 'edit'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  pageSettings = pageSettings;
  widgetAttributeListHeader; any;
  constructor( private formBuilder: FormBuilder) { this.widgetPropForm = this.formBuilder.group({
    id: [null],
    widgetId:1,
    key:[''],
    value:[''],
    widgetPropDescription:[''],
    widgetPropStatus:true
    });}

  ngOnInit() {
  this.widgetListView=true;
  this.widgetAttributeFormView=true;
  this.addWidgetAttributeButton=true;
  }

  addWidgetAttributeFormView(event:Event)
  {
    this.widgetListView=false;
    this.widgetAttributeFormView=true;
    this.addWidgetAttributeButton=false;
  }
  cancelWidgetPropForm(event:Event)
  {
    this.widgetListView=true;
    this.widgetAttributeFormView=false;
    this.addWidgetAttributeButton=true;
  }

  createWidgetProp(){}

  resetWidgetPropForm(){}

}
