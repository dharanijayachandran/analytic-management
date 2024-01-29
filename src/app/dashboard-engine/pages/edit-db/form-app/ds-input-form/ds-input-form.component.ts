import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AnalyticDataServiceInputParam } from '../../../../model/widget';

@Component({
  selector: 'app-ds-input-form',
  templateUrl: './ds-input-form.component.html',
  styleUrls: ['./ds-input-form.component.css']
})
export class DsInputFormComponent implements OnInit {
  dsInputParamValueForm: FormGroup;
  dsInputParamValue;
  dsInputParams: AnalyticDataServiceInputParam[]=[];

  constructor(private formBuilder: FormBuilder) {

   }
   

  ngOnInit() {
    //this.validateCommPramValueForm();
    //this.getdsInputParams();
    
    alert(this.dsInputParams);
  }

  savedsInputParamValueForm()
  {

  }

}
