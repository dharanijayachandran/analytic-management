import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy } from '@angular/core';

import { DropDownTreeComponent } from '@syncfusion/ej2-angular-dropdowns';
import { CheckBoxComponent } from '@syncfusion/ej2-angular-buttons';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';
import { WidgetService } from '../../../services/widget/widget.service';
import { UIModalNotificationPage } from 'global';

@Component({
  selector: 'app-nge-alarm',
  templateUrl: './nge-alarm.component.html',
  styleUrls: ['./nge-alarm.component.css']
})
export class NgeAlarmComponent implements OnInit, OnDestroy {
  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;

  displayedColumns: string[] = ['alarmEntityTypeName', 'alarmEntityName', 'alarmTypeName', 'alarmConditionValue', 'alarmDateTime', 'alarmDataValue', 'alarmSeverityName', 'alarmStateName', 'alarmEventDateTime', 'edit'];

  // alarmDataForm: FormGroup;
  // assetList: Asset[];
  // displayedColumns: string[] = [];

  filterExpandCollapse = "Click to Show Filter";
  @ViewChild('defaultCheck')
  public ddTreeObj: DropDownTreeComponent;
  @ViewChild('check')
  public checkboxObj: CheckBoxComponent;
  currentTime: any;
  config: any;
  noRerocrdFound = false;
  curDate: string;
  isDisabled;
  todayDate: { month: number; day: number; year: number; };
  minDate: { month: number; day: number; year: number; };
  endDate: { month: number; day: number; year: number; };

  validateTime = false;
  alarmForm: FormGroup;
  validTime: boolean;
  dataSource = new MatTableDataSource();
  // dataSource: MatTableDataSource<unknown>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // Mat sorting for if use ngIf condition to show table starts here======================
  sort;
  pageSize: number;
  fileName: string;
  showLoaderImage: boolean = false;
  toggleFilterSearch: boolean = false;
  show: boolean = false;
  alarmClearedValue: any[];
  alarmStates: any[];
  alarmSeveritys: any[];
  alarmTypes: any[];
  alarmFormData: any;
  eventActionId: any;
  alarmEvent: any;
  assets: any[];
  totalAlarmData: any[];
  selectedAlarmStateItems: any[] = [];
  selectedAlarmSeverityItems: any[] = [];
  selectedAssetItems: any[] = [];
  alarmSeveritysForMultiSelect: any[];
  alarmStatesForMultiSelect: any[];
  settings = {};
  assetSettings = {};
  assetsForMultiSelect: any[] = [];
  assetTags: any[] = [];
  finalListOfFilteredAlarmData: Set<any> = new Set<any>();
  alarmStateIds: any[] = [];
  alarmSeverityIds: any[] = [];
  endDateTime: number;
  startDateTime: number;
  subscribe: Subscription;
  alarmStateMap = new Map<string, number>();
  masterMapOfAlarmData = new Map<number, any>();
  latestAlarmEventTime: any;
  enableViewButton: boolean = true;
  clearTheSearch: boolean = true;
  engUnits: any[] = [];
  timeInterval: any;
  expand: any = false;
  userDashboard: boolean;
  inter: NodeJS.Timeout;
  fontSize: any;
  targetTimeZone: string;
  url: any;
  alarmSeverityMap: any;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  // Mat sorting for if use ngIf condition to show table ends here======================

  constructor(private formBuilder: FormBuilder, private widgetService: WidgetService,
    private globalService: globalSharedService, config: NgbTimepickerConfig) {
    this.inter = setInterval(() => { this.currentTime = new Date().getHours() + ':' + new Date().getMinutes() }, 1);
    config.spinners = false;


  }
  @Input()
  FS;
  @Input()
  DS;
  @Input()
  OND;
  @Input()
  RI;
  // @Input()
  // params;
  @Input()
  origin;
  @Input() interval;
  @Input()
  assetId: any;
  // public timeInterval: { alarmTimeInterval: number, eventTimeInterval: string} = timeInterval

