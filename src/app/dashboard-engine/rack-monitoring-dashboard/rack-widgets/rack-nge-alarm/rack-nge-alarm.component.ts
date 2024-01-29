import { Component, OnInit, ViewChild, ElementRef, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';

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
import { ShareddataService } from 'src/app/dashboard-engine/shared/shareddata.service';
import { Router } from '@angular/router';
import { RackTreeViewComponent } from '../rack-tree-view/rack-tree-view.component';

@Component({
  selector: 'rack-nge-alarm',
  templateUrl: './rack-nge-alarm.component.html',
  styleUrls: ['./rack-nge-alarm.component.css']
})
export class RackNgeAlarmComponent implements OnInit {
  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  @ViewChild("treeExpand") treeExpand: RackTreeViewComponent;
  displayedColumns: string[] = ['entityTypeName', 'entityName', 'alarmTypeName', 'conditionValue', 'dateTime', 'dataValue', 'alarmSeverityName', 'alarmStateName', 'eventDateTime', 'edit'];

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
  assetTagIds: any[];
  assets1: any[];
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  // Mat sorting for if use ngIf condition to show table ends here======================

  constructor(private formBuilder: FormBuilder, private widgetService: WidgetService, private sharedDataService: ShareddataService,
    private globalService: globalSharedService, private router: Router, config: NgbTimepickerConfig) {
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
  alarmAssetId;
  @Input() pagination: any
  // public timeInterval: { alarmTimeInterval: number, eventTimeInterval: string} = timeInterval


  ngOnInit() {
    this.assetTagIds = this.widgetService.assetTagIds;
    this.getEnggUnits();
    this.getAlarmSeveritys();
    this.getAlarmStates();
    this.getAlarmTypes();
    this.fontSize = this.FS;
    if (this.origin == "UD") {
      if (typeof this.RI !== 'undefined') {
        // this.inter = setInterval(() => {
        //   this.loadDataOnCall(this.DS)
        // }, +this.RI * 1000);
      }
    }
    this.loadDataOnCall();
    this.userDashboard = false;
    if (this.origin == "UD") {
      this.userDashboard = true;
    }
    this.widgetService.getTimeIntervalsFromFile().toPromise().then(data => {
      let interval = data.mainDashboardRefreshTimeInterval;
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
    this.targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let url
    let organizationId = sessionStorage.getItem('beId');
    let targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let userId = parseInt(sessionStorage.getItem('userId'));
    // AlarmManagementService/organizations/{organization-id}/{alarm-entity-Id}/alarms?target-time-zone=&latest-time=
    if (this.assetId) {
      url = 'AlarmManagementService/organizations/' + organizationId + '/' + this.assetId + '/alarms?target-time-zone=' + this.targetTimeZone
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
  getDataByDataServiceUrl(url: any) {
    this.showLoaderImage = true;
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
    this.getTableResponse(this.url);
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

      if (data.eventTime >= startDateTime && data.eventTime <= endDateTime) {
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
    res.forEach(alarm => {
      let alarmStates = [];
      if (alarm.stateId == 1) {
        alarmStates.push(2)
      } else if (alarm.stateId == 2) {
        alarmStates.push(3)
      }
      alarm.alarmStates = alarmStates;
      alarm = this.setAllInfoToAlarm(alarm);
      if (this.alarmSeverityMap) {
        alarm.colorCode = res['colorCode'];
      }
      this.masterMapOfAlarmData.set(alarm.alarmId, alarm);
    })
    return res
  }

  getTableResponse(url) {
    this.noRerocrdFound = false;
    this.widgetService.getDashboardData(url, 'alarms', this.assetId, null, null).subscribe(res => {
      if (res) {
        let alarmData = [];
        alarmData = res;
        if (null != alarmData && alarmData.length > 0) {
          alarmData = this.createDataSourceObject(alarmData);
          let noClearedAlarms = [];
          alarmData.forEach(r => {
            if ('Cleared' !== r.stateName && 'Disabled' !== r.stateName) {
              noClearedAlarms.push(r);
            }
          })
          alarmData = noClearedAlarms;
          alarmData = alarmData.sort((a, b) => b.eventTime - a.eventTime)
          if (this.assetTagIds && this.assetTagIds.length) {
            alarmData = alarmData.filter(alarm => this.assetTagIds.includes(alarm.entityId))
          }
          this.latestAlarmEventTime = alarmData[0].eventTime;
          this.totalAlarmData = res;
          this.changePage(1);
        } else {
          this.showLoaderImage = false;
          this.noRerocrdFound = true;
        }
      } else {
        this.showLoaderImage = false;
        this.noRerocrdFound = true;
      }

    });
  }

  getAlarmStates() {
    this.widgetService.getAlarmStates().subscribe(res => {
      if (null != res) {
        res = res.sort((a, b) => a.id - b.id);
        res.forEach(state => {
          this.alarmStateMap.set(state.name, state.id)
        })
      }
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
    this.alarmEvent.organizationId = Number(sessionStorage.getItem("beId"));
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

  displayTableHeader = ['Asset', 'Alarm Entity', 'Alarm Type', 'Alarm Condition Value', 'Alarm Time', 'Alarm Value', 'Severity', 'Current State', 'Current State Time'];

  /*
     Download as Excel, PDF, CSV starts here=================================
   */

  // Getting search filter details
  searchFilterObject = {};
  searchFieldsContainer;
  searchFilterKeysValues
  searchCriteriaText = "Search Criteria";
  exportedFileTitleName = "Alarms";
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
    title: 'Alarms',
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
    this.fileName = this.globalService.getExportingFileName("Alarms");

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
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = this.totalAlarmData;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.showLoaderImage = false;
    this.current_page = page;
    this.totalNumberOfPages = this.numPages();
  }

  numPages() {
    return Math.ceil(this.totalAlarmData.length / this.records_per_page);
  }

  reloadData() {
    this.showLoaderImage = true;
    this.dataSource.data = [];
    this.getTableResponse(this.url)
  }
  getDataByDataServiceUrl1(url: string) {
    this.widgetService.getDashboardData(url, "treeHierarchy", null, null, null).subscribe(data => {
      if (data && data.length) {
        this.assets1 = JSON.parse(JSON.stringify(data));
        let asset = this.getAssetData(this.alarmAssetId, this.assets1);
        this.sharedDataService.setRackAsset(asset);
      }
    });
  }

  redirectToRAckMonitoringDashboard(alarm) {
    this.alarmAssetId = alarm['assetId'];
    this.widgetService.setAssetId(this.alarmAssetId);
    /*  let url;
    let organizationId = sessionStorage.getItem('beId');
    this.widgetService.getApiUrl().subscribe(data => {
      let api = data.api;
      url = api + 'AssetManagementService/asset/' + organizationId;
      this.getDataByDataServiceUrl1(url);

    });  */
    this.reloadSamePageData();
  }

  reloadSamePageData() {
    let currentRouter = this.router.url;
    // this.router.navigate([currentRouter])
    if (currentRouter == '/rack-monitoring-dashboard') {
      this.router.navigate([currentRouter])
    }
  }

  getAssetData(id, assets) {
    let assetData;
    for (let asset of assets) {
      if (asset.id == id) {
        assetData = asset;
        break;
      } else {
        if (null != asset.subAssets && asset.subAssets.length != 0) {
          assetData = this.getAssetData(id, asset.subAssets);
          if (assetData) {
            break;
          }
        }
      }
    }
    return assetData;
  }
}
