import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-widget-service-mapping',
  templateUrl: './widget-service-mapping.component.html',
  styleUrls: ['./widget-service-mapping.component.css']
})
export class WidgetServiceMappingComponent implements OnInit {
  WSMListView = true;
  WSMFormView = true;
  addWSMButton=true;
  dataSourceWSM: any;
  wCategoryList:any[]=[];
  sCategoryList:any[]=[];
  widgetList:any[]=[];
  serviceList:any[]=[];
  WSMListHeader: any;
  displayedColumnsWSM: string[] = ['id', 'widgetName', 'serviceName', 'categoryName','WSMstatus', 'edit'];
  WSMMappingForm:  FormGroup;;
  constructor(private formBuilder: FormBuilder) {
    this.WSMMappingForm = this.formBuilder.group({
      widgetCategoryList:[''],
      serviceCategoryList:[''],
      widgetList:[''],
      serviceList:['']
    });
   }

  ngOnInit() {
  }

  addWSMFormView(e)
  {}

  updateDashboardFormView(id,name){}
  deleteDashboard(id){}
  createMapping(){}
  cancelMappingForm(e){}
  resetMappingForm(){}
}