  ngOnInit() {
    this.getEnggUnits();
    this.getAlarmSeveritys();
    this.getAlarmStates();
    this.getAlarmTypes();
    this.fontSize = this.FS;
    if (this.origin == "UD") {
      if (typeof this.RI !== 'undefined') {
        this.inter = setInterval(() => {
          this.loadDataOnCall(this.DS)
        }, +this.RI * 1000);
      }
    }

    this.loadDataOnCall(this.DS);

    this.userDashboard = false;
    if (this.origin == "UD") {
      this.userDashboard = true;
    }
  }

  ngOnDestroy() {
    clearInterval(this.inter);
  }


  loadDataOnCall(ds: Object) {
    if (ds) {


      let url = ds["URL"];
      //debugger;
      if (url != undefined) {

        //debugger;
        let params = ds["params"];
        // this.targetTimeZone=Intl.DateTimeFormat().resolvedOptions().timeZone;
        let queryString = "";//"?targetTimeZone=" + this.targetTimeZone;
        if (!this.assetId) {
          for (let k = 0; k < params.length; k++) {
            this.targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (params[k]["name"] == "organizationId") {
              url = url.replace("/{paramString}", queryString);
              queryString = params[k]["value"]+"/alarms?target-time-zone=" + this.targetTimeZone ;
              url = url + queryString;
            } else {
              queryString = queryString + '' + params[k]["value"];
              url = url.replace("{paramString}", queryString);
              queryString = "?targetTimeZone=" + this.targetTimeZone ;
              url = url + queryString;
            }
          }
        } else {
          // http://10.225.10.24:8182/AlarmManagementService/alarm/419/asset-alarms?targetTimeZone=Asia/Calcutta
          url = url.replace("{paramString}", this.assetId);
          url = url + "?targetTimeZone=" + this.targetTimeZone
        }

        this.url = url;
        this.getDataByDataServiceUrl(url);
      } else {
        this.dataSource = new MatTableDataSource();
        this.dataSource.data = [
          {
            "alarmEntityTypeName": "R&D Rack 035",
            "alarmEntityName": "Temperature",
            "alarmTypeId": 2,
            "alarmDateTime": "2020-06-02 19:58:58",
            "alarmDataValue": "36.13",
            "alarmId": 11802,
            "alarmSeverityId": 1,
            "alarmStateId": 3,
            "alarmEntityTypeId": 2,
            "alarmEntityId": 4734,
            "alarmStates": [],
            "alarmTime": 1591108138092,
            "alarmEventTime": 1591204827789,
            "alarmEventDateTime": "2020-06-03 22:50:27",
            "alarmConfigId": 384,
            "unitId": 11
          },
          {
            "alarmEntityTypeName": "R&D Rack 030",
            "alarmEntityName": "Temperature",
            "alarmTypeId": 2,
            "alarmDateTime": "2020-06-02 19:58:54",
            "alarmDataValue": "36.75",
            "alarmId": 11791,
            "alarmSeverityId": 5,
            "alarmStateId": 2,
            "alarmEntityTypeId": 2,
            "alarmEntityId": 4679,
            "alarmStates": [
              3
            ],
            "alarmTime": 1591108134348,
            "alarmEventTime": 1591864631467,
            "alarmEventDateTime": "2020-06-11 14:07:11",
            "alarmConfigId": 448,
            "unitId": 11
          },
          {
            "alarmEntityTypeName": "R&D Rack 036",
            "alarmEntityName": "Temperature",
            "alarmTypeId": 2,
            "alarmDateTime": "2020-06-02 19:58:52",
            "alarmDataValue": "34.39",
            "alarmId": 11800,
            "alarmSeverityId": 1,
            "alarmStateId": 2,
            "alarmEntityTypeId": 2,
            "alarmEntityId": 4752,
            "alarmStates": [
              3
            ],
            "alarmTime": 1591108132673,
            "alarmEventTime": 1591864607848,
            "alarmEventDateTime": "2020-06-11 14:06:47",
            "alarmConfigId": 385,
            "unitId": 11
          }
        ]
      }
    } else {
      this.targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      let url
      let organizationId = sessionStorage.getItem('beId');
      let targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      let userId = parseInt(sessionStorage.getItem('userId'));
      if (this.assetId) {
        url = 'AlarmManagementService/alarm/' + this.assetId + '/asset-alarms' + "?targetTimeZone=" + this.targetTimeZone
      } else {
        url = 'AlarmManagementService/alarm/organization/' + organizationId + '/alarms?targetTimeZone=' + targetTimeZone + '&user-id=' + userId
      }

      // http://10.225.10.24:8182/AlarmManagementService/alarm/419/asset-alarms?targetTimeZone=Asia/Calcutta
      this.widgetService.getApiUrl().subscribe(data => {
        let api = data.api
        url = api + url;
        this.url = url;
        this.getDataByDataServiceUrl(url);
      })

    }
  }
  getDataByDataServiceUrl(url: any) {
    this.getTableResponse(url, "treeHierarchy");
  }


