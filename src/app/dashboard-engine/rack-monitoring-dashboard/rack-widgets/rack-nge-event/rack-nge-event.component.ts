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
  selector: 'rack-nge-event',
  templateUrl: './rack-nge-event.component.html',
  styleUrls: ['./rack-nge-event.component.css']
})
export class RackNgeEventComponent implements OnInit {


  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;

  displayedColumns: string[] = ['entityTypeName', 'entityName', 'eventDateTime', 'alarmTypeName', 'eventDataValue', 'alarmStateName', 'alarmSeverityName'];
  displayTableHeader = ['Asset', 'Event Entity', 'Event Time', 'Event Type', 'Event Value', 'Event State', 'Severity'];


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
  assetTagIds: any[];
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
  @Input() pagination: any
  // public timeInterval: { alarmTimeInterval: number, eventTimeInterval: string} = timeInterval

  ngOnInit() {
    this.assetTagIds = this.widgetService.assetTagIds;
    this.widgetService.iconFromDashboard = true;
    this.fontSize = this.FS;
    this.getEnggUnits();
    this.getAlarmSeveritys();
    this.getAlarmStates();
    this.getAlarmTypes();
    if (this.origin == "UD") {
      if (typeof this.RI !== 'undefined') {
        // this.inter = setInterval(() => {
        //   this.loadDataOnCall(this.DS)
        // }, +this.RI * 1000);
      }
    }

    this.loadDataOnCall();
    this.showLoaderImage = true;
    this.userDashboard = false;
    if (this.origin == "UD") {
      this.userDashboard = true;
    }
    this.widgetService.getTimeIntervalsFromFile().toPromise().then(data => {
      let interval = data.rackMonitorRefreshTimeInterval;
      this.inter = setInterval(() => {
        this.loadDataOnCall()
      }, +interval);
    })
  }



  ngOnDestroy() {
    clearInterval(this.inter);
    this.widgetService.iconFromDashboard = false;
  }


