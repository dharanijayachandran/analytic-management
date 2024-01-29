import { formatDate } from '@angular/common';
import { Component, ElementRef, Injectable, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbDateParserFormatter, NgbDateStruct, NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { ChartComponent } from '@syncfusion/ej2-angular-charts';
import { DropDownTreeComponent } from '@syncfusion/ej2-angular-dropdowns';
import { Browser, setCulture } from '@syncfusion/ej2-base';
import { ChartTheme, ILoadedEventArgs } from '@syncfusion/ej2-charts';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { MatTablePaginatorComponent } from 'src/app/shared/components/mat-table-paginator/mat-table-paginator.component';
import { AssetTag } from 'src/app/shared/model/assetTag';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { Asset, AssetReport } from '../../model/asset';
import { AssetTagDetails } from '../../model/assetTagDetails';
import { AlarmDataService } from '../../services/alarm-data/alarm-data.service';
import { AssetService } from '../../services/asset.service';


@Component({
  selector: 'app-asset-data',
  templateUrl: './asset-data.component.html',
  styleUrls: ['./asset-data.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class AssetDataComponent implements OnInit {

  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

  sort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  validateEndTime: boolean;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }


  assetDataReportForm: FormGroup;
  assertReportForm: AssetReport;
  @ViewChild('chartLine')
  public chart: ChartComponent;
  @ViewChild('defaultCheck')
  public ddTreeObj: DropDownTreeComponent;
  @Input()
  checked: Boolean
  assetList: Asset[];
  assetTagData: any[];
  currentTime: any;
  showListOfReport = false;
  showPaginator = true;
  showLineChart = false;
  config: any;
  itemsPerPage = 100;
  noRerocrdFound = false;
  curDate: string;
  isDisabled: false;
  todayDate: { month: number; day: number; year: number; };
  minDate: { month: number; day: number; year: number; };
  endDate: { month: number; day: number; year: number; };
  validateDate = false;
  requireDate = false;
  validTime = false;
  validateTime = false;
  assetTagList: AssetTag[] = [];
  selectedItems = [];
  settings = {};
  selectedAsset: number;
  selectedAssetName;
  showLoaderImage = false;
  field: Object = {};
  public allowFiltering: boolean = true;
  public filterBarPlaceholder: string = 'Search...';
  assetTagNames = [];
  xyAxisConfiguaration = [];
  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  assetsForSingleSelect: any[] = [];
  assetTags: AssetTag[];
  xAxisLabel: any;
  yAxisLabel: string;
  minRange: any;
  maxRange: any;
  enableViewButton = true;
  assetNameRequired = false;
  columnLengthList = [];
  lengthObj: number;
  inter: NodeJS.Timeout;
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;
  constructor(private formBuilder: FormBuilder, private alarmDataService: AlarmDataService, private assetService: AssetService, config: NgbTimepickerConfig, private globalSharedService: globalSharedService) {
    this.inter = setInterval(() => { this.currentTime = new Date().getHours() + ':' + new Date().getMinutes() }, 1);
    config.spinners = false;
  }
  public text: string;
  public locale: string;
  panelEnable = true;
  ngOnInit() {
    this.locale = this.globalSharedService.getLanguage();
    setCulture(this.locale);
    this.loadForm();
    this.dataSource = new MatTableDataSource();
    this.selectedItems = [];
    this.loadMultiSelectDroupDownProperties();
    this.getAssetList();
  }

  ngOnDestroy() {
    clearInterval(this.inter);
  }

  // This method is used to refresh the table data.
  refreshTableListFunction() {
    this.showListOfReport = false;
    this.showLineChart = false;
    this.getAssetDataByAssetId();
  }

  loadForm() {
    this.assetDataReportForm = this.formBuilder.group({
      assetId: [null],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      startTime: [''],
      endTime: [''],
      assetTagIds: [[]],
      showTableData: true,
      showLineChats: true
    });

    this.assetDataReportForm.controls['endDate'].valueChanges.subscribe(data => {
      if (!data || (typeof data === 'string' && data.length == 0)) {
        this.assetDataReportForm.patchValue({
          endDate: null
        }, { emitEvent: false });
      }
    });
    this.assetDataReportForm.controls['startDate'].valueChanges.subscribe(data => {
      if (!data || (typeof data === 'string' && data.length == 0)) {
        this.assetDataReportForm.patchValue({
          startDate: null
        }, { emitEvent: false });
      } else {
      }
    });
    this.patchDates();
    this.futureDateDisabled();
  }

  loadMultiSelectDroupDownProperties() {
    this.settings = {
      enableSearchFilter: true,
      text: $localize`:@@multiSelectDropdown.select:--Select--`,
      noDataLabel: $localize`:@@multiSelectDropdown.noDataLabel:No Data Available`,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "myclass custom-class",
      badgeShowLimit: 2,
    };
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
  }
  endTime: any = new FormControl('endTime', (control: FormControl) => {
    const value = control.value;
    if (!value) {
      return { required: true };
    }
    return null;
  });
  startTime: any = new FormControl('startTime', (control: FormControl) => {
    const value = control.value;
    if (!value) {
      return { required: true };
    }
    return null;
  });


  patchDates() {
    this.showListOfReport = false;
    let endDate = new Date();
    let startDate = formatDate(endDate, 'MM/dd/yyyy', 'en');
    let arrayDate = startDate.split('/');
    let fullDate = {
      month: parseInt(arrayDate[0]),
      day: parseInt(arrayDate[1]),
      year: parseInt(arrayDate[2])
    }
    this.assetDataReportForm.patchValue({
      startDate: fullDate,
      endDate: fullDate,
    })
  }
  getAssetByOrganizationId() {
    let organizationId = sessionStorage.getItem('beId');
    this.assetService.getAssetByOrganizationId(organizationId).subscribe(
      res => {
        let getDataSource = res;
        if (Array.isArray(res) && res.length) {
          getDataSource = getDataSource.sort((a, b) => b.id - a.id);
          this.assetList = getDataSource;
        } else {
          this.assetList = res;
        }
      },
      error => {
        this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
      });
  }

  getAssetList() {
    let beId = this.parseInt(sessionStorage.getItem("beId"));
    this.alarmDataService.getAssetList(beId).subscribe(data => {

      this.assetList = data;
      this.assetList = this.assetList.sort((a, b) => a.name.localeCompare(b.name))
      data.forEach(asset => {
        if (null != asset.subAssets && asset.subAssets.length != 0) {
          asset.hasChild = true;
          this.iterateTheSubList(asset.subAssets)
        }
      })
      this.assetsForSingleSelect = this.getFormattedAssetList(data);
      this.field = this.formatedResponse(this.assetsForSingleSelect);
    },
      error => {
        this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
      })
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

  getFormattedAssetList(list) {
    const that = this;
    return list.map(function (l) {
      return {
        id: l.id,
        name: l.name,
        child: that.assetIterate(l.subAssets),
      };
    });
  }
  assetIterate(assets) {
    const that = this;
    return assets && assets.length ? assets.map(function (o) {
      var returnObj = {
        "id": o.id,
        "name": o.name,
        "refAssetId": o.refAssetId,
        "child": that.assetIterate(o.subAssets),
      }
      if (o.refAssetId) {
        returnObj["refAssetId"] = o.refAssetId;
      }
      return returnObj;
    }) : [];
  }

  formatedResponse(response) {
    return this.field = {
      dataSource: response,
      value: 'id',
      parentValue: 'refAssetId',
      text: 'name',
      child: 'child',
    };

  }
  assetName($event) {
    this.onClickOfFilterFields();
    this.selectedAsset = $event.itemData.id;
    this.selectedAssetName = $event.itemData.text;
    this.assetTagData = [];
    this.assetDataReportForm.get('assetTagIds').setValue([]);
    this.getAssetTagsByAssetId(this.selectedAsset)
    this.selectedItems = [];
  }

  onClickOfFilterFields() {
    if (this.ddTreeObj.value && this.ddTreeObj.value.length != 0) {
      this.assetNameRequired = false;
      this.enableViewButton = false;
    } else {
      this.assetTagList = []
      this.enableViewButton = true;
      this.assetNameRequired = true;
      if (this.ddTreeObj.value) {
        this.ddTreeObj.value.length = 0;
      }
      this.assetTagData = [];
      this.assetDataReportForm.get('assetTagIds').setValue([]);
    }
  }
  getAssetTagsByAssetId(assetId: number) {
    this.assetService.getAssetByAssetId(assetId).subscribe(
      res => {
        this.assetTags = res;
        res = res.sort((a, b) => a.name.localeCompare(b.name));
        this.assetTagList = this.requiredFormat(res);
      },
      error => {

      });
  }
  requiredFormat(assetTags) {
    const that = this;
    return assetTags && assetTags.length ? assetTags.map(function (o) {
      var returnObj = {
        "id": o.id,
        "itemName": o.name
      }
      return returnObj;
    }) : [];
  }

  // Getting search filter details
  searchFilterObject = {};

  getAssetDataByAssetId() {
    let assetTagDetals = new AssetTagDetails();
    this.panelEnable = true;
    this.showListOfReport = false;
    this.showLineChart = false;
    this.showLoaderImage = true;
    this.noRerocrdFound = false;
    this.assertReportForm = <AssetReport>this.assetDataReportForm.value;
    let startDate = this.fetchStartDateFromPickerForApiCall();
    let startTime = this.formatStartTime(this.assertReportForm.startTime);
    let endDate = this.fetchEndDateFromPickerForApiCall();
    let endTime = this.formatEndTime(this.assertReportForm.endTime, endDate);
    startDate = startDate + 'T' + startTime;
    endDate = endDate + 'T' + endTime;
    let assetId = this.parseInt(this.selectedAsset);
    let targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let assetTagObjects = this.formatAssetTagObjects();
    // Format CSV/PDF/Excel title
    this.searchFilterObject['Asset Name'] = this.selectedAssetName;
    this.searchFilterObject['Start Date'] = this.globalSharedService.startDateEndDateTimeSplit(startDate);
    this.searchFilterObject['End Date'] = this.globalSharedService.startDateEndDateTimeSplit(endDate);
    this.csvOptions.title = this.globalSharedService.formateCSVTitle(this.searchFilterObject, "Asset Data Report");
    assetTagDetals.assetId = assetId;
    assetTagDetals.startDate = startDate;
    assetTagDetals.endDate = endDate;
    assetTagDetals.targetTimeZone = targetTimeZone;
    assetTagDetals.assetTags = assetTagObjects;
    this.assetService.getAssetDataByAssetTaglist(assetTagDetals).subscribe(res => {
      this.assetTagData = res[res.length - 1];
      this.dataSource.data = this.assetTagData;
      // To get paginator events from child mat-table-paginator to access its properties
      this.myPaginator = this.myPaginatorChildComponent.getDatasource();
      this.matTablePaginator(this.myPaginator);
      this.dataSource.paginator = this.myPaginator;
      //this.dataSource.sort = this.sort;
      if (this.assetTagData.length != 0) {
        this.setColumn(this.assetTagData);
        this.panelEnable = false;
      }
      this.getAssetDataByAssetTagIds(res)
      if (null != this.assetTagData && this.assetTagData.length != 0) {
        this.showLoaderImage = false;
        if (this.assetDataReportForm.get("showTableData").value == false) {
          this.showListOfReport = false;
        }
        else {
          this.showListOfReport = true;
        }
        this.csvOptions.headers = [];
        this.xlsxOptions.headers = [];
        for (let key in this.assetTagData[0]) {
          this.csvOptions.headers.push(key);
          this.xlsxOptions.headers.push(key);
        }

      } else {
        this.showLoaderImage = false;
        this.noRerocrdFound = true;
      }
    },
      error => {
        this.modelNotification.alertMessage(this.globalSharedService.messageType_Fail, error);
      });
  }
  setColumn(res: any[]) {
    let keys = Object.keys(res[0]);
    this.displayedColumns = keys;

  }
  formatStartTime(startTime) {
    if (startTime == null) {
      this.validTime = true;
      return null;
    }
    if (startTime === 'startTime') {
      return startTime = ''
    }
    if (startTime.length == 0) {
      return startTime = '00:00:00'
    } else {
      return startTime = startTime + ':00';
    }
  }

  formatEndTime(endTime, endDate) {
    if (endTime === 'endTime') {
      return endTime = '';
    }
    if (endTime == null) {
      this.validTime = true;
      return null;
    }
    if (endTime.length == 0) {
      this.validTime = false;
      let endDateTdy = new Date();
      var year = endDateTdy.getFullYear();
      var month = endDateTdy.getMonth() + 1;
      let mth, d, totaldate;
      if (month <= 9) {
        mth = '0' + month;
      } else {
        mth = month
      }
      var day = endDateTdy.getDate();
      if (day <= 9) {
        d = '0' + day;
      } else {
        d = day;
      }
      totaldate = year + '-' + mth + '-' + d
      if (endDate !== totaldate) {
        return endTime = '23:59:59';
      } else {
        var hours = endDateTdy.getHours();
        let hr;
        var minutes = endDateTdy.getMinutes();
        let min;
        if (hours <= 9) {
          hr = '0' + hours;
        } else {
          hr = hours
        }
        if (minutes <= 9) {
          min = '0' + minutes;
        } else {
          min = minutes;
        }
        let currentTime = hr + ":" + min + ':59';
        return endTime = currentTime
      }
    } else {
      return endTime = endTime + ':00'
    }
  }
  formatAssetTagObjects() {
    let assetTagObjects = [];
    if (this.selectedItems != null && this.selectedItems.length != 0) {
      if (this.assetTags != null && this.assetTags.length != 0) {
        this.assetTags.forEach(e => {
          this.selectedItems.forEach(element => {
            if (e.id == element.id) {
              let Obj = {
                "id": e.id,
                "dataTypeId": e.dataTypeId,
                "tagType": e.tagType,
                "name": e.name,
                "displayOrder": e.displayOrder
              }
              assetTagObjects.push(Obj);
            }
          });
        });
      }
    }
    else {
      if (this.assetTags != null && this.assetTags.length != 0) {
        this.assetTags.forEach(e => {
          let Obj = {
            "id": e.id,
            "dataTypeId": e.dataTypeId,
            "tagType": e.tagType,
            "name": e.name,
            "displayOrder": e.displayOrder
          }
          assetTagObjects.push(Obj);
        });
      }
    }
    return assetTagObjects;
  }

  parseInt(id) {
    if (isNaN(id)) {
      return id;
    }
    return parseInt(id);
  }

  pageChanged(event) {
    if (isNaN(event)) {
      this.config.itemsPerPage = event.target.value
      this.itemsPerPage = event.target.value
    } else this.config.currentPage = event;
  }

  resetForm() {
    this.loadForm();
    this.panelEnable = true;
    this.ddTreeObj.value.length = 0
    this.assetTagList = [];
    this.assetTagData = [];
    this.data = [];
    this.noRerocrdFound = false;
    this.enableViewButton = true;
    this.assetNameRequired = true;
    this.showLineChart = false;
    this.validateTime = false;
    this.validateEndTime = false;

  }
  focusOutFunction() {

    this.onClickOfFilterFields();
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
    if (null != this.assetDataReportForm.value.startDate) {
      let newDay = this.assetDataReportForm.value.startDate.day;
      if (newDay <= 9) {
        newDay = '0' + newDay;
      }
      let newMon = this.assetDataReportForm.value.startDate.month;
      if (newMon <= 9) {
        newMon = '0' + newMon;
      }
      let newYrs = this.assetDataReportForm.value.startDate.year;
      let reqDate = newYrs + '-' + newMon + '-' + newDay;
      return reqDate;
    }
  }

  fetchStartDateFromPicker() {
    if (null != this.assetDataReportForm.value.startDate) {
      let newYrs = this.assetDataReportForm.value.startDate.year;
      let newDay = this.assetDataReportForm.value.startDate.day;
      if (newDay <= 9) {
        newDay = '0' + newDay;
      }
      let newMon = this.assetDataReportForm.value.startDate.month;
      if (newMon <= 9) {
        newMon = '0' + newMon;
      }
      let reqDate = newMon + '/' + newDay + '/' + newYrs;
      return reqDate;
    }
  }

  fetchEndDateFromPickerForApiCall() {
    if (null != this.assetDataReportForm.value.endDate) {
      let newDay = this.assetDataReportForm.value.endDate.day;
      if (newDay <= 9) {
        newDay = '0' + newDay;
      }
      let newMon = this.assetDataReportForm.value.endDate.month;
      if (newMon <= 9) {
        newMon = '0' + newMon;
      }
      let newYrs = this.assetDataReportForm.value.endDate.year;
      let reqDate = newYrs + '-' + newMon + '-' + newDay;
      return reqDate;
    }
  }

  fetchEndDateFromPicker() {
    if (null != this.assetDataReportForm.value.endDate) {
      let newDay = this.assetDataReportForm.value.endDate.day;
      if (newDay <= 9) {
        newDay = '0' + newDay;
      }
      let newMon = this.assetDataReportForm.value.endDate.month;
      if (newMon <= 9) {
        newMon = '0' + newMon;
      }
      let newYrs = this.assetDataReportForm.value.endDate.year;
      let reqDate = newMon + '/' + newDay + '/' + newYrs;
      return reqDate;
    }
  }

  validateFromDate() {
    let startDay = this.assetDataReportForm.value.startDate.day;
    let endDay = this.assetDataReportForm.value.endDate.day;
    if (startDay > endDay) {
      this.assetDataReportForm.patchValue({
        startDate: this.fetchStartDateFromPicker()
      }, { emitEvent: false });
    }
    let endMonth = this.assetDataReportForm.value.endDate.month;
    let startMonth = this.assetDataReportForm.value.startDate.month;
    if (endMonth > startMonth) {
      this.assetDataReportForm.patchValue({
        startDate: this.fetchStartDateFromPicker()
      }, { emitEvent: false });
    }
  }

  validateFromStartFromEndDate() {
    let date = this.fetchEndDateFromPicker()
    if (null != date) {
      let fullDate = date.split('/');
      this.endDate =
      {
        month: parseInt(fullDate[0]),
        day: parseInt(fullDate[1]),
        year: parseInt(fullDate[2]),
      }
      this.addMinDateValue();
    }
  }
  changeStartDate(event: any) {
    this.validateStartAndEndTime('startTime');
  }
  changeEndDate(event: any) {
    this.validateStartAndEndTime('endTime');
  }
  resetTimeValidationControlls() {
    this.validateTime = false;
    this.validateEndTime = false;

    this.assetDataReportForm.controls['startTime'].markAsUntouched()
    this.assetDataReportForm.controls['startTime'].markAsPristine()
    this.assetDataReportForm.controls['startTime'].updateValueAndValidity();
    this.assetDataReportForm.controls['endTime'].markAsUntouched()
    this.assetDataReportForm.controls['endTime'].markAsPristine()
    this.assetDataReportForm.controls['endTime'].updateValueAndValidity();
  }

  validateStartAndEndTime(id: any) {
    this.resetTimeValidationControlls()
    let startDate = this.fetchStartDateFromPicker()
    let endDate = this.fetchEndDateFromPicker()
    if (startDate === endDate) {
      this.assertReportForm = <AssetReport>this.assetDataReportForm.value
      let startTime = this.assertReportForm.startTime
      let endTimeTime = this.assertReportForm.endTime
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
      if (id == 'startTime') {
        if (strtHr >= endHr) {
          if (strtMin >= endMin) {
            this.validateTime = true
            this.assetDataReportForm.controls['startTime'].markAsTouched();
            this.assetDataReportForm.controls['startTime'].updateValueAndValidity();
            this.assetDataReportForm.controls['startTime'].setErrors({
              'required': true
            })
          } if (strtHr > endHr) {
            this.validateTime = true
            this.assetDataReportForm.controls['startTime'].markAsTouched();
            this.assetDataReportForm.controls['startTime'].updateValueAndValidity();
            this.assetDataReportForm.controls['startTime'].setErrors({
              'required': true
            })
          }
          // this.assetDataReportForm.setErrors({ 'invalid': true });
          // this.assetDataReportForm.controls['startTime'].setValidators([Validators.required]);

        }
      }
      else if (id == 'endTime') {
        if (strtHr >= endHr) {
          if (strtMin >= endMin) {
            this.validateEndTime = true
            this.assetDataReportForm.controls['endTime'].markAsTouched();
            this.assetDataReportForm.controls['endTime'].updateValueAndValidity();
            this.assetDataReportForm.controls['endTime'].setErrors({
              'required': true
            })
          } if (strtHr > endHr) {
            this.validateEndTime = true
            this.assetDataReportForm.controls['endTime'].markAsTouched();
            this.assetDataReportForm.controls['endTime'].updateValueAndValidity();
            this.assetDataReportForm.controls['endTime'].setErrors({
              'required': true
            })
          }
          //this.assetDataReportForm.setErrors({ 'invalid': true });

        }

      }

    }


  }
  onItemSelect(item: any) {
    this.selectedItems.push(item);
  }
  OnItemDeSelect(item: any) {
    this.selectedItems = this.selectedItems.filter(obj => obj !== item);
  }
  onSelectAll(items: any) {
    this.selectedItems = items;
  }
  onDeSelectAll() {
    this.selectedItems = [];
  }

  dtCSVData: any;


  /*
  Download as Excel, PDF, CSV starts here=================================
  */


  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: '',
    useBom: true,
    noDownload: false,
    headers: []
  };

  xlsxOptions = {
    headers: []
  }


  searchFieldsContainer;
  searchFilterKeysValues;
  searchCriteriaText = "Search Criteria";
  exportedFileTitleName = "Asset Data Report";
  tableBodyDataList;
  fileName;

  downloadFile(fileType) {
    // Search filter details
    this.searchFilterKeysValues = Object.entries(this.searchFilterObject);
    this.searchFieldsContainer = {
      "searchFilterKeysValues": this.searchFilterKeysValues,
      "searchCriteriaText": this.searchCriteriaText
    };

    // Make Array object into Arrays
    this.tableBodyDataList = this.assetTagData.map(object => Object.values(object));

    // CSV/PDF/Excel file name
    this.fileName = this.globalSharedService.getExportingFileName("AssetDataReport");

    let exportFile = {
      "fileName": this.fileName,
      "excelWorkSheetName": this.exportedFileTitleName,
      "title": this.exportedFileTitleName,
      "tableHeaderNames": this.xlsxOptions.headers,
      'tableBodyData': this.tableBodyDataList
    }

    // Final download
    this.globalSharedService.downloadFile(fileType, exportFile, this.searchFieldsContainer,
      this.tableBodyDataList, this.fileName, this.csvOptions);

  }

  /*
  Download as Excel, PDF, CSV ends here=================================
  */



  /* Line chart code starts here */

  getAssetDataByAssetTagIds(res) {
    this.lengthObj = 0;
    this.data = [];
    this.columnLengthList = []
    let listOfAssetTags = []
    this.lengthObj = res.length - 1;
    if (this.assetDataReportForm.get("showLineChats").value == false) {
      this.showLineChart = false;
    }
    else {
      this.showLineChart = true;
    }
    for (let i = 0; i < res.length - 1; i++) {
      listOfAssetTags.push(res[i])
    }
    this.convertAssetDataToDataSet(listOfAssetTags);
  }

  public data: Object[] = [
  ];
  public zoomSettings: Object = {
  };;

  //Initializing Primary X Axis
  public primaryXAxis: Object = {
  };
  //Initializing Primary Y Axis
  public primaryYAxis: Object = {
  };
  public animation: Object = { enable: false };
  public chartArea: Object = {
    border: {
      width: 0
    }
  };
  public width: string = Browser.isDevice ? '100%' : '100%';
  public marker: Object;
  public tooltip: Object = {
    enable: true
  };
  legend: boolean;
  title: string;
  enableAutoIntervalOnZooming: true
  // custom code start
  public load(args: ILoadedEventArgs): void {
    let selectedTheme: string = location.hash.split('/')[1];
    selectedTheme = selectedTheme ? selectedTheme : 'Material';
    args.chart.theme = <ChartTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, "Dark");
  };

  convertAssetDataToDataSet(dataSource: any[]) {
    this.assetTagNames = []
    this.xyAxisConfiguaration = [];
    dataSource.forEach(element => {
      let series = [];
      let keys = Object.keys(element[0]);
      let value = keys[1];
      this.assetTagNames.push(value);
      this.intializeLineChart(keys);
      element.forEach(e => {
        let newObject = {};
        let xV = 0;
        let yV = 0;
        let time = e.Time;
        let FinalDate = new Date(time).getTime();
        xV = Number(FinalDate);

        yV = Number(e[value]);

        if (!Number.isNaN(xV) && !Number.isNaN(yV)) {
          newObject = { x: xV, y: yV }
        }
        series.push(newObject)
      });
      this.data.push(series);
    });
  }


  intializeLineChart(keys) {
    let newObject = {};
    this.zoomSettings = {
      mode: 'X',
      enableDeferredZooming: true,
      enablePinchZooming: true,
      enableSelectionZooming: true,
      enableScrollbar: true,
    };
    this.primaryXAxis = {
      title: keys[0],
      valueType: 'DateTime',
      skeleton: 'hm',
      labelFormat: 'yy-M-d H:mm:ss',
      labelIntersectAction: 'Hide',
      edgeLabelPlacement: 'Shift',
      majorGridLines: { width: 0 }
    };
    this.primaryYAxis = {
      title: keys[1],
      valueType: 'Double',
      labelFormat: "n2",
      rangePadding: 'None',
      lineStyle: { width: 1 },
      majorTickLines: { width: 0 }
    };
    this.marker = {
      visible: true, width: 5, height: 5, fill: '#17a2b8', shape: 'Circle'
    };

    newObject = { zoomSettings: this.zoomSettings, primaryXAxis: this.primaryXAxis, primaryYAxis: this.primaryYAxis };
    this.xyAxisConfiguaration.push(newObject);
  }

  onChangeTableData(ob: MatSlideToggleChange) {
    if (ob.checked) {
      if (this.assetTagData != undefined && this.assetTagData.length != 0) {
        this.showPaginator = true;
        this.showListOfReport = true;
      }
      else {
        this.showPaginator = false;
        this.showListOfReport = false;
      }
    }
    else {
      this.showPaginator = false;
      this.showListOfReport = false;
      if (!this.assetDataReportForm.get("showLineChats").value) {
        this.assetDataReportForm.get("showLineChats").setValue(true);
        this.showLineChart = true;
      }

    }
  }

  onChangeLineChart(ob: MatSlideToggleChange) {
    if (ob.checked) {
      if (this.data != undefined && this.data.length != 0) {
        this.showLineChart = true;
      }
      else {
        this.showLineChart = false;
      }
    }
    else {
      this.showLineChart = false;
      if (!this.assetDataReportForm.get("showTableData").value) {
        this.assetDataReportForm.get("showTableData").setValue(true);
        this.showListOfReport = true;
        this.showPaginator = true;
      }
    }
  }
  removeLineChart(id) {

    var myobj = document.getElementById(id);
    myobj.remove();
  }

  /* Line chart code ends here  */

  /*
   Material table paginator code starts here
 */
  myPaginator;
  pageIndex: number;
  pageSize: number;
  length: number;

  /*
      Material pagination getting pageIndex, pageSize, length through
      events(On change page, Next,Prev, Last, first) */
  matTablePaginator(myPaginator) {
    this.pageIndex = myPaginator.pageIndex;
    this.pageSize = myPaginator.pageSize;
    this.length = myPaginator.length;
  }


  /* Load table data always to the Top of the table
  when change paginator page(Next, Prev, Last, First), Page size  */
  onPaginateViewScrollToTop() {
    this.directiveRef.scrollToTop();
    this.directiveRef.update();
  }

  /*
    Material table paginator code ends here
  */

}

@Injectable()
export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct {
    let result: NgbDateStruct = null;
    if (value) {
      let date = value.split("/");
      result = {
        month: parseInt(date[0], 10),
        day: parseInt(date[1], 10),
        year: parseInt(date[2], 10)
      };
    }
    return result;
  }

  format(date: NgbDateStruct): string {
    let result: string = null;
    if (date) {
      result = date.month + "/" + date.day + "/" + date.year;
    }
    return result;

  }


}
