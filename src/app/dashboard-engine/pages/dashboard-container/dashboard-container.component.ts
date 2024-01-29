import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import { UIModalNotificationPage } from 'global';
import * as global from 'src/app/shared/config/globals';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { Dashboard, DashboardList } from '../../model/dashboard';
import { TestMapData, Widget, WidgetDetail } from '../../model/widget';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { WidgetService } from '../../services/widget/widget.service';
import { ShareddataService } from '../../shared/shareddata.service';

@Component({
  selector: 'app-dashboard-container',
  templateUrl: './dashboard-container.component.html',
  styleUrls: ['./dashboard-container.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class DashboardContainerComponent implements OnInit {

  public options: GridsterConfig = {
    gridType: GridType.VerticalFixed,
    minCols: 100,
    maxCols: 100,
    maxItemCols: 100,
    draggable: {
      enabled: false,
    },
    pushItems: false,
    resizable: {
      enabled: false,
    },
    fixedRowHeight: 20,
    keepFixedHeightInMobile: true,
    keepFixedWidthInMobile: false,
    mobileBreakpoint: 780

  };

  layout: GridsterItem[] = []
  testXT: string
  testYT: string
  dtCSVData: any;

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
  dcstatus: boolean;
  origins: string;
  selectedDashboardIdName: string;
  subscription: any;

  category: any;
  assetData: any;


  downloadCSV(id: number, widgetType: String) {
    //this.dtHolidays : JSONDATA , HolidayList : CSV file Name, this.csvOptions : file options
    this.targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    //get data by DashboardWidgetId
    this.getWidgetDataOnForCSVDownload(id, this.targetTimeZone, widgetType);
    //this.dtCSVData=[];
    new AngularCsv(this.dtCSVData, "donloadedFile", this.csvOptions);
  }
  getWidgetDataOnForCSVDownload(dwId: Number, timeZone: String, widgetType: String) {
    //This is only for Card type widget works
    let cardName = "";
    let cardVal = "";
    //only for widget card works.. replace from before deployement
    let dsId = 3;

    this.widgetList.forEach(element => {
      if (element.id == dwId) {
        dsId = element.analyticDataServiceId;
      }
    });
    this.widgetService.getWidgetDataSourceByWidgetId(dwId, dsId, widgetType, timeZone).subscribe(widgetData => {

      this.dtCSVData = widgetData;
      this.csvOptions.headers = [];
      for (let key in widgetData[0]) {
        this.csvOptions.headers.push(key)
      }
      //this.csvOptions.headers=widgetDetail.DS[0];
      this.csvOptions.title = "data title";

    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, "Unable to pull data of download");
        // this.modelNotification.swalErrorInfo('Error','Unable to pull data of download');

      });
  }
  LineChartYLastValue: any;
  LineChartYFirstValue: any;
  showLoaderImage: boolean;
  isDisabled: boolean;
  mapZoom: number;
  constructor(private modalService: NgbModal, private dashboardService: DashboardService,
    private widgetService: WidgetService, private globalService: globalSharedService,
    private sharedData: ShareddataService) {

  }
  //temp rfresh code strat from here
  // tempSelectedDashboard=$('#userDashboardList').val();
  lineChartDataTest: any
  //private autoRefreshInterval: number = window.setInterval( ()=>{this.getDashboardOnLoadAuto()},120000);


  // //temp refresh code end here
  // //private autoSaveInterval: number = window.setInterval( ()=>{this.runAutoRefresh()},100000);
  // autoRefreshList:AutoRefresh[]=[];
  // autoRefresh:AutoRefresh;
  // runAutoRefresh()
  // {
  //   let dateTime = new Date();
  //   this.autoRefreshList.forEach(element => {
  //     if (element.nextRun <= dateTime) {
  //       let id= element.id;
  //       element.nextRun.setSeconds(element.refreshInterval)

  //       //call this widget Id for refresh
  //     }
  //   });




  //   this.autoRefresh={"id":1,"nextRun":dateTime,"refreshInterval":20};
  //   let i = this.autoRefresh.id;
  //   this.autoRefreshList[i];
  //   this.autoRefreshList.push(this.autoRefresh);

  // }
  map: Map<number, string>;
  configValue: {};
  mapFocusLat: number;
  mapFocusLon: number;
  color = 'accent';
  checked = false;
  dashboardData: string;
  selectedDashboardTitle: string;
  selectedDashboardId: number;
  selectedDashboardDiv: boolean;
  trustedHTML: any;
  pieChart: boolean;
  lineChart: boolean;
  barChart: boolean;
  legend: boolean;
  locationData: boolean;
  agmChart: boolean;
  currentWidgetId: number;
  global = global;
  widgetHtmlData: string;
  closeResult: string;
  widgetDetail: WidgetDetail[] = [];
  tempContainers: WidgetDetail[] = [];
  currentArrayItem = 0;
  @ViewChild(UIModalNotificationPage) modelNotification;
  targetTimeZone: string;

  //declare all dashboard widget here
  //pieChartData = [];
  pieChartColor = { domain: [global.COLOR_BLUE_LIGHTER, global.COLOR_GREEN_DARKER, global.COLOR_PURPLE_LIGHTER, global.COLOR_ORANGE_DARKER] };
  barChartColor = { domain: [global.COLOR_BLUE, global.COLOR_GREEN, global.COLOR_PURPLE, global.COLOR_ORANGE_DARKER] };
  lineChartColor = { domain: [global.COLOR_BLUE, global.COLOR_GREEN, global.COLOR_PURPLE, global.COLOR_ORANGE_DARKER] };
  mapStyles = {};
  lineChartData = [];

  //agmChartData=[];
  //={ domain: [global.COLOR_GREEN, global.COLOR_GREEN, global.COLOR_PURPLE, global.COLOR_BLACK] };

  // maps 21.4654309,77.7588319
  lat: number = 21.4654309;
  lng: number = 77.7588319;

  open(content, id: number) {

    this.MapResultByMarkerId = [{
      "post_latitude": 21.46,
      "post_longitude": 77.75
    }, {
      "post_latitude": 21.47,
      "post_longitude": 77.76
    }, {
      "post_latitude": 21.48,
      "post_longitude": 77.77
    }, {
      "post_latitude": 21.49,
      "post_longitude": 77.78
    }, {
      "post_latitude": 21.50,
      "post_longitude": 77.79
    }, {
      "post_latitude": 21.51,
      "post_longitude": 77.80
    }, {
      "post_latitude": 21.52,
      "post_longitude": 77.81
    }, {
      "post_latitude": 21.53,
      "post_longitude": 77.82
    }, {
      "post_latitude": 21.54,
      "post_longitude": 77.83
    }, {
      "post_latitude": 21.55,
      "post_longitude": 77.84
    }, {
      "post_latitude": 21.56,
      "post_longitude": 77.85
    }
    ];
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  ngOnChanges() {
    //alert('testRefresh')
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.subscription = this.sharedData.getChangedMessage().subscribe(message => {
      if (this.options.api != undefined) {
        this.options.api.resize();
      }
    })

    this.map = new Map();
    this.origins = "UD"
    this.lineChartDataTest = [];
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 500);
    let loggedInId = sessionStorage.getItem("userId");
    let beId = sessionStorage.getItem("beId");
    this.getDashboardListByBeId(+beId);
    //this.getDashboardOnLoad(+event);
  }

  getDashboardOnLoad(id: number) {
    this.layout = [];
    this.selectedDashboardDiv = true;
    if (+id > 0) {

      this.loadEnable();
      this.targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      this.widgetService.getWidgetDetailListByDashboardId(id, this.targetTimeZone).subscribe(res => {

        let widgetData = res["dashboardWidgets"];
        this.getFormatedWidgetParamInfoAndAddToContainer(widgetData);

      },
        error => {
          this.loadDisable();
          ;

          this.modelNotification.alertMessage(this.globalService.messageType_Fail, "Unable to pull data of download");
          // this.modelNotification.swalErrorInfo('Error','Unable to pull data of download');

        });
      //this.getWidgetListBydashId(id);
    }
    else {
      this.loadDisable();
      this.modelNotification.alertMessage(this.globalService.messageType_Fail, "Please select valid dashboard for loading contents");
      // this.modelNotification.swalErrorInfo('Error','Please select valid dashboard for loading contents');
    }
  }
  getDashboardOnLoadAuto() {
    this.layout = [];
    this.selectedDashboardDiv = $('#dashboardList').val();
    if (+this.selectedDashboardDiv > 0) {
      this.loadEnable();
      this.getWidgetListBydashId(+this.selectedDashboardDiv);
    }
    else {
      this.loadDisable();
    }

  }
  //widgetData
  reload = false;
  showListOfReport = false;
  config: any;
  itemsPerPage = 20;
  selectedDashboard: Dashboard[] = [];
  selDash: number;
  userDashboardList: DashboardList[] = [];
  widgetList: Widget[] = [];
  widgetListDetail: Widget[] = [];
  widgetPieDetail: Widget[] = [];
  widgetBarDetail: Widget[] = [];
  widgetLineDetail: Widget[] = [];
  widgetLegendDetail: Widget[] = [];
  widgetMapDetail: Widget[] = [];
  MapResultByMarkerId: TestMapData[] = [];
  widgetDataJson: [];
  getFormatedWidgetParamInfoAndAddToContainer(dashboardWidgetObject: Object[]) {
    for (let i = 0; i < dashboardWidgetObject.length; i++) {
      let tempObject = {};
      let dashboardWidgets = dashboardWidgetObject[i]["params"];

      let interval = dashboardWidgetObject[i]["refreshInterval"];
      let dataService = dashboardWidgetObject[i]["dataService"];
      tempObject["id"] = dashboardWidgetObject[i]["id"];;
      for (let j = 0; j < dashboardWidgets.length; j++) {
        let keyName = dashboardWidgets[j]["code"];
        let keyVal = dashboardWidgets[j]["value"];
        tempObject[keyName] = keyVal;
      }

      // dashboardWidgets.forEach(ele => {

      // });
      tempObject["DS"] = dataService;

      tempObject["RI"] = interval;

      // tempData.push(tempObject);
      let newGridterdata = {
        "id": tempObject["id"],
        "rows": +tempObject["ROW"],
        "cols": +tempObject["WD"],
        "x": +tempObject["POS"],
        "y": +tempObject["POSY"],
        "dbData": tempObject
      }
      if(tempObject["ST"] === "true"){
        this.layout.push(newGridterdata);
      }
    }
    this.layout = this.layout.sort((a, b) => a.id - b.id)

    this.loadDisable();
  }

  getWidgetDetailByWidgetId(id: number, dsId: number, totalItem: Number) {
    this.targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    this.widgetService.getDashboardWidgetDetailByDashboardWidgetId(id, dsId, this.targetTimeZone).subscribe(widgetDataDetail => {
      let widgetDetail = new WidgetDetail();
      widgetDetail = widgetDataDetail;

      let data = widgetDetail.DS["length"];
      let dataText = widgetDetail.DS[0];

      if (data <= 0 || dataText == "No records found") {

        widgetDetail.DA = false;
        if (widgetDetail.WT == "tableMatrix") {
          this.showListOfReport = false;
        }
        // if(widgetDetail.WT=="locationMap")
        // {
        //   //  widgetDetail.DA=true;
        //   //  widgetDetail.DS=[
        //   //    {"id": 4438, "name" : "vehicle01", "markerName" : "", "latitude" : 21.46 , "longitude" : 77.60, "dateTime" : "2020-03-11 14:32:21"},
        //   //    {"id": 3421, "name" : "vehicle02", "markerName" : "", "latitude" : 21.47 , "longitude" : 77.59, "dateTime" : "2020-03-10 12:42:45"},
        //   //    {"id": 2312, "name" : "vehicle03", "markerName" : "", "latitude" : 21.48 , "longitude" : 77.58, "dateTime" : "2020-03-04 14:55:34"},
        //   //    {"id": 5443, "name" : "vehicle04", "markerName" : "", "latitude" : 21.49, "longitude" : 77.57, "dateTime" : "2020-03-11 14:65:54"}
        //   //    ];
        //   //    this.mapFocusLat=widgetDetail.DS[0]["latitude"];
        //   //    this.mapFocusLon=widgetDetail.DS[0]["longitude"];
        // }
      }
      else {

        if (widgetDetail.WT == "tableMatrix") {
          this.config = {
            itemsPerPage: this.itemsPerPage,
            currentPage: 1,
            totalItems: widgetDetail.DS["length"]
          };
          this.showListOfReport = true;
        }
        if (widgetDetail.WT == "lineChart") {
          // widgetDetail.DS;
          // let tempDataHolder=[];
          // tempDataHolder=widgetDetail.DS[0]["series"];
          // tempDataHolder=tempDataHolder.sort((a,b)=> a.value-b.value);
          // widgetDetail.YFV=tempDataHolder[0]["value"] - 5;
          // let tempHolderLen=tempDataHolder.length;
          // widgetDetail.YLV=tempDataHolder[tempHolderLen-1]["value"] + 10;
        }

        if (widgetDetail.WT == "gaugeMeter") {

          let initialData = widgetDetail.DS[0].value;
          var valueGauge = initialData.split(" ", 1);
          //alert(valueGauge);
          this.configValue = { "id": widgetDetail.id, "minRange": widgetDetail.MIR, "maxRange": widgetDetail.MAR, "value": +valueGauge };

        }
        if (widgetDetail.WT == "locationMap") {
          this.mapFocusLat = widgetDetail.DS[0]["latitude"];
          this.mapFocusLon = widgetDetail.DS[0]["longitude"];
          this.mapZoom = 15;
        }
        widgetDetail.DA = true;
      }
      widgetDataDetail.DSID = dsId;
      this.tempContainers.push(widgetDataDetail);
      //alert('Pushed :' + id);

      this.currentArrayItem++;
      if (this.currentArrayItem == totalItem) {
        this.loadDisable();
        this.currentArrayItem = 0;
        //this.containers = this.tempContainers.sort((a, b) => a.id - b.id)
        this.tempContainers = [];

      }
    },
      error => {
        this.loadDisable();
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, "Unable to pull info of widget");
        // this.modelNotification.swalErrorInfo('Error','Unable to pull info of widget');
      });

  }

  //by be Id change method name
  getDashboardListByBeId(id: number) {
    this.dashboardService.getdashboardListByBeId(id).subscribe(
      res => {
        if (res) {
          this.userDashboardList = res;
          this.selectedDashboardIdName = this.globalService.getDashboardSelectedName(this.userDashboardList, null);
          this.userDashboardList.forEach(element => {
            if (element.isDefault) {

              this.selectedDashboardId = element.id;
              this.getDashboardOnLoad(element.id);
              this.checked = true;
            }
          });
        }

      },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, "There is error in  getting dashboard List");
        // this.modelNotification.swalErrorInfo('Error','there is error in  getting dashboard List');
      });
  }



  getWidgetListBydashId(id: number) {

    this.widgetService.getWidgetListByDashboardId(id).subscribe(
      res => {
        this.pieChart = false;
        this.lineChart = false;
        this.agmChart = false;
        this.legend = false;
        this.barChart = false;
        this.widgetList = res;
        let arraIndex = this.widgetList.length;
        let iteratedArrayIndex = 0;
        if (this.widgetList.length > 0) {
          this.widgetList.forEach(element => {
            this.getWidgetDetailByWidgetId(element.id, element.analyticDataServiceId, this.widgetList.length);
          })
        }
        else {
          this.loadDisable();
        }
      },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, "There is error in  getting widget List");
        // this.modelNotification.swalErrorInfo('Error','There is error in  getting widget list');
      });


  }
  dashboardChange(event: Event) {
    //clearInterval(this.autoRefreshInterval)
    this.layout = [];
    this.dcstatus = true;

    if (+event > 0) {
      this.loadEnable();
      this.getDashboardOnLoad(+event);
    }
    else {
      this.loadDisable();
    }

    this.selectedDashboardIdName = this.globalService.getDashboardSelectedName(this.userDashboardList, event);
  }

  defaultSet() {
    //alert(event);
  }
  openWindow(id: number) {
    //alert(id);
  }
  isInfoWindowOpen(id: number) {
    //alert(id);
  }
  pageChanged(event) {
    if (isNaN(event)) {
      this.config.itemsPerPage = event.target.value
      this.itemsPerPage = event.target.value
    } else this.config.currentPage = event;
  }



  dataWriter(id: Number, data: Object, widgetType: String) {

  }

  getWidgetDataOnRefresh(dwId: Number, timeZone: String, widgetType: String) {
    //This is only for Card type widget works
    let cardName = "";
    let cardVal = "";
    //only for widget card works.. replace from
    let dsId = 2;

    this.widgetList.forEach(element => {
      if (element.id == dwId) {
        //alert(element.analyticDataServiceId + 'DSId');
        dsId = element.analyticDataServiceId;
      }
    });


    this.widgetService.getWidgetDataSourceByWidgetId(dwId, dsId, widgetType, timeZone).subscribe(widgetData => {

      let jArray = [];
      jArray = widgetData;
      let jObj = jArray[0];
      // alert(jObj["name"]);
      cardName = jObj["name"];
      cardVal = jObj["value"];
      $("#" + dwId + " p.name").text('.......');
      $("#" + dwId + " p.val").text('...........');
      //alert('reload') implement task.delay('') to make visible change to user
      $("#" + dwId + " p.name").text(cardName);
      $("#" + dwId + " p.val").text(cardVal);
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, "Unable to pull data of widget");
        // this.modelNotification.swalErrorInfo('Error','Unable to pull data of widget');
        $("#" + dwId + " p.name").text('Unable to Refresh');
        $("#" + dwId + " p.val").text('');
      });
  }

  panelReload(id: Number) {
    alert('This functionality is under development !');
    //
    // this.reload = true;
    // this.targetTimeZone= Intl.DateTimeFormat().resolvedOptions().timeZone;
    // this.getWidgetDataOnRefresh(id,this.targetTimeZone,widgetType);
    // //alert(test);
    // setTimeout(() => {
    //   this.reload = false;
    // }, 1500);
  }

  loadEnable() {
    this.showLoaderImage = true;
    this.isDisabled = true;
  }
  loadDisable() {
    this.showLoaderImage = false;
    this.isDisabled = false;
  }

}

