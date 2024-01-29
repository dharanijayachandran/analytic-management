import { Component, OnInit, ViewChild } from '@angular/core';
import { WidgetDetail, TestMapData, Widget } from '../../../model/widget';
import { DashboardList, Dashboard } from '../../../model/dashboard';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ShareddataService } from '../../../shared/shareddata.service';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { WidgetService } from '../../../services/widget/widget.service';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { GridsterItem, GridsterConfig, GridType } from 'angular-gridster2';
import { UIModalNotificationPage } from 'global';

@Component({
  selector: 'app-inner-container',
  templateUrl: './inner-container.component.html',
  styleUrls: ['./inner-container.component.css']
})
export class InnerContainerComponent implements OnInit {





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





  LineChartYLastValue: any;
  LineChartYFirstValue: any;
  showLoaderImage: boolean;
  isDisabled: boolean;
  mapZoom: number;
  assetData: any;
  category: any;
  constructor(private modalService: NgbModal, private dashboardService: DashboardService,
    private widgetService: WidgetService, private globalService: globalSharedService,
    private sharedData: ShareddataService) {

  }
  //temp rfresh code strat from here
  // tempSelectedDashboard=$('#userDashboardList').val();
  lineChartDataTest: any

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
  // global global;
  widgetHtmlData: string;
  closeResult: string;
  widgetDetail: WidgetDetail[] = [];
  tempContainers: WidgetDetail[] = [];
  currentArrayItem = 0;
  @ViewChild(UIModalNotificationPage) modelNotification;
  targetTimeZone: string;
  subscription

  mapStyles = {};
  lineChartData = [];
  assetId: any;

  lat: number = 21.4654309;
  lng: number = 77.7588319;

  open(content, id: number) {


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
  ngOnInit() {
    this.subscription =  this.sharedData.getChangedMessage().subscribe(message => {
      if (this.options.api != undefined) {
        this.options.api.resize();
      }
    })


    this.sharedData.getCategory().subscribe(data => {
      this.assetData = data;
      this.assetId = this.assetData.id
      if(this.assetData.assetCategory){
        this.category = this.assetData.assetCategory.name;
      }

      // alert('in DB COntainer::' + this.category)
      if (this.category == 'Area') {
        this.getDashboardOnLoad(46);
        // this.areaWidgets();
      } else if (this.category == 'Human') {
        this.getDashboardOnLoad(104);
        // this.humanWidgets();13
      } else {
        this.getDashboardOnLoad(13);
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
    // this.getDashboardListByBeId(+beId);
    this.layout = []
    if(this.layout.length != 0){
      this.getDashboardOnLoad(+event);
    }

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



    // let widgetData = res["dashboardWidgets"];
    // this.getFormatedWidgetParamInfoAndAddToContainer(widgetData);
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
    this.layout = [];
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
      this.layout.push(newGridterdata);
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

        this.userDashboardList = res;
        this.selectedDashboardIdName = this.globalService.getDashboardSelectedName(this.userDashboardList, null);
        this.userDashboardList.forEach(element => {
          if (element.isDefault) {

            this.selectedDashboardId = element.id;
            this.getDashboardOnLoad(element.id);
            this.checked = true;
          }
        });
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


  loadEnable() {
    this.showLoaderImage = true;
    this.isDisabled = true;
  }
  loadDisable() {
    this.showLoaderImage = false;
    this.isDisabled = false;
  }

  ngOnDestroy() {
    // clearInterval(this.inter);
    this.subscription.unsubscribe();
  }

  panelReload(event)
  {

  }
}
