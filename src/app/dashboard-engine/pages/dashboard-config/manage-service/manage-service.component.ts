import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-manage-service',
  templateUrl: './manage-service.component.html',
  styleUrls: ['./manage-service.component.css']
})
export class ManageServiceComponent implements OnInit {
  serviceListView = true;
  serviceFormView = true;
  dataSourceService: any;
  displayedColumnsService: string[] = ['id', 'name', 'route','category', 'serviceStatus', 'edit'];
  serviceForm: FormGroup;
  serviceListHeader: any;
  addServiceButton = false;
  constructor(private formBuilder: FormBuilder) {
    this.serviceForm = this.formBuilder.group({
      id:1,
      serviceName:[''],
      serviceRoute:[''],
      category:[''],
      serviceDescription:[''],
      serviceStatus:true
    });
  }

  ngOnInit() {
    
  }
  addServiceFormView(event)
  {
    this.serviceListView=false;
    this.serviceFormView=true;
  }
  cancelServiceForm(event)
  {
    this.serviceListView=true;
    this.serviceFormView=false;
  }
  createService()
  {}
  resetServiceForm(){}
}
