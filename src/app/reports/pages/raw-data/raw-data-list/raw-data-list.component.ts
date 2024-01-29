import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { MatTablePaginatorComponent } from 'src/app/shared/components/mat-table-paginator/mat-table-paginator.component';
import { Gateway } from 'src/app/shared/model/gateway';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { FramedDataPacket } from '../../../model/framedDataPacket';
import { RawDataService } from '../../../services/raw-data/raw-data.service';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-raw-data-list',
  templateUrl: './raw-data-list.component.html',
  styleUrls: ['./raw-data-list.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class RawDataListComponent implements OnInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

  @ViewChild('exporter', { static: false }) exporter;

  @ViewChild('config') config: PerfectScrollbarComponent;

  gatewayList: Gateway[] = [];
  targetZoneName: string;
  fileName: string;
  showLoaderImage: boolean;
  totalNoOfRecords = 0;
  myPaginator;
  pageIndex: number;
  pageSize: number;
  length: number;
  toggleFilterSearch: boolean = false;
  rawDataFilterForm: FormGroup;
  enableViewButton: boolean = true;
  filterExpandCollapse = "Click to Show Filter";

  constructor(private rawDataService: RawDataService,
    private globalService: globalSharedService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.targetZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.showLoaderImage = true;
    // this.getRawDataList();
    this.loadPaginator();
    this.fileName = this.globalService.getExportingFileName("RawDataReport");
    this.rawDataLoadForm();
  }

  rawDataLoadForm() {
    this.rawDataFilterForm = this.formBuilder.group({
      names: [''],
      nodeIdentifier: [''],
    });
  }

  resetForm() {
    this.rawDataFilterForm.get('names').setValue('');
    this.rawDataFilterForm.get('nodeIdentifier').setValue('');
    this.refreshTableListFunction();
  }

  filterForm() {
    if (!(this.rawDataFilterForm.value.names == null || this.rawDataFilterForm.value.nodeIdentifier == null)) {
      let rawDataFilterObj = {
        names: this.commaSeparator(this.rawDataFilterForm.value.names),
        gatewayIdentifiers: this.commaSeparator(this.rawDataFilterForm.value.nodeIdentifier),
      }
      let organizationId = sessionStorage.getItem('beId');
      let userId = sessionStorage.getItem('userId');
      this.rawDataService.rawDataFilterByData(organizationId, rawDataFilterObj, userId).subscribe(res => {
        this.showLoaderImage = true;
        this.dataSource.data = res.object;
        this.totalNoOfRecords = this.dataSource.data.length;
        this.showLoaderImage = false;
      });
    }
  }

  commaSeparator(val: string): string[] {
    return val.split(',');
  }

  filterSearchBox() {
    this.toggleFilterSearch = !this.toggleFilterSearch;
    if (this.toggleFilterSearch) {
      this.filterExpandCollapse = "Click to Hide Filter";
    } else {
      this.filterExpandCollapse = "Click to Show Filter";
    }
  }

  // Refresh table
  refreshTableListFunction() {
    this.getRawDataList();
  }
  displayedColumns: string[] = ['gatewayName', 'dataServerTime', 'receivedTimestamp', 'message'];
  displayTableHeader = ['Gateway Name', 'Date/Time', 'Data Source Date/Time', 'Data Packet']
  sort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  downloadData = new MatTableDataSource();
  dataSource = new MatTableDataSource();

  // To get all the records for RawData list
  getRawDataList() {
    this.rawDataService.getRawData(this.targetZoneName, this.pageIndex, this.pageSize).subscribe(
      res => {
        let framedDataPacket: FramedDataPacket[] = [];
        if (res.object != null && (Array.isArray(res.object) && res.object.length)) {
          framedDataPacket = res.object;
          this.totalNoOfRecords = res.totalNoOfRecords;
          this.dataSource = new MatTableDataSource();
          this.showLoaderImage = false;
          this.dataSource.data = res.object;
          this.dataSource.sort = this.sort;
        } else {
          res.object = [];
          this.dataSource = new MatTableDataSource();
          this.dataSource.data = res.object;
          this.showLoaderImage = false;
        }
      },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        this.showLoaderImage = false;
      });
  }

  rawdata(element) {
    this.globalService.GettingId(element.gatewayId);
    this.globalService.GettingString(element.gatewayName);
    this.globalService.setDataServerTime(element.dataServerTime);
    this.router.navigate(['../raw-data-list/raw-data'], { relativeTo: this.route });
  }

  loadPaginator() {
    if (this.myPaginatorChildComponent) {
      this.myPaginator = this.myPaginatorChildComponent.getDatasource();
      this.matTablePaginator(this.myPaginator);
    }
    else {
      this.pageIndex = 0;
      this.pageSize = 100;
    }
    this.getRawDataList();
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
    };

    // Retrieve the data before initiating the download
    this.rawDataService.getRawData(this.targetZoneName, 0, 0).subscribe(
      (res) => {
        if (res.object != null && Array.isArray(res.object) && res.object.length) {
          this.totalNoOfRecords = res.totalNoOfRecords;
          this.downloadData.data = res.object;

          // Make new set of re-created object
          this.tableBodyDataList = this.globalService.reCreateNewObject(
            this.downloadData.data,
            this.displayedColumns
          );

          // Make Array object into Arrays
          this.tableBodyDataList = this.tableBodyDataList.map((object) => Object.values(object));

          // CSV/PDF/Excel file name
          this.fileName = this.globalService.getExportingFileName("RawDataReport");

          let exportFile = {
            "fileName": this.fileName,
            "excelWorkSheetName": this.exportedFileTitleName,
            "title": this.exportedFileTitleName,
            "tableHeaderNames": this.xlsxOptions.headers,
            "tableBodyData": this.tableBodyDataList
          };

          // Final download
          this.globalService.downloadFile(
            fileType,
            exportFile,
            this.searchFieldsContainer,
            this.tableBodyDataList,
            this.fileName,
            this.csvOptions
          );
        }
      },
      (error) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        this.showLoaderImage = false;
      }
    );
  }


  /*
  Download as Excel, PDF, CSV ends here=================================
*/


  /*
    Material table paginator code starts here
  */

  /*
      Material pagination getting pageIndex, pageSize, length through
      events(On change page, Next,Prev, Last, first) */
  matTablePaginator(myPaginator) {
    this.pageIndex = myPaginator.pageIndex + 1;
    this.pageSize = myPaginator.pageSize;
    this.length = this.totalNoOfRecords;
    this.getRawDataList();
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