  loadDataOnCall() {
        let startTime = new Date(this.getCurrentDate() + 'T00:00:00').getTime();
      let endDate = new Date(this.getCurrentDate() + 'T23:59:59').getTime();
      this.targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      let url;
      let organizationId = sessionStorage.getItem('beId');
      let targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      let userId = parseInt(sessionStorage.getItem('userId'));
      if (this.assetId) {
        url = 'AlarmManagementService/alarm/' + this.assetId + '/asset-events' + "?targetTimeZone=" + this.targetTimeZone + '&alarmStartDate=' + startTime + '&alarmEndDate=' + endDate;
      } else {
        url = 'AlarmManagementService/alarm/events?organizationId=' + organizationId + '&alarmStartDate=' + startTime + '&alarmEndDate=' + endDate + '&targetTimeZone=' + targetTimeZone + '&user-id=' + userId
      }
      // http://10.225.10.24:8182/AlarmManagementService/alarm/419/asset-alarms?targetTimeZone=Asia/Calcutta
      this.widgetService.getApiUrl().subscribe(data => {
        let api = data.api
        url = api + url;
        this.url = url;
        this.getDataByDataServiceUrl(url);
      })

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
    this.getTableResponse(url);

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
        alarm.alarmConditionValue = alarm.alarmConditionValue + ' ' + unit.name;
        alarm.alarmDataValue = alarm.alarmDataValue + ' ' + unit.name;
      }
    })
    return alarm;
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
      // this.masterMapOfAlarmData.set(alarm.alarmEventId, alarm);
    })
    this.totalAlarmData = res;
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

    res.forEach(event => {
      this.totalAlarmData.push(event);
    })
    this.totalAlarmData = this.totalAlarmData.sort((a, b) => b.eventTime - a.eventTime);

  }



  getTableResponse(url) {
    // this.dataSource.data =[];
    if(this.dataSource){
      this.dataSource.data = [];
    }
    this.noRerocrdFound = false;
    let startTime = new Date(this.getCurrentDate() + 'T00:00:00').getTime();
    let endDate = new Date(this.getCurrentDate() + 'T23:59:59').getTime();
    this.widgetService.getDashboardData(url, 'events', this.assetId, startTime, endDate).subscribe(res => {
      if(res){
        let alarmData = res["alarm"];
        this.alarmSeverityMap = res["severitys"];
        this.alarmStateMap = res["states"]
        if (null != alarmData && Array.isArray(alarmData) && alarmData.length !=0) {
          if(this.assetTagIds && this.assetTagIds.length){
            alarmData = alarmData.filter(alarm => this.assetTagIds.includes(alarm.entityId))
          }
          alarmData = this.createDataSourceObject(alarmData);

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
    }, error => {
      this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
    })
  }
  actionChange(element, e) { }
  /*
    Download as Excel, PDF, CSV starts here=================================
  */

  // Getting search filter details
  searchFilterObject = {};
  searchFieldsContainer;
  searchFilterKeysValues
  searchCriteriaText = "Search Criteria";
  exportedFileTitleName = "Events";
  tableBodyDataList;

  xlsxOptions = {
    headers: this.displayTableHeader
  }

  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Events',
    useBom: true,
    noDownload: false,
    headers: this.displayTableHeader
  };

  downloadFile(fileType) {

    // Search filter details
    this.searchFilterKeysValues = Object.entries(this.searchFilterObject);

    this.searchFieldsContainer = {
      "searchFilterKeysValues": this.searchFilterKeysValues,
      "searchCriteriaText": this.searchCriteriaText
    }

    // Make new set of re-create object
    this.tableBodyDataList = this.globalService.reCreateNewObject(this.dataSource.data, this.displayedColumns);

    // S.No.
    this.tableBodyDataList = this.globalService.serialNumberGenerate(this.tableBodyDataList);

    // Make Array object into Arrays
    this.tableBodyDataList = this.tableBodyDataList.map(object => {
      return this.globalService.removeLastIndexAtArray(object);
    });

    // CSV/PDF/Excel file name
    this.fileName = this.globalService.getExportingFileName("Events");

    let exportFile = {
      "fileName": this.fileName,
      "excelWorkSheetName": this.exportedFileTitleName,
      "title": this.exportedFileTitleName,
      "tableHeaderNames": this.xlsxOptions.headers,
      'tableBodyData': this.tableBodyDataList
    }

    // Final download
    this.globalService.downloadFile(fileType, exportFile, this.searchFieldsContainer,
      this.tableBodyDataList, this.fileName, this.csvOptions);
  }

  /*
  Download as Excel, PDF, CSV ends here=================================
  */

  current_page = 1;
  records_per_page = 10;
  totalNumberOfPages = 0;
  prevPage() {
    if (this.current_page > 1) {
      this.current_page--;
      this.changePage(this.current_page);
    }
  }

  nextPage() {
    if (this.current_page < this.numPages()) {
      this.current_page++;
      this.changePage(this.current_page);
    }
  }

  changePage(page) {
    let btn_next = document.getElementById("btn_next");
    let btn_prev = document.getElementById("btn_prev");
    // let listing_table = document.getElementById("listingTable");
    // let page_span = document.getElementById("page");

    // Validate page
    if (page < 1) page = 1;
    if (page > this.numPages()) page = this.numPages();

    // listing_table.innerHTML = "";
    let data = []
    for (let i = (page - 1) * this.records_per_page; i < (page * this.records_per_page); i++) {
      if(i < this.totalAlarmData.length){
        data.push(this.totalAlarmData[i])
      }else{
        break;
      }

    }
    this.dataSource = new MatTableDataSource();
    this.showLoaderImage = false;
    this.dataSource.data = data;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.current_page = page
    // page_span.innerHTML = page;
    this.totalNumberOfPages = this.numPages();
    if (this.totalNumberOfPages == 0) {
      this.current_page = 0
    }
    // if (page == 1) {
    //   btn_prev.style.visibility = "visible";
    // } else {
    //   btn_prev.style.visibility = "visible";
    // }

    // if (page == this.numPages()) {
    //   btn_next.style.visibility = "visible";
    // } else {
    //   btn_next.style.visibility = "visible";
    // }
  }

  numPages() {
    return Math.ceil(this.totalAlarmData.length / this.records_per_page);
  }

  reloadData(){
    this.showLoaderImage = true;
    this.getTableResponse(this.url)
  }
}
