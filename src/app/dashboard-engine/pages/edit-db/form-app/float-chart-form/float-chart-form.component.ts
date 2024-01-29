import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { WidgetService } from '../../../../services/widget/widget.service';
import { WidgetDataServiceParam } from '../../../../model/widget';

@Component({
  selector: 'app-float-chart-form',
  templateUrl: './float-chart-form.component.html',
  styleUrls: ['./float-chart-form.component.css']
})
export class FloatChartFormComponent implements OnInit {
  @Input('group') widgetFrom: FormGroup;
  styleList: any;
  colClasses: any;
  @Input() colClassId;
  dataSourceList: any;
  dsSelected: boolean;
  inputParams: WidgetDataServiceParam[];
  dsInputParamValuesFromDB: { "id": number; "value": string; "dashBoardWidgetId": number; "analyticDataServiceInputParamId": number; "status": string; "createdBy": number; "updatedBy": number; }[];
  constructor(private widgetService: WidgetService, private formBuilder: FormBuilder) { }


  ngOnInit() {
    //replace fixed id with variable before deployment
    this.getChartColorByWidgetCode(3,"STL");
    this.getServiceListByWidgetCode(3);
    //this.getWidgetDetailsByWidgetId(1);
  }
  getColClassesList(id:number) {
    this.widgetService.getWidgetParamValueByWidgetParamId(id)
      .subscribe(
        res => {
          console.log(JSON.stringify(res));
          this.colClasses = res;
        },
        error => {
          alert('error')
        });
  }
  getServiceListByWidgetCode(id: number) {
    this.widgetService.getWidgetDataSourceListByWidgetCode(id)
      .subscribe(
        res => {
          this.dataSourceList = res;
        },
        error => {
          
        });
  }
  getChartColorByWidgetCode(id:number,code: string) {
    this.widgetService.getWidgetParamValueByWidgetParamId(id)
      .subscribe(
        res => {
          this.styleList = res;
          alert(this.styleList);
        },
        error => {
          
        });
  }
  getWidgetDetailsByWidgetId(id: number) {

  }
  dataSourceChange(event: Event) {

    this.widgetService.getAnalyticDataServiceInputParamsByDataServiceId(1).subscribe(data => {
      this.inputParams = data;
      const control = <FormArray>this.widgetFrom.controls['dsInputParams'];
      for (let i = control.length - 1; i >= 0; i--) {
        control.removeAt(i)
      }
      for (let dsInputParam of this.inputParams) {
        (<FormArray>this.widgetFrom.get('dsInputParams')).push(this.adddsInputParamValueForumGroup());
      }
      this.dsSelected = true;
      this.getDsInputParamValues()
    })
  }

  public adddsInputParamValueForumGroup(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      value: [null],
      analyticDataServiceInputParamId: [null],
      status: [null],
      dashBoardWidgetId: [null]
    })
  }

  getDsInputParamValues() {
    this.dsInputParamValuesFromDB = [{ "id": 1, "value": "value1", "dashBoardWidgetId": 1, "analyticDataServiceInputParamId": 1, "status": "Active", "createdBy": 1, "updatedBy": 1 }, { "id": 2, "value": "value2", "dashBoardWidgetId": 1, "analyticDataServiceInputParamId": 2, "status": "Active", "createdBy": 1, "updatedBy": 1 }, { "id": 3, "value": "value3", "dashBoardWidgetId": 1, "analyticDataServiceInputParamId": 3, "status": "Active", "createdBy": 1, "updatedBy": 1 }]
    if (this.dsInputParamValuesFromDB !== null && this.dsInputParamValuesFromDB.length !== 0) {
      this.widgetFrom.setControl('dsInputParams', this.patchDynamicParamArray())
    }
  }

  patchDynamicParamArray(): FormArray {
    const formArray = new FormArray([]);
    if (this.inputParams !== null && this.inputParams.length !== 0) {
      this.inputParams.forEach(param => {
        let matched = false;
        let index = 0;
        for (let dsInputParamValue of this.dsInputParamValuesFromDB) {
          if (param.id === dsInputParamValue.analyticDataServiceInputParamId) {
            matched = true;
            break;
          }
          index++;
        }
        if (matched) {
          formArray.push(this.formBuilder.group({
            id: this.dsInputParamValuesFromDB[index].id,
            value: this.dsInputParamValuesFromDB[index].value,
            analyticDataServiceInputParamId: this.dsInputParamValuesFromDB[index].analyticDataServiceInputParamId,
            status: this.dsInputParamValuesFromDB[index].status,
            dashBoardWidgetId: this.dsInputParamValuesFromDB[index].dashBoardWidgetId
          }))
        } else {
          formArray.push(this.formBuilder.group({
            id: [null],
            value: [null],
            analyticDataServiceInputParamId: [null],
            status: [null],
            dashBoardWidgetId: [null]
          }))
        }
      })
    }
    return formArray
  }
}
