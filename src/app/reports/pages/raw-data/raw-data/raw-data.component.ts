import { formatDate } from '@angular/common';
import { Component, ElementRef, Injectable, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { EmitType } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { MatTablePaginatorComponent } from 'src/app/shared/components/mat-table-paginator/mat-table-paginator.component';
import { gatewayList } from 'src/app/shared/model/gatewayList';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { RawDataReport } from '../../../model/framedDataPacket';
import { RawDataService } from '../../../services/raw-data/raw-data.service';

@Component({
  selector: 'app-raw-data',
  templateUrl: './raw-data.component.html',
  styleUrls: ['./raw-data.component.css']
})
export class RawDataComponent implements OnInit, OnDestroy {

  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

  @ViewChild('exporter', { static: false }) exporter;

  selectedGateway;
  currentTime: string;
  rawDataReportForm: FormGroup;
  gatewayId: any;
  @ViewChild(UIModalNotificationPage) modelNotification;
  gatewayList: gatewayList[] = [];
  rawData: RawDataReport;
  config: any;
  noRerocrdFound = false;
  curDate: string;
  isDisabled;
  todayDate: { month: number; day: number; year: number; };
  minDate: { month: number; day: number; year: number; };
  endDate: { month: number; day: number; year: number; };

  validateTime = false;
  validTime: boolean;
  dataSource: MatTableDataSource<unknown>;
  displayedColumns: string[] = ['dataServerTime', 'receivedTimestamp', 'message'];
  displayTableHeader = ['Date/Time', 'Data Source Date/Time', 'Data Packet']
  sort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  validateEndTime: boolean;
  formattedRawDataListDropdown: any;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  endTime: any;
  startTime: any;
  fileName: string;
  showLoaderImage: boolean;
  inter: NodeJS.Timeout;
  dataServerTime: any;


  public gatewayFields: Object = {
    text: 'name',
    value: 'id'
  };

 // filtering event handler to filter a Menu Icon Name
  //pass the filter data source, filter query to updateData method.
  public onFilteringGateway: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e,this.gatewayList);
  }
  filterData(e: FilteringEventArgs, filterData) {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.where('name', 'contains', e.text, true) : query;
    e.updateData(filterData, query);
  }

  public sortDropDown:string ='Ascending';

  // set the placeholder to DropDownList input element

  public gatewayWaterMark: string = 'Select Gateway';
  public filterPlaceholder:string='Search';
 // set the height of the popup element
 public height: string = '220px';
 public locale: string;

  constructor(private formBuilder: FormBuilder, private rawDataService: RawDataService,
    private globalService: globalSharedService,
    private router: Router,
    private route: ActivatedRoute) {
    this.inter = setInterval(() => { this.currentTime = new Date().getHours() + ':' + new Date().getMinutes() }, 1);
  }

  targetZoneName: string;
  ngOnInit() {
    this.getRawDataListGatewayByOrganizationId();
    this.gatewayWaterMark = this.globalService.name;
    this.dataSource = new MatTableDataSource();
    this.targetZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.gatewayId = this.globalService.selectedId;
    this.selectedGateway=this.globalService.name;
    this.dataServerTime = this.globalService.dataServerTime;
    this.loadForm();
    this.fileName = this.globalService.getExportingFileName("RawDataReport");
  }

  getRawDataListGatewayByOrganizationId(){
    let beId = sessionStorage.getItem("beId");
    this.rawDataService.getRawDataListGatewayByOrganizationId(beId).subscribe(res=> {
      this.formattedRawDataListDropdown = res;
      this.getGatewaysbyOrganizationId(this.formattedRawDataListDropdown);
    },
    error => {
      this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      this.showLoaderImage = false;
    });
  }

  ngOnDestroy() {
    clearInterval(this.inter);
  }

  // Refresh table
  refreshTableListFunction() {
    this.loadForm();
  }

  getGatewaysbyOrganizationId(res) {
    this.gatewayList = this.getFormattedRawDataList(res);
  }
  getFormattedRawDataList(data){
    if (data != null) {
      return data.map(function (l) {
        return {
          name: l.name,
          id: l.id,
        };
      });
    }
  }
  loadForm() {
    this.rawDataReportForm = this.formBuilder.group({
      gatewayId: [null],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      startTime: [''],
      endTime: ['']
    });
    this.rawDataReportForm.controls['endDate'].valueChanges.subscribe(data => {
      if (!data || (typeof data === 'string' && data.length == 0)) {
        this.rawDataReportForm.patchValue({
          endDate: null
        }, { emitEvent: false });
      }
    });

    this.rawDataReportForm.controls['startDate'].valueChanges.subscribe(data => {
      if (!data || (typeof data === 'string' && data.length == 0)) {
        this.rawDataReportForm.patchValue({
          startDate: null
        }, { emitEvent: false });
      }
    });
    this.patchDates();
    this.futureDateDisabled();
  }

  patchDates() {
    let startDate = formatDate(this.dataServerTime, 'MM/dd/yyyy', 'en');
    let startDateArray = startDate.split('/');
    let formatedStartDate = {
      month: parseInt(startDateArray[0]),
      day: parseInt(startDateArray[1]),
      year: parseInt(startDateArray[2])
    }
    let endDate = formatDate(new Date(), 'MM/dd/yyyy', 'en');
    let endDateArray = endDate.split('/');
    let formatedEndDate = {
      month: parseInt(endDateArray[0]),
      day: parseInt(endDateArray[1]),
      year: parseInt(endDateArray[2])
    }
    this.rawDataReportForm.patchValue({
      gatewayId: this.gatewayId,
      startDate: formatedStartDate,
      endDate: formatedEndDate,
    })
    this.getRawDataByGatewayId();
  }

  // cancel rorm
  cancel(event) {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  getRawDataByGatewayId() {
    this.dataSource.data = [];
    this.showLoaderImage = true;
    this.rawData = <RawDataReport>this.rawDataReportForm.value;
    this.gatewayId = this.rawData.gatewayId;
    let startDate = this.fetchStartDateFromPickerForApiCall();
    let startTime = this.rawData.startTime
    if (startTime == null) {
      this.validTime = true;
      return null;
    }
    if (startTime === 'startTime') {
      startTime = ''
    }
    if (startTime.length == 0) {
      startTime = '00:00:00'
    } else {
      startTime = startTime + ':00';
    }
    let endDate = this.fetchEndDateFromPickerForApiCall();
    let endTime = this.rawData.endTime
    if (endTime === 'endTime') {
      endTime = '';
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
        endTime = '23:59:59';
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
        endTime = currentTime
      }
    } else {
      endTime = endTime + ':00'
    }
    startDate = startDate + 'T' + startTime;
    endDate = endDate + 'T' + endTime;
     if (this.gatewayList) {
      this.gatewayList.forEach((e) => {
        if (e.id == this.rawDataReportForm.value.gatewayId) {
          this.selectedGateway = e.name;
        }
      });
    }
    // Format CSV title
    this.searchFilterObject['Gateway'] = this.selectedGateway ? this.selectedGateway : "";
    this.searchFilterObject['Start Date/Time'] = this.globalService.startDateEndDateTimeSplit(startDate);
    this.searchFilterObject['End Date/Time'] = this.globalService.startDateEndDateTimeSplit(endDate);
    this.csvOptions.title = this.globalService.formateCSVTitle(this.searchFilterObject, "Raw Data Report");
    let gatewayId = Number(this.rawData.gatewayId);
    this.rawDataService.getRawDataByGatewayId(gatewayId, startDate, endDate, this.targetZoneName).subscribe(res => {
      if (res != null && (Array.isArray(res) && res.length)) {
        this.showLoaderImage = false;
        this.dataSource.data = res;

        // To get paginator events from child mat-table-paginator to access its properties
        this.myPaginator = this.myPaginatorChildComponent.getDatasource();
        this.matTablePaginator(this.myPaginator);

        this.dataSource.paginator = this.myPaginator;
        this.dataSource.sort = this.sort;
      } else {
        res = [];
        this.dataSource = new MatTableDataSource();
        this.dataSource.data = res;
        this.showLoaderImage = false;
      }
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        this.showLoaderImage = false;
      });
  }

  searchButton() {
    let x = document.getElementById("filter");
    if (x.style.display === "none") {
      x.style.display = "inline-block";
    } else {
      x.style.display = "none";
    }
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  parseInt(id) {
    if (isNaN(id)) {
      return id;
    }
    return parseInt(id);
  }
  resetForm() {
    this.loadForm();
    this.validateTime = false;
    this.validateEndTime = false;
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
    this.minDate = this.rawDataReportForm.value.startDate;
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
    if (null != this.rawDataReportForm.value.startDate) {
      let newDay = this.rawDataReportForm.value.startDate.day;
      if (newDay <= 9) {
        newDay = '0' + newDay;
      }
      let newMon = this.rawDataReportForm.value.startDate.month;
      if (newMon <= 9) {
        newMon = '0' + newMon;
      }
      let newYrs = this.rawDataReportForm.value.startDate.year;
      let reqDateOfBirth = newYrs + '-' + newMon + '-' + newDay;
      return reqDateOfBirth;
    }
  }

  fetchStartDateFromPicker() {
    if (null != this.rawDataReportForm.value.startDate) {
      let newYrs = this.rawDataReportForm.value.startDate.year;
      let newDay = this.rawDataReportForm.value.startDate.day;
      if (newDay <= 9) {
        newDay = '0' + newDay;
      }
      let newMon = this.rawDataReportForm.value.startDate.month;
      if (newMon <= 9) {
        newMon = '0' + newMon;
      }
      let reqDateOfBirth = newMon + '/' + newDay + '/' + newYrs;
      return reqDateOfBirth;
    }
  }

  fetchEndDateFromPickerForApiCall() {
    if (null != this.rawDataReportForm.value.endDate) {
      let newDay = this.rawDataReportForm.value.endDate.day;
      if (newDay <= 9) {
        newDay = '0' + newDay;
      }
      let newMon = this.rawDataReportForm.value.endDate.month;
      if (newMon <= 9) {
        newMon = '0' + newMon;
      }
      let newYrs = this.rawDataReportForm.value.endDate.year;
      let reqDateOfBirth = newYrs + '-' + newMon + '-' + newDay;
      return reqDateOfBirth;
    }
  }

  fetchEndDateFromPicker() {
    if (null != this.rawDataReportForm.value.endDate) {
      let newDay = this.rawDataReportForm.value.endDate.day;
      if (newDay <= 9) {
        newDay = '0' + newDay;
      }
      let newMon = this.rawDataReportForm.value.endDate.month;
      if (newMon <= 9) {
        newMon = '0' + newMon;
      }
      let newYrs = this.rawDataReportForm.value.endDate.year;
      let reqDateOfBirth = newMon + '/' + newDay + '/' + newYrs;
      return reqDateOfBirth;
    }
  }

  validateFromDate() {
    let startDay = this.rawDataReportForm.value.startDate.day;
    let endDay = this.rawDataReportForm.value.endDate.day;
    if (startDay > endDay) {
      this.rawDataReportForm.patchValue({
        startDate: this.fetchStartDateFromPicker()
      }, { emitEvent: false });
    }
    let endMonth = this.rawDataReportForm.value.endDate.month;
    let startMonth = this.rawDataReportForm.value.startDate.month;
    if (endMonth > startMonth) {
      this.rawDataReportForm.patchValue({
        startDate: this.fetchStartDateFromPicker()
      }, { emitEvent: false });
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

  changeStartDate(event: any) {
    this.validateStartAndEndTime('startTime');
  }
  changeEndDate(event: any) {
    this.validateStartAndEndTime('endTime');
  }
  resetTimeValidationControlls() {
    this.validateTime = false;
    this.validateEndTime = false;

    this.rawDataReportForm.controls['startTime'].markAsUntouched()
    this.rawDataReportForm.controls['startTime'].markAsPristine()
    this.rawDataReportForm.controls['startTime'].updateValueAndValidity();
    this.rawDataReportForm.controls['endTime'].markAsUntouched()
    this.rawDataReportForm.controls['endTime'].markAsPristine()
    this.rawDataReportForm.controls['endTime'].updateValueAndValidity();
  }

  validateStartAndEndTime(id:any) {
    this.resetTimeValidationControlls()
      let startDate = this.fetchStartDateFromPicker()
      let endDate = this.fetchEndDateFromPicker()
      if (startDate === endDate) {
        this.rawData = <RawDataReport>this.rawDataReportForm.value
        let startTime = this.rawData.startTime
        let endTimeTime = this.rawData.endTime
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
        if (id == 'startTime'){
          if (strtHr >= endHr) {
            if (strtMin >= endMin) {
              this.validateTime = true
              this.rawDataReportForm.controls['startTime'].markAsTouched();
              this.rawDataReportForm.controls['startTime'].updateValueAndValidity();
              this.rawDataReportForm.controls['startTime'].setErrors({
                'required': true
              })
            } if (strtHr > endHr) {
              this.validateTime = true
              this.rawDataReportForm.controls['startTime'].markAsTouched();
              this.rawDataReportForm.controls['startTime'].updateValueAndValidity();
              this.rawDataReportForm.controls['startTime'].setErrors({
                'required': true
              })
            }
           // this.assetDataReportForm.setErrors({ 'invalid': true });
          // this.assetDataReportForm.controls['startTime'].setValidators([Validators.required]);

          }
        }
        else if(id=='endTime'){
          if (strtHr >= endHr) {
            if (strtMin >= endMin) {
              this.validateEndTime = true
              this.rawDataReportForm.controls['endTime'].markAsTouched();
              this.rawDataReportForm.controls['endTime'].updateValueAndValidity();
              this.rawDataReportForm.controls['endTime'].setErrors({
                'required': true
              })
            } if (strtHr > endHr) {
              this.validateEndTime = true
              this.rawDataReportForm.controls['endTime'].markAsTouched();
              this.rawDataReportForm.controls['endTime'].updateValueAndValidity();
              this.rawDataReportForm.controls['endTime'].setErrors({
                'required': true
              })
            }
            //this.assetDataReportForm.setErrors({ 'invalid': true });

          }

        }

      }


    }


  /*
      Download as Excel, PDF, CSV starts here=================================
    */



  // Getting search filter details
  searchFilterObject = {};
  searchFieldsContainer;
  searchFilterKeysValues
  searchCriteriaText = "Search Criteria";
  exportedFileTitleName = "Raw Data Report";
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
    title: 'Raw Data Report',
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

    // Make Array object into Arrays
    this.tableBodyDataList = this.tableBodyDataList.map(object => Object.values(object));

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