  setAllInfoToAlarm(alarm: any): any {
    let action = [];
    this.alarmTypes.forEach(type => {
      if (alarm.typeId == type.id) {
        alarm.alarmTypeName = type.name
      }
    })
    this.alarmSeveritys.forEach(severity => {
      if (alarm.severityId == severity.id) {
        alarm.alarmSeverityName = severity.name;
      }
    })
    this.alarmStates.forEach(state => {
      if (alarm.stateId == state.id) {
        alarm.alarmStateName = state.name;
      }
    })
    alarm.alarmStates.forEach(s => {
      this.alarmStates.forEach(state => {
        if (s == state.id) {
          let stateObject = {
            'id': s,
            'name': state.name
          }
          action.push(stateObject);
        }
      })
    })
    alarm.alarmStates = action;
    this.engUnits.forEach(unit => {
      if (unit.id == alarm.unitId) {
        alarm.conditionValue = alarm.conditionValue + ' ' + unit.name;
        alarm.dataValue = alarm.dataValue + ' ' + unit.name;
      }
    })
    return alarm;
  }


  loadForm() {
    // this.patchDates();
    this.futureDateDisabled();
    this.settings = {
      text: "--Select--",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "myclass custom-class",
      badgeShowLimit: 0,
      //noDataLabel: 'No Data Available'
    };
  }

  refreshTableListFunction() {
    this.getTableResponse(this.url, "alarm");
  }

  requiredFormat(items) {
    const that = this;
    return items && items.length ? items.map(function (o) {
      var returnObj = {
        "id": o.id,
        "itemName": o.name
      }
      return returnObj;
    }) : [];
  }


  flterDataWithDates(startDateTime: number, endDateTime: number) {
    this.totalAlarmData.forEach(data => {

      if (data.alarmEventTime >= startDateTime && data.alarmEventTime <= endDateTime) {
        this.finalListOfFilteredAlarmData.add(data);
      }
    })

  }

  filterTheDataWithAssetTags(assetTags: any[]) {
    assetTags.forEach(tag => {
      this.totalAlarmData.forEach(data => {
        if (tag.id == data.alarmEntityId) {
          this.finalListOfFilteredAlarmData.add(data);
        }
      })
    })
  }

  filterDataWithAlarmSeverity(alarmSeverityIds: any[]) {
    alarmSeverityIds.forEach(id => {
      this.totalAlarmData.forEach(data => {
        if (id == data.alarmSeverityId) {
          this.finalListOfFilteredAlarmData.add(data);
        }
      })
    })
  }

  filterDataWithAlarmState(alarmStateIds: any[]) {
    alarmStateIds.forEach(id => {
      this.totalAlarmData.forEach(data => {
        if (id == data.alarmStateId) {
          this.finalListOfFilteredAlarmData.add(data);
        }
      })
    })
  }

  createDataSourceObject(res: any[]): any[] {
    // let action = [];
    res.forEach(alarm => {
      let alarmStates = [];
      if(alarm.stateId == 1){
        alarmStates.push(2)
      }else if(alarm.stateId == 2){
        alarmStates.push(3)
      }
      alarm.alarmStates = alarmStates;
      alarm = this.setAllInfoToAlarm(alarm);
      if(this.alarmSeverityMap){
        alarm.colorCode = this.alarmSeverityMap[alarm.severityId]["colorCode"]
      }
      this.masterMapOfAlarmData.set(alarm.id, alarm);
    })
    return res
  }

