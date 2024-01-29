import { Component, OnInit, Input, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { WidgetService } from '../../../../services/widget/widget.service';
import { WidgetDataServiceParam } from '../../../../model/widget';

@Component({
  selector: 'app-line-chart-form',
  templateUrl: './line-chart-form.component.html',
  styleUrls: ['./line-chart-form.component.css']
})
export class LineChartFormComponent implements OnInit {
  @Input('group') widgetFrom: FormGroup;
  styleList: any;
  colClasses: any;
  @Input() colClassId;
  typeList: any;
  dataSourceList: any;
  dsSelected: boolean;
  @Input() inputParams: WidgetDataServiceParam[];
  dsInputParamValuesFromDB: { "id": number; "value": string; "dashBoardWidgetId": number; "analyticDataServiceInputParamId": number; "status": string; "createdBy": number; "updatedBy": number; }[];
  @Input() selectedWidgetId;
  @Input() formOpenType;
  @Input() styleId;
  @Input() typeId;
  dashboardWidgetPosition: string;
  multiColorLine: boolean;
  constructor(private widgetService: WidgetService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.styleList = [];

  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.formOpenType) {
      if (changes.formOpenType.currentValue != changes.formOpenType.previousValue) {
        if (this.formOpenType != "tempWidget") {
          this.getDataSourceFormOnUpdate(this.formOpenType);
        }
      }
    }
    if (changes.typeId) {
      if (changes.typeId.currentValue != changes.typeId.previousValue) {
        this.gettypeListByTypeId(this.typeId)
      }
    }
    if (changes.styleId) {
      if (changes.styleId.currentValue != changes.styleId.previousValue) {
        this.getChartColorByWidgetCode(this.styleId);
      }
    }

    if (changes.selectedWidgetId) {
      if (changes.selectedWidgetId.currentValue != changes.selectedWidgetId.previousValue) {
        this.getServiceListByWidgetCode(this.selectedWidgetId);
      }
    }
    if(changes.colClassId){
      if(changes.colClassId.currentValue != changes.colClassId.previousValue){
        this.getColClassesList(this.colClassId);
      }
    }
  }
  getColClassesList(id:number) {
    this.widgetService.getWidgetParamValueByWidgetParamId(id)
      .subscribe(
        res => {
          //console.log(JSON.stringify(res));
          this.colClasses = res;
        },
        error => {
          alert('error')
        });
  }
  ngAfterViewInit() {
    var id = this.selectedWidgetId;
    this.dashboardWidgetPosition = document.getElementById(id).style.transform;
    this.cdr.detectChanges();
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
  getChartColorByWidgetCode(id: number) {
    this.widgetService.getWidgetParamValueByWidgetParamId(id)
      .subscribe(
        res => {
          this.styleList = res;
        },
        error => {

        });
  }
  gettypeListByTypeId(id: number) {
    this.widgetService.getWidgetParamValueByWidgetParamId(id)
      .subscribe(
        res => {
          this.typeList = res;
        },
        error => {

        });
  }
  getWidgetDetailsByWidgetId(id: number) {

  }
  chartTypeChange(event: Event) {
    let selectedOpt = event;
    //alert(selectedOpt);
    if (selectedOpt.toString() === "MultiColoredLine") {
      this.multiColorLine = true;
    }
    else {
      this.multiColorLine = false;
    }
  }
  dataSourceChange(event: Event) {
    this.widgetService.getAnalyticDataServiceInputParamsByDataServiceId(+event).subscribe(data => {
      this.inputParams = data;
      const control = <FormArray>this.widgetFrom.controls['dsInputParams'];
      for (let i = control.length - 1; i >= 0; i--) {
        control.removeAt(i)
      }
      for (let dsInputParam of this.inputParams) {
        (<FormArray>this.widgetFrom.get('dsInputParams')).push(this.adddsInputParamValueForumGroup());
      }
      this.dsSelected = true;
      //alert(event);
      this.getDsInputParamValues()
    })
  }



  getDataSourceFormOnUpdate(id) {
    this.widgetService.getdashboardWidgetServiceInputParamValueByDashboardWidgetId(id).subscribe(data => {
      let result = JSON.parse(JSON.stringify(data));
      this.inputParams = [];
      result.forEach(element => {
        if (element['analyticDataServiceInputParam'] != undefined) {
          this.inputParams.push(element['analyticDataServiceInputParam'])
        }
      });
      this.widgetFrom.setControl('dsInputParams', this.patchDynamicParamArrayForUpdate(data));
      this.dsSelected = true;
    });
  }

  patchDynamicParamArrayForUpdate(data): FormArray {
    const formArray = new FormArray([]);
    if (data !== null && data.length !== 0) {
      data.forEach(param => {
        formArray.push(this.formBuilder.group({
          id: param['id'],
          value: param['value'],
          analyticDataServiceInputParamId: param['analyticDataServiceInputParamId'],
          status: param['status'],
          dashBoardWidgetId: param['dashboardWidgetId']
        }))

      })
    }
    return formArray
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
    this.dsInputParamValuesFromDB = [];//[{ "id": 1, "value": "value1", "dashBoardWidgetId": 1, "analyticDataServiceInputParamId": 1, "status": "Active", "createdBy": 1, "updatedBy": 1 }, { "id": 2, "value": "value2", "dashBoardWidgetId": 1, "analyticDataServiceInputParamId": 2, "status": "Active", "createdBy": 1, "updatedBy": 1 }, { "id": 3, "value": "value3", "dashBoardWidgetId": 1, "analyticDataServiceInputParamId": 3, "status": "Active", "createdBy": 1, "updatedBy": 1 }]

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
            //analyticDataServiceInputParamId: this.dsInputParamValuesFromDB[index].analyticDataServiceInputParamId,
            status: this.dsInputParamValuesFromDB[index].status,
            dashBoardWidgetId: this.dsInputParamValuesFromDB[index].dashBoardWidgetId
          }))
        } else {
          formArray.push(this.formBuilder.group({
            id: [null],
            value: [null],

            status: [null],
            dashBoardWidgetId: [null]
          }))
        }
      })
    }
    return formArray
  }
}
