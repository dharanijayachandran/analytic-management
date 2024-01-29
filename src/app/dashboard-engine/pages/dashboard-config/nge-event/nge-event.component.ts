import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { WidgetService } from '../../../services/widget/widget.service';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { UIModalNotificationPage } from 'global';

@Component({
  selector: 'app-nge-event',
  templateUrl: './nge-event.component.html',
  styleUrls: ['./nge-event.component.css']
})
export class NgeEventComponent implements OnInit, OnDestroy {


  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;

  displayedColumns: string[] = ['alarmEntityTypeName', 'alarmEntityName', 'alarmEventDateTime', 'eventType', 'eventValue', 'eventState', 'alarmSeverityName'];
  // alarmDataForm: FormGroup;
  // assetList: Asset[];
  // displayedColumns: string[] = [];

  filterExpandCollapse = "Click to Show Filter";

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
  totalAlarmData: any[] = [];
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
  currentTime: string;
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
    this.fontSize = this.FS;
    this.getEnggUnits();
        this.getAlarmSeveritys();
        this.getAlarmStates();
        this.getAlarmTypes();
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


  loadDataOnCallForLatestRecord(ds: Object) {
    let url = ds["URL"];
    //debugger;
    if (url != undefined) {
      var splitted = url.replace("/{paramString}", "")
      //debugger;
      let params = ds["params"];
      // this.targetTimeZone=Intl.DateTimeFormat().resolvedOptions().timeZone;
      let queryString = "";//"?targetTimeZone=" + this.targetTimeZone;
      for (let k = 0; k < params.length; k++) {
        // queryString = '?organizationId=' + params[k]["value"];

        if (params[k]["name"] == "organizationId") {
          queryString = '?organizationId=' + params[k]["value"];

          this.targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          queryString = queryString + "&targetTimeZone=" + this.targetTimeZone + '&alarmStartDate=' + this.latestAlarmEventTime;
          url = url.replace("/{paramString}", queryString);
        } else {
          queryString = queryString + '' + params[k]["value"];
          // url = url.replace("{paramString}", queryString);
          this.targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          queryString = queryString + "&targetTimeZone=" + this.targetTimeZone + '&alarmStartDate=' + this.latestAlarmEventTime;
          url = url.replace("/{paramString}", queryString);
        }
      }
      // this.targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      // queryString = queryString + "&targetTimeZone=" + this.targetTimeZone + '&alarmStartDate=' + this.latestAlarmEventTime;
      // url = url.replace("/{paramString}", queryString);
      this.url = url;
      this.getDataByDataServiceUrl(url);
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
        let params = ds["params"];
        let startTime = new Date(this.getCurrentDate() + 'T00:00:00').getTime();
        let endDate = new Date(this.getCurrentDate() + 'T23:59:59').getTime();
        let queryString = "";//"?targetTimeZone=" + this.targetTimeZone;
        if (!this.assetId) {
          for (let k = 0; k < params.length; k++) {
            this.targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (params[k]["name"] == "organizationId") {
              url = url.replace("/{paramString}", queryString);
              queryString = params[k]["value"]+"/events?target-time-zone=" + this.targetTimeZone + '&start-date=' + startTime + '&end-date=' + endDate;
              url = url + queryString;
            } else {
              queryString = queryString + '' + params[k]["value"];
              url = url.replace("{paramString}", queryString);
              queryString = "?targetTimeZone=" + this.targetTimeZone + '&alarmStartDate=' + startTime + '&alarmEndDate=' + endDate;
              url = url + queryString;
            }
          }
        } else {
          //  http://10.225.10.24:8182/AlarmManagementService/alarm/419/asset-events?targetTimeZone=Asia/Calcutta&startDate=1589194088320&endDate=1590224929135
          url = url.replace("{paramString}", this.assetId);
          url = url + "?targetTimeZone=" + this.targetTimeZone + '&alarmStartDate=' + startTime + '&alarmEndDate=' + endDate;
        }
        // url = url + queryString
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

      //  http://10.225.10.24:8182/AlarmManagementService/alarm/419/asset-events?targetTimeZone=Asia/Calcutta&startDate=1589194088320&endDate=1590224929135

      //  url = url.replace("{paramString}", this.assetId);
      //  url = url + "?targetTimeZone=" + this.targetTimeZone + '&alarmStartDate=' + startTime + '&alarmEndDate=' + endDate;
      let startTime = new Date(this.getCurrentDate() + 'T00:00:00').getTime();
      let endDate = new Date(this.getCurrentDate() + 'T23:59:59').getTime();
      this.targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      let url ;
      let organizationId = sessionStorage.getItem('beId');
      let targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      let userId = parseInt(sessionStorage.getItem('userId'));
      if(this.assetId){
        url = 'AlarmManagementService/alarm/' + this.assetId + '/asset-events' + "?targetTimeZone=" + this.targetTimeZone + '&alarmStartDate=' + startTime + '&alarmEndDate=' + endDate;
      }else{
        url = 'AlarmManagementService/alarm/events?organizationId='+organizationId+'&alarmStartDate='+startTime+'&alarmEndDate='+endDate+'&targetTimeZone='+targetTimeZone+'&user-id='+userId
      }
      // http://10.225.10.24:8182/AlarmManagementService/alarm/419/asset-alarms?targetTimeZone=Asia/Calcutta
      this.widgetService.getApiUrl().subscribe(data => {
        let api = data.api
        url = api + url;
        this.getDataByDataServiceUrl(url);
      })
    }

  }