  getTableResponse(url, type) {
    // url = 'http://10.225.10.24:8080/AlarmManagementService/organizations/192/alarms?target-time-zone=Asia/Calcutta&latestTime='
    if (this.dataSource) {
      this.dataSource.data = [];
    }
    this.noRerocrdFound = false;
    // this.showLoaderImage = true;
    // let res = ALARM_DATA;
    let beId = parseInt(sessionStorage.getItem('beId'));
    let targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.widgetService.getDashboardWidgetDataByDataService(url, type).subscribe(res => {
      if(res && res.length){
        let alarmData = res[0]["alarm"];
        this.alarmSeverityMap = res[0]["severitys"];
        this.alarmStateMap = res[0]["states"]
        if (null != alarmData && Array.isArray(alarmData) && alarmData.length) {
          alarmData = this.createDataSourceObject(alarmData);
          let noClearedAlarms = [];
          alarmData.forEach(r => {
            if ('Cleared' !== this.alarmStateMap[r.stateId]) {
              noClearedAlarms.push(r)
            }
          })
          alarmData = noClearedAlarms;
          alarmData = alarmData.sort((a, b) => b.eventTime - a.eventTime)
          this.latestAlarmEventTime = alarmData[0].eventTime;
          this.totalAlarmData = alarmData;
          this.dataSource = new MatTableDataSource();
          this.showLoaderImage = false;
          this.dataSource.data = alarmData;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          this.showLoaderImage = false;
          this.noRerocrdFound = true;
        }
      }

    });
  }



  // callClearAPI() {
  //   this.displayedColumns.splice(5, 0, 'alarmEventDataValue');
  // }

