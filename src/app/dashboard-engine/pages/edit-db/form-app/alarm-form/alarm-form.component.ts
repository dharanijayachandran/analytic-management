import { Component, OnInit, SimpleChanges, ChangeDetectorRef, Input } from '@angular/core';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { WidgetService } from '../../../../services/widget/widget.service';
import { WidgetDataServiceParam } from '../../../../model/widget';

@Component({
  selector: 'app-alarm-form',
  templateUrl: './alarm-form.component.html',
  styleUrls: ['./alarm-form.component.css']
})
export class AlarmFormComponent implements OnInit {
  @Input('group') widgetFrom: FormGroup;
  dataSourceList: any;
  dsSelected: boolean;
  @Input() selectedWidgetId;
  @Input() formOpenType;
  @Input() dashBoardWidgetId;
  @Input() typeOfWidget;
  dashboardWidgetPosition: string;
  inputParams: WidgetDataServiceParam[];
  dsInputParamValuesFromDB: { "id": number; "value": string; "dashBoardWidgetId": number; "analyticDataServiceInputParamId": number; "status": string; "createdBy": number; "updatedBy": number; }[];
  iconList: any;
  constructor(private widgetService: WidgetService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef) { }
  ngOnInit() {
    //alert(this.colClassId + 'childForm');
    //alert(this.iconId + 'childFormIcon');
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.formOpenType) {
      if (changes.formOpenType.currentValue != changes.formOpenType.previousValue) {
        if (this.formOpenType != "tempWidget") {
          this.getDataSourceFormOnUpdate(this.formOpenType);
        }
      }
    }
    /*  if (changes.iconId) {
       if (changes.iconId.currentValue != changes.iconId.previousValue) {
         this.getIconList(this.iconId);
       }
     }
     if (changes.styleId) {
       this.styleList = [];
       if (changes.styleId.currentValue != changes.styleId.previousValue) {
         this.getStyleList(this.styleId);
       }
     } */

    if (changes.selectedWidgetId) {
      if (changes.selectedWidgetId.currentValue != changes.selectedWidgetId.previousValue) {
        this.getServiceListByWidgetCode(this.selectedWidgetId);
      }
    }
    /* if (changes.colClassId) {
      if (changes.colClassId.currentValue != changes.colClassId.previousValue) {
        this.getColClassesList(this.colClassId);
      }
    } */

  }

  /*   ngAfterViewInit() {
      var id = this.selectedWidgetId;
      this.dashboardWidgetPosition = document.getElementById(id).style.transform;
      this.cdr.detectChanges();
    } */

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

  getServiceListByWidgetCode(id: number) {
    this.widgetService.getWidgetDataSourceListByWidgetCode(id)
      .subscribe(
        res => {
          this.dataSourceList = res;
        },
        error => {

        });
  }


  dataSourceChange(event: Event) {
    const control = <FormArray>this.widgetFrom.controls['dsInputParams'];
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i)
    }
    this.widgetService.getAnalyticDataServiceInputParamsByDataServiceId(+event).subscribe(data => {
      this.inputParams = data;

      // if (this.formOpenType != "tempWidget" && this.dashBoardWidgetId) {
      //   this.widgetService.getdashboardWidgetServiceInputParamValueByDashboardWidgetId(this.dashBoardWidgetId).subscribe(data => {
      //     let result = JSON.parse(JSON.stringify(data));
      //     this.dsInputParamValuesFromDB = result
      //     //  this.widgetFrom.setControl('dsInputParams', this.patchDynamicParamArrayForUpdate(data));
      //     this.getDsInputParamValues()
      //     this.dsSelected = true;
      //   });
      // } else {
        this.i = 0;
        for (let dsInputParam of this.inputParams) {
          (<FormArray>this.widgetFrom.get('dsInputParams')).push(this.addsInputParamValueForumGroup());
          this.i++;
        // }
        this.dsSelected = true;
      }



    })
  }

  i = 0;
  public addsInputParamValueForumGroup(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      value: [null],
      analyticDataServiceInputParamId: this.inputParams[this.i].id,
      status: [null],
      dashBoardWidgetId: [null]
    })
  }

  getDsInputParamValues() {
    // this.dsInputParamValuesFromDB = [{ "id": 1, "value": "192", "dashBoardWidgetId": 1, "analyticDataServiceInputParamId": 11, "status": "Active", "createdBy": 1, "updatedBy": 1 }]
    // this.dsInputParamValuesFromDB =[];

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
            //analyticDataServiceInputParamId: [null],
            status: [null],
            dashBoardWidgetId: [null]
          }))
        }
      })
    }
    return formArray
  }
}
