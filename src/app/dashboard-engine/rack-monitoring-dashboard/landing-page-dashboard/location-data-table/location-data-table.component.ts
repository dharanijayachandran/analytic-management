import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { WidgetService } from 'src/app/dashboard-engine/services/widget/widget.service';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';

@Component({
  selector: 'location-data-table',
  templateUrl: './location-data-table.component.html',
  styleUrls: ['./location-data-table.component.css']
})
export class LocationDataTableComponent implements OnInit {

  @Input() alarms;
  NoRecordsFound = false;
  gatewayById: number;
  showLoaderImage: boolean = false;
  dataSource: any;
  myPaginator;
  pageIndex: number;
  pageSize: number;
  length: number;
  sort;
  assets: any[];
  totalLocationData: any[] = [];
  inter: NodeJS.Timeout;
  assetMap = new Map<any, any>();
  subAssetIds: any[];
  subAssetsAlarms: any;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  displayedColumns: string[] = ['assetName', 'totalCount', 'latestTime'];
  displayTableHeader = ['Building', 'Total Alarms', 'Latest Alarm Time & Date'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private globalService: globalSharedService, private widgetService: WidgetService) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.showLoaderImage = true;
    this.loadDataInTable();
    this.widgetService.getTimeIntervalsFromFile().toPromise().then(data => {
      let interval = data.mainDashboardRefreshTimeInterval;
      this.inter = setInterval(() => {
        this.loadDataInTable()
      }, +interval);
    })

  }

  ngOnDestroy() {
    clearInterval(this.inter);
    this.widgetService.iconFromDashboard = false;
  }

  loadDataInTable() {
    // this.dataSource = new MatTableDataSource();
    // this.dataSource.paginator = this.myPaginator;
    this.getDataForAssetType();
  }

  getDataForAssetType() {
    let organizationId = sessionStorage.getItem('beId');
    let code = 'AREA';
    // this.dataSource.data = [];
    this.totalLocationData = [];
    let TimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.widgetService.getLocationWiseAlarm(String(TimeZone), Number(organizationId)).subscribe(responseData => {
      responseData.map(item => {
        if (item.totalCount != 0) {
          this.totalLocationData.push({ "assetId": item.assetId, "assetName": item.assetName, "totalCount": item.totalCount, "latestTime": item.latestTime, "alarmAssetIds": item.alarmAssetIds });
        }
      });
      if (this.totalLocationData) {
        this.totalLocationData = this.totalLocationData.sort((a, b) => b.eventTime - a.eventTime)
        this.dataSource.data = this.totalLocationData
        this.dataSource.sort = this.sort;
        this.NoRecordsFound = false;
        this.showLoaderImage = false;
      } else {
        this.showLoaderImage = false;
        this.NoRecordsFound = true;
      }
    })
  }


  getAlarmsFromSubAssetIds(subAssets: any[], map1) {
    subAssets.forEach(subAsset => {
      if (subAsset.subAssets && subAsset.subAssets.length) {
        this.getAlarmsFromSubAssetIds(subAsset.subAssets, map1);
      }
      if (map1[subAsset.id]) {
        if (!this.subAssetsAlarms || !this.subAssetsAlarms.length) {
          let totalAlarms = [];
          let alarms = map1[subAsset.id];
          totalAlarms = alarms["alarm"];
          let alarmStateMap = alarms["states"];
          totalAlarms = totalAlarms.filter(alarm => alarmStateMap[alarm.stateId] !== 'Cleared' && alarmStateMap[alarm.stateId] !== 'Disabled');
          totalAlarms = totalAlarms.sort((a, b) => b.eventTime - a.eventTime);
          this.subAssetsAlarms.push(totalAlarms);
        }
        this.subAssetIds.push(subAsset.id);
      }
    })
  }



  /*
    Download as Excel, PDF, CSV starts here=================================
  */

  // Getting search filter details
  searchFilterObject = {};
  searchFieldsContainer;
  searchFilterKeysValues
  searchCriteriaText = "Search Criteria";
  exportedFileTitleName = "Locationwise Alarms Overview";
  tableBodyDataList;
  fileName;
  xlsxOptions = {
    headers: this.displayTableHeader
  }

  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Locationwise Alarms Overview',
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
    this.fileName = this.globalService.getExportingFileName("Locationwise Alarms Overview");

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
      if (i < this.totalLocationData.length) {
        data.push(this.totalLocationData[i])
      } else {
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
    return Math.ceil(this.totalLocationData.length / this.records_per_page);
  }

  reloadData() {
    this.showLoaderImage = true;
    this.dataSource.data = [];
    this.getDataForAssetType();
  }

  redirectToDashboard(element) {
    this.widgetService.setAssetIds(element.alarmAssetIds);
    this.widgetService.setAssetTagsIds(null);
  }
}