  getAlarmStates() {
    this.widgetService.getAlarmStates().subscribe(res => {
      if (null != res) {
        res = res.sort((a, b) => a.id - b.id);
        res.forEach(state => {
          this.alarmStateMap.set(state.name, state.id)
        })
      }
      // res = res.filter(state => state.id != 4);
      this.alarmStates = res;

      this.alarmStatesForMultiSelect = this.requiredFormat(res);
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    )
  }

  getEnggUnits() {
    this.widgetService.getEnggUnits().subscribe(res => {
      this.engUnits = res;
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
  }

  getAlarmSeveritys() {
    this.widgetService.getAlarmSeveritys().subscribe(res => {
      this.alarmSeveritys = res;
      this.alarmSeveritysForMultiSelect = this.requiredFormat(res);
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
  }

  getAlarmTypes() {
    this.widgetService.getAlarmTypes().subscribe(res => {
      this.alarmTypes = res;
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
  }


  addMinDateValue() {
    let startDate = this.fetchStartDateFromPicker();
    if (null != startDate) {
      let fullDate = startDate.split('/');
      this.minDate =
      {
        month: parseInt(fullDate[0]),
        day: parseInt(fullDate[1]),
        year: parseInt(fullDate[2]),
      }
    }

    this.onClickOfFilterFields();
  }


  endTime:any = new FormControl('endTime', (control: FormControl) => {
    const value = control.value;
    if (!value) {
      return { required: true };
    }
    return null;
  });
  startTime:any = new FormControl('startTime', (control: FormControl) => {
    const value = control.value;
    if (!value) {
      return { required: true };
    }
    return null;
  });


  onClickOfFilterFields() {

    let startDate = this.fetchStartDateFromPickerForApiCall();
    let endDate = this.fetchEndDateFromPickerForApiCall();

    if (this.ddTreeObj.value.length != 0 || this.selectedAlarmStateItems.length != 0 ||
      this.selectedAlarmSeverityItems.length != 0 || startDate != null || endDate != null) {
      this.enableViewButton = false;
    } else {
      this.enableViewButton = true;
    }
  }



  iterateTheSubList(subAssets: any[]) {
    const that = this;
    subAssets.forEach(asset => {
      if (null != asset.subAssets && asset.subAssets.length != 0) {
        asset.hasChild = true;
        this.iterateTheSubList(asset.subAssets)
      }
    })
  }

  patchDates() {
    let endDate = new Date();
    let startDate = formatDate(endDate, 'MM/dd/yyyy', 'en');
    let arrayDate = startDate.split('/');
    let fullDate = {
      month: parseInt(arrayDate[0]),
      day: parseInt(arrayDate[1]),
      year: parseInt(arrayDate[2])
    }
    this.alarmForm.patchValue({
      startDate: fullDate,
      endDate: fullDate,
    })
    // this.getAlarmDataByOrganizationId();
  }




  parseInt(id) {
    if (isNaN(id)) {
      return id;
    }
    return parseInt(id);
  }
  /* resetForm() {
    // this.alarmForm.reset();
    this.loadForm();
    this.selectedAlarmSeverityItems.length = 0;
    this.selectedAlarmStateItems.length = 0;
    this.onClickOfFilterFields();
    this.ddTreeObj.value.length = 0
    this.clearTheSearch = true;
    this.enableViewButton = true;
    let res = [];
    this.updateTheMasterMap(res);
  } */

  futureDateDisabled() {
    this.curDate = formatDate(new Date(), 'MM/dd/yyyy', 'en');
    let fullDate = this.curDate.split('/');
    this.todayDate =
    {
      month: parseInt(fullDate[0]),
      day: parseInt(fullDate[1]),
      year: parseInt(fullDate[2])
    }
    this.minDate = this.todayDate;
    this.endDate = this.todayDate
  }

  fetchEndTimeFromTimePicker() {
    let hours = this.endTime.value.hour;
    if (hours <= 9) {
      hours = '0' + hours
    }
    let minutes = this.endTime.value.minute;
    if (minutes <= 9) {
      minutes = '0' + minutes
    }
    return hours + ':' + minutes
  }

  fetchStartTimeFromTimePicker() {
    let hours = this.startTime.value.hour;
    if (hours <= 9) {
      hours = '0' + hours
    }
    let minutes = this.startTime.value.minute;
    if (minutes <= 9) {
      minutes = '0' + minutes
    }
    return hours + ':' + minutes
  }

  fetchStartDateFromPickerForApiCall() {
    if (null != this.alarmForm.value.startDate) {
      let newDay = this.alarmForm.value.startDate.day;
      if (newDay <= 9) {
        newDay = '0' + newDay;
      }
      let newMon = this.alarmForm.value.startDate.month;
      if (newMon <= 9) {
        newMon = '0' + newMon;
      }
      let newYrs = this.alarmForm.value.startDate.year;
      let reqDateOfBirth = newYrs + '-' + newMon + '-' + newDay;
      return reqDateOfBirth;
    }
  }

  fetchStartDateFromPicker() {
    if (null != this.alarmForm.value.startDate) {
      let newYrs = this.alarmForm.value.startDate.year;
      let newDay = this.alarmForm.value.startDate.day;
      if (newDay <= 9) {
        newDay = '0' + newDay;
      }
      let newMon = this.alarmForm.value.startDate.month;
      if (newMon <= 9) {
        newMon = '0' + newMon;
      }
      let reqDateOfBirth = newMon + '/' + newDay + '/' + newYrs;
      return reqDateOfBirth;
    }
  }

  fetchEndDateFromPickerForApiCall() {
    if (null != this.alarmForm.value.endDate) {
      let newDay = this.alarmForm.value.endDate.day;
      if (newDay <= 9) {
        newDay = '0' + newDay;
      }
      let newMon = this.alarmForm.value.endDate.month;
      if (newMon <= 9) {
        newMon = '0' + newMon;
      }
      let newYrs = this.alarmForm.value.endDate.year;
      let reqDateOfBirth = newYrs + '-' + newMon + '-' + newDay;
      return reqDateOfBirth;
    }
  }

  fetchEndDateFromPicker() {
    if (null != this.alarmForm.value.endDate) {
      let newDay = this.alarmForm.value.endDate.day;
      if (newDay <= 9) {
        newDay = '0' + newDay;
      }
      let newMon = this.alarmForm.value.endDate.month;
      if (newMon <= 9) {
        newMon = '0' + newMon;
      }
      let newYrs = this.alarmForm.value.endDate.year;
      let reqDateOfBirth = newMon + '/' + newDay + '/' + newYrs;
      return reqDateOfBirth;
    }
  }

  validateFromDate() {

    this.onClickOfFilterFields();

    if (this.alarmForm.value.startDate != null && this.alarmForm.value.endDate != null) {

      let startDay = this.alarmForm.value.startDate.day;
      let endDay = this.alarmForm.value.endDate.day;
      if (startDay > endDay) {
        this.alarmForm.patchValue({
          startDate: this.fetchStartDateFromPicker()
        }, { emitEvent: false });
      }

      let endMonth = this.alarmForm.value.endDate.month;
      let startMonth = this.alarmForm.value.startDate.month;
      if (endMonth > startMonth) {
        this.alarmForm.patchValue({
          startDate: this.fetchStartDateFromPicker()
        }, { emitEvent: false });
      }
    } else if (this.alarmForm.value.endDate == null || this.alarmForm.value.startDate == null) {
      this.futureDateDisabled();
    }
  }

  validateFromStartFromEndDate() {
    let date = this.fetchEndDateFromPicker()
    if (null != date) {
      let fullDate = date.split('/');
      //let currenatDay = this.dayCalculate(fullDate[2]);
      this.endDate =
      {
        month: parseInt(fullDate[0]),
        day: parseInt(fullDate[1]),
        year: parseInt(fullDate[2]),
      }
      this.addMinDateValue();
    }

    this.onClickOfFilterFields();
  }

  validateStartAndEndTime() {
    this.validateTime = false;
    let startDate = this.fetchStartDateFromPicker()
    let endDate = this.fetchEndDateFromPicker()
    if (startDate === endDate) {
      let startTime = this.alarmForm.value.startTime
      let endTimeTime = this.alarmForm.value.endTime
      let strtHr, strtMin, endHr, endMin
      if (startTime.length != 0) {
        let startTimeArray = startTime.split(':')
        strtHr = parseInt(startTimeArray[0]);
        strtMin = parseInt(startTimeArray[1]);
      }
      if (endTimeTime.length != 0) {
        let endTimeTimeArray = endTimeTime.split(':')
        endHr = parseInt(endTimeTimeArray[0]);
        endMin = parseInt(endTimeTimeArray[1]);
      }
      if (strtHr >= endHr) {
        if (strtMin >= endMin) {
          this.validateTime = true
        } if (strtHr > endHr) {
          this.validateTime = true
        }
        this.alarmForm.setErrors({ 'invalid': true });
      }
    }
  }


  // filterSearchBox
  filterSearchBox() {
    this.toggleFilterSearch = !this.toggleFilterSearch;
    if (this.toggleFilterSearch) {
      this.filterExpandCollapse = "Click to Hide Filter";
    } else {
      this.filterExpandCollapse = "Click to Show Filter";
    }
  }


  actionChange(element: any, alarmData: any) {
    this.alarmEvent = {};
    this.alarmEvent['alarmState'] = this.parseInt(alarmData.id);
    this.alarmEvent.alarmId = element.id;
    this.alarmEvent.alarmEntityId = element.entityId;
    this.alarmEvent.alarmConfigId = element.configId;
    this.alarmEvent.alarmEventDataValue = element.eventDataValue
    // this.eventActionId = event.target.value;
    this.modelNotification.inputField = true;
    this.modelNotification.swalWarningAlarm('Do you want change the state of alarm');
  }

  sendStateEvent(remark) {
    this.alarmEvent.remark = remark;
    this.alarmEvent.alarmEventTime = new Date().getTime();
    this.alarmEvent.alarmEventUserId = this.parseInt(sessionStorage.getItem('userId'))

    this.widgetService.saveAlarmEvent(this.alarmEvent).subscribe(res => {

      this.modelNotification.alertMessage(res['messageType'], res['message']);
    }, error => {
      this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
    })
  }

  // Search filter with Table
  panelExpandCollapseEmitter(event) {
    this.expand = event;
  }


}