  getCurrentDate() {
    let date = new Date();
    let yr = date.getFullYear();
    let month = date.getMonth() + 1;
    let newMonth;
    if (month <= 9) {
      newMonth = '0' + month;
    } else {
      newMonth = month;
    }
    let day = date.getDate()
    let newDay;
    if (day <= 9) {
      newDay = '0' + day;
    }
    else {
      newDay = day;
    }
    let currentDate = yr + '-' + newMonth + '-' + newDay
    return currentDate;
  }



  getDataByDataServiceUrl(url: any) {
    this.getTableResponse(url, "alarm");

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

    alarm.alarmStates = action;
    this.engUnits.forEach(unit => {
      if (unit.id == alarm.unitId) {
        alarm.conditionValue = alarm.conditionValue + ' ' + unit.name;
        alarm.dataValue = alarm.dataValue + ' ' + unit.name;
      }
    })
    return alarm;
  }



  createDataSourceObject(res: any[]): any[] {
    // let action = [];
    res.forEach(alarm => {
      alarm = this.setAllInfoToAlarm(alarm);
      if(this.alarmSeverityMap){
        alarm.colorCode = this.alarmSeverityMap[alarm.severityId]["colorCode"]
      }
      this.masterMapOfAlarmData.set(alarm.eventId, alarm);
    })
    this.totalAlarmData = Array.from(this.masterMapOfAlarmData.values());
    return res
  }


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

  parseInt(id) {
    if (isNaN(id)) {
      return id;
    }
    return parseInt(id);
  }

  updateTheMasterMap(res: any[]) {

    res.forEach(event =>{
      this.totalAlarmData.push(event);
    })
    this.totalAlarmData = this.totalAlarmData.sort((a, b) => b.alarmEventTime - a.alarmEventTime);

  }



  getTableResponse(url, type) {
    // this.dataSource.data =[];
    this.noRerocrdFound = false;
    // this.showLoaderImage = true;
    // let res = ALARM_DATA;
    let beId = parseInt(sessionStorage.getItem('beId'));
    let targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let assets = null, severityIds = null, stateIds = null;
    // this.totalAlarmData = [];
    this.widgetService.getDashboardWidgetDataByDataService(url, type).subscribe(res => {
      if(res && res.length){
        let alarmData = res[0]["alarm"];
        this.alarmSeverityMap = res[0]["severitys"];
        this.alarmStateMap = res[0]["states"]
        if (null != alarmData && Array.isArray(alarmData) && alarmData.length !=0) {
          alarmData = this.createDataSourceObject(alarmData);
          // res = res.sort((a, b) => b.alarmEventTime - a.alarmEventTime)
          // this.latestAlarmEventTime = res[0].alarmEventTime;
          // this.updateTheMasterMap(res)
        }
          // this.latestAlarmEventTime = startDateTime;
          if (this.totalAlarmData && this.totalAlarmData.length !=0) {
            this.totalAlarmData = this.totalAlarmData.sort((a, b) => b.eventTime - a.eventTime);
            this.latestAlarmEventTime = this.totalAlarmData[0].eventTime;
            this.noRerocrdFound = false;
            this.dataSource.data = this.totalAlarmData;
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.showLoaderImage = false;
          } else {
            this.dataSource.data = [];
            this.noRerocrdFound = true;
          }

      }else {
        this.dataSource.data = [];
        this.noRerocrdFound = true;
      }
       this.showLoaderImage = false;
    })


  }
  actionChange(element, e){}
}
