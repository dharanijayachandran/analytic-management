//import * as global from 'src/app/global/config/globals';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridsterConfig, GridsterItem, GridsterItemComponent, GridsterItemComponentInterface, GridType } from 'angular-gridster2';
import { addDays, addHours, endOfMonth, startOfDay, subDays } from 'date-fns';
// import { DeviceDetectorService } from 'ngx-device-detector';
// import 'rxjs/add/observable/of';
import * as global from 'src/app/shared/config/globals';
import { ActiveWidgetList, Dashboard, DashboardList } from '../../model/dashboard';
import { AnalyticDataService, DashboardWidget, DashboardWidgetParamValue, DashboardWidgetServiceInputParamValue, TestMapData, Widget, WidgetAttributes, WidgetDataServiceParam, WidgetDataSource, WidgetDetail, WidgetDetailExtended, WidgetFormData, WidgetParamObject, WidgetStyle } from '../../model/widget';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { WidgetService } from '../../services/widget/widget.service';
import { ShareddataService } from '../../shared/shareddata.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { UIModalNotificationPage } from 'global';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';


@Component({
  selector: 'app-dashboard-config',
  templateUrl: './dashboard-config.component.html',
  styleUrls: ['./dashboard-config.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class DashboardConfigComponent implements OnInit, AfterViewInit {
  static updateWidgetParamValueList: WidgetParamObject[] = [];
  public options: GridsterConfig = {
    gridType: GridType.VerticalFixed,
    minCols: 100,
    maxCols: 100,
    maxItemCols: 100,
    minItemCols: 25,
    draggable: {
      enabled: true,
      dropOverItems: true,
      stop: this.dragStop
    },
    pushItems: true,
    resizable: {
      enabled: true,
      stop: this.resizeStop,
      handles: { s: true, e: true, n: true, w: true, se: true, ne: true, sw: true, nw: true }
    },
    fixedRowHeight: 20,
    keepFixedHeightInMobile: true,
    mobileBreakpoint: 780,
    itemChangeCallback: this.itemChanged

  };
  sidebarActive = "sidebarActiveNull";
  alarmForm: boolean;
  subscription: any;
  assetData: any;
  category: any;
  dashBoardWidgetId: any;
  enableEditButton = false;

  public itemChanged(item: GridsterItem, itemComponent: GridsterItemComponent,) {
    var newItem = itemComponent['$item'];
    let userId = sessionStorage.getItem("userId");
    if (DashboardConfigComponent.updateWidgetParamValueList != undefined && DashboardConfigComponent.updateWidgetParamValueList.length > 0) {
      let widgetParamObjectForX = null;
      let widgetParamObjectForY = null;
      DashboardConfigComponent.updateWidgetParamValueList.forEach(data => {
        if (data.dashboardWidgetId == item.id && data.widgetParamCode == "POS") {
          widgetParamObjectForX = data;
          data.value = newItem.x + "";
        }
        if (data.dashboardWidgetId == item.id && data.widgetParamCode == "POSY") {
          widgetParamObjectForY = data;
          data.value = newItem.y + "";
        }
      });
      if (widgetParamObjectForX == null) {
        widgetParamObjectForX = new WidgetParamObject();
        widgetParamObjectForX['dashboardWidgetId'] = item.id;
        widgetParamObjectForX['value'] = newItem.x + "";
        widgetParamObjectForX['widgetParamCode'] = "POS"
        widgetParamObjectForX['updatedBy'] = +userId
        DashboardConfigComponent.updateWidgetParamValueList.push(widgetParamObjectForX);
      }
      if (widgetParamObjectForY == null) {
        widgetParamObjectForY = new WidgetParamObject();
        widgetParamObjectForY['dashboardWidgetId'] = item.id;
        widgetParamObjectForY['value'] = newItem.y + "";
        widgetParamObjectForY['widgetParamCode'] = "POSY"
        widgetParamObjectForY['updatedBy'] = +userId
        DashboardConfigComponent.updateWidgetParamValueList.push(widgetParamObjectForY);
      }
    } else {
      let widgetParamObjectForX = new WidgetParamObject();
      widgetParamObjectForX['dashboardWidgetId'] = item.id;
      widgetParamObjectForX['value'] = newItem.x + "";
      widgetParamObjectForX['widgetParamCode'] = "POS"
      widgetParamObjectForX['updatedBy'] = +userId
      DashboardConfigComponent.updateWidgetParamValueList.push(widgetParamObjectForX);

      let widgetParamObjectForY = new WidgetParamObject();
      widgetParamObjectForY['dashboardWidgetId'] = item.id;
      widgetParamObjectForY['value'] = newItem.y + "";
      widgetParamObjectForY['widgetParamCode'] = "POSY"
      widgetParamObjectForY['updatedBy'] = +userId
      DashboardConfigComponent.updateWidgetParamValueList.push(widgetParamObjectForY);
    }

  }
  public resizeStop(item: GridsterItem, itemComponent: GridsterItemComponent, event: MouseEvent): void {
    var newItem = itemComponent['$item'];
    let userId = sessionStorage.getItem("userId");
    if (DashboardConfigComponent.updateWidgetParamValueList.length > 0) {
      let widgetParamObjectForCOl = null;
      let widgetParamObjectForRow = null;
      DashboardConfigComponent.updateWidgetParamValueList.forEach(data => {
        if (data.dashboardWidgetId == item.id && data.widgetParamCode == "WD") {
          widgetParamObjectForCOl = data;
          data.value = newItem.cols + "";
        }
        if (data.dashboardWidgetId == item.id && data.widgetParamCode == "ROW") {
          widgetParamObjectForRow = data;
          data.value = newItem.rows + "";
        }
      });
      if (widgetParamObjectForCOl == null) {
        widgetParamObjectForCOl = new WidgetParamObject();
        widgetParamObjectForCOl['dashboardWidgetId'] = item.id;
        widgetParamObjectForCOl['value'] = newItem.cols + "";
        widgetParamObjectForCOl['widgetParamCode'] = "WD"
        widgetParamObjectForCOl['updatedBy'] = +userId
        DashboardConfigComponent.updateWidgetParamValueList.push(widgetParamObjectForCOl);
      }
      if (widgetParamObjectForRow == null) {
        widgetParamObjectForRow = new WidgetParamObject();
        widgetParamObjectForRow['dashboardWidgetId'] = item.id;
        widgetParamObjectForRow['value'] = newItem.rows + "";
        widgetParamObjectForRow['widgetParamCode'] = "ROW"
        widgetParamObjectForRow['updatedBy'] = +userId
        DashboardConfigComponent.updateWidgetParamValueList.push(widgetParamObjectForRow);
      }
    } else {
      let widgetParamObjectForCOl = new WidgetParamObject();
      widgetParamObjectForCOl['dashboardWidgetId'] = item.id;
      widgetParamObjectForCOl['value'] = newItem.cols + "";
      widgetParamObjectForCOl['widgetParamCode'] = "WD"
      widgetParamObjectForCOl['updatedBy'] = +userId
      DashboardConfigComponent.updateWidgetParamValueList.push(widgetParamObjectForCOl);

      let widgetParamObjectForRow = new WidgetParamObject();
      widgetParamObjectForRow['dashboardWidgetId'] = item.id;
      widgetParamObjectForRow['value'] = newItem.rows + "";
      widgetParamObjectForRow['widgetParamCode'] = "ROW"
      widgetParamObjectForRow['updatedBy'] = +userId
      DashboardConfigComponent.updateWidgetParamValueList.push(widgetParamObjectForRow);
    }
    // if(item.dbData.WT == 'labelCard'){
    //   DashboardConfigComponent.resizeFont(item, itemComponent)
    // }


  }
  static resizeFont(item: GridsterItem, itemComponent: GridsterItemComponent) {
    var id = item.dbData.id;
    var elm = $("#" + id);
    //elm.find("#info").css("font-size","45px")
  }

  public dragStop(item: GridsterItem, itemComponent: GridsterItemComponentInterface, event: MouseEvent): void {
    var newItem = itemComponent['$item'];
    let userId = sessionStorage.getItem("userId");
    if (DashboardConfigComponent.updateWidgetParamValueList != undefined && DashboardConfigComponent.updateWidgetParamValueList.length > 0) {
      let widgetParamObjectForX = null;
      let widgetParamObjectForY = null;
      DashboardConfigComponent.updateWidgetParamValueList.forEach(data => {
        if (data.dashboardWidgetId == item.id && data.widgetParamCode == "POS") {
          widgetParamObjectForX = data;
          data.value = newItem.x + "";
        }
        if (data.dashboardWidgetId == item.id && data.widgetParamCode == "POSY") {
          widgetParamObjectForY = data;
          data.value = newItem.y + "";
        }
      });
      if (widgetParamObjectForX == null) {
        widgetParamObjectForX = new WidgetParamObject();
        widgetParamObjectForX['dashboardWidgetId'] = item.id;
        widgetParamObjectForX['value'] = newItem.x + "";
        widgetParamObjectForX['widgetParamCode'] = "POS"
        widgetParamObjectForX['updatedBy'] = +userId
        DashboardConfigComponent.updateWidgetParamValueList.push(widgetParamObjectForX);
      }
      if (widgetParamObjectForY == null) {
        widgetParamObjectForY = new WidgetParamObject();
        widgetParamObjectForY['dashboardWidgetId'] = item.id;
        widgetParamObjectForY['value'] = newItem.y + "";
        widgetParamObjectForY['widgetParamCode'] = "POSY"
        widgetParamObjectForY['updatedBy'] = +userId
        DashboardConfigComponent.updateWidgetParamValueList.push(widgetParamObjectForY);
      }
    } else {
      let widgetParamObjectForX = new WidgetParamObject();
      widgetParamObjectForX['dashboardWidgetId'] = item.id;
      widgetParamObjectForX['value'] = newItem.x + "";
      widgetParamObjectForX['widgetParamCode'] = "POS"
      widgetParamObjectForX['updatedBy'] = +userId
      if (widgetParamObjectForX['dashboardWidgetId'] != undefined && widgetParamObjectForX['dashboardWidgetId'] != null) {
        DashboardConfigComponent.updateWidgetParamValueList.push(widgetParamObjectForX);
      }
      let widgetParamObjectForY = new WidgetParamObject();
      widgetParamObjectForY['dashboardWidgetId'] = item.id;
      widgetParamObjectForY['value'] = newItem.y + "";
      widgetParamObjectForY['widgetParamCode'] = "POSY"
      widgetParamObjectForY['updatedBy'] = +userId
      if (widgetParamObjectForY['dashboardWidgetId'] != undefined && widgetParamObjectForY['dashboardWidgetId'] != null) {
        DashboardConfigComponent.updateWidgetParamValueList.push(widgetParamObjectForY);
      }

    }
  }
  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  name: '';
  state = '';
  position = '';
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
  mapZoom: number;
  minRange: number;
  maxRange: number;
  dcstatus: boolean;
  onDrop: boolean;
  selectedDashboardIdName: string;
  newInnerHeight: any;
  newInnerWidth: any;
  gaugeType = "semi";
  gaugeValue: number;
  gaugeLabel: string;
  gaugeAppendText: string;
  gauageThick = 20;
  foregroundColorGauge = "#645858";
  backgroundGaugeColor = "#F2F3F4";
  targetTimeZone: string;
  parentVariable: number;
  styleId: number;
  colClassId: number;
  typeId: number;
  iconId: number;
  showLoaderImage: boolean;
  isDisabled: boolean;
  mapFocusLat: number;
  mapFocusLon: number;
  public selectedWidgetId: string;
  public formOpenType: string;
  //modalReference: NgbModalRef;
  //@ViewChild('modelWidgetForm') public modal: ModalDirective;
  statusMessage;

  @Input('dataService') dsSourceDataArray: [];
  @Input('group') dashboardFrom: FormGroup;

  showListOfReport = false;
  config: any;
  itemsPerPage = 20;
  serviceMessage: string;
  userDashboard: DashboardList;
  btnWidgetFormModelClose: any;
  deleteFlag: string;
  // if this  is  true then resets dashboard forn ,else if it is falseresets widget form.
  dashboardResetFlag: boolean = false;
  layout: GridsterItem[] = []
  dashboardWidgetServiceInputParamValues: DashboardWidgetServiceInputParamValue[] = [];
  //analyticDataServiceInputParams: AnalyticDataServiceInputParam[]=[];
  analyticDataService: AnalyticDataService[] = [];
  items: any;
  hiddenId: number;
  deleteWidgetIndex: number;
  deleteWidgetStatus: String //this will say if its not saved yet or already saved one.

  dashboardForm: FormGroup;
  widgetForm:FormGroup;
  userDashboardList: DashboardList[] = [];
  //selectedDashboard: Dashboard[] = [];
  selectedDashboardId: number;
  reload = false;
  checked = false;
  collapse = false;
  remove = false;
  showFooter = false;
  closeResult: string;
  widget: Widget;
  //selDash: number;
  widgetList: Widget[] = [];
  dashboardWidgetG: DashboardWidget[] = [];
  private widgetFormData: WidgetFormData = new WidgetFormData();
  widgetListDetail: Widget[] = [];
  dashboardWidgetParamValue: DashboardWidgetParamValue[] = [];
  dataSourceList: WidgetDataSource[] = [];
  styleList: WidgetStyle[] = [];
  colClasses: WidgetStyle[] = [];
  widgetDataJson: [];
  submitButton: boolean;
  formTitle: string;
  barChart: boolean;
  labelCard: boolean;
  tableMatrix: boolean;
  pieChart: boolean;
  agmChart: boolean;
  locationMap: boolean;
  lineChart: boolean;
  areaChart: boolean;
  barWidgetForm: boolean;
  gaugeMeterForm: boolean;
  pieWidgetForm: boolean;
  lineWidgetForm: boolean;
  mapWidgetForm: boolean;
  directionMapForm: boolean;
  selectedDashboardTitle: string;
  selectedDashboardDiv: boolean;
  tableWidgetForm: boolean;
  floatWidgetForm: boolean;
  labelWidgetForm: boolean;
  stackedChartOptions;
  stackedChartData;
  currentArrayItem = 0;
  dashboard: Dashboard;
  activeWidgetList: ActiveWidgetList[];
  currentDashboardId: number;
  currentWidgetId: number;
  analyticWidgetPara: any;
  widgetAttributes: WidgetAttributes[];
  analyticWidgetParameter: WidgetAttributes[];
  currentWidgetCode: string;
  widgetsList: any;
  tempData: any;
  activeWidget: WidgetDetail[] = [];
  eventForm: boolean;
  containerForm: boolean;
  //dsInputParamValueForm: FormGroup;
  dsInputParams: WidgetDataServiceParam[] = [];
  treeViewForm: boolean;
  //widget: Widget;
  screenStatus: string = '';


  deviceInfo = null;
  expand: boolean = false;
  currentId = 0;
  @ViewChild("ClicktoMaximize") ClicktoMaximize: ElementRef;
  @ViewChild("ClicktoMinimize") ClicktoMinimize: ElementRef;

  panelExpand(id) {
    this.expand = !this.expand;
    this.currentId = id;
    if (this.expand) {
      //  this.screenStatus = "Click to Minimize";
      this.screenStatus = this.ClicktoMinimize.nativeElement.innerText;
    } else {
      // this.screenStatus = "Click to Maximize";
      this.screenStatus = this.ClicktoMaximize.nativeElement.innerText;
    }
  }
  constructor(private deviceService: DeviceDetectorService,
    private elem: ElementRef,
    private widgetService: WidgetService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dashboardService: DashboardService,
    private globalService: globalSharedService,
    private sharedData: ShareddataService,
    private cdr: ChangeDetectorRef) {
    this.epicFunction();
    this.dashboardForm = this.formBuilder.group({
      id: [null],
      name: ['', [Validators.required, Validators.pattern(this.globalService.getNamePattern())]],
      isDefault: [true],
      status: [],
      businessEntityId: [null],
      description: ['']
    });
    this.widgetForm = this.formBuilder.group({
      widget: this.formBuilder.group({
        id: [null],
        dashboardWidgetId: [],
        TL: ['', [Validators.required, Validators.pattern(this.globalService.getNamePattern())]],
        WT: ['', Validators.required],
        STL: ['', Validators.required],
        WD: ['', [Validators.required, Validators.pattern(this.globalService.getPatternForCommunication('Integer'))]],
        ROW: ['', [Validators.required, Validators.pattern(this.globalService.getPatternForCommunication('Integer'))]],
        POS: [''],
        POSY: [''],
        XV: [],
        YV: [],
        PN: true,
        XT: [''],
        analyticWidgetId: [],
        YT: [''],
        DS: ['', Validators.required],
        ICN: [''],
        // dataSourceFormate: ['', Validators.required],
        dashboardId: [],
        ST: [],
        MIR: [],
        MAR: [],
        MIS: [],
        MAS: [],
        TYP: [],
        RI: ['', Validators.pattern(this.globalService.getPatternForCommunication('Integer'))],
        FS: ["", Validators.max(30)],
        dsInputParams: this.formBuilder.array([
          this.adddsInputParamValueForumGroup()
        ])
      }),
    });
  }

  epicFunction() {
    //alert('detect');
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    //alert(this.deviceInfo);
    //alert(isMobile + ' mobile');  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
    //alert(isTablet + ' tablet');  // returns if the device us a tablet (iPad etc)
    //alert(isDesktopDevice + ' desktop'); // returns if the app is running on a Desktop browser.

  }
  public adddsInputParamValueForumGroup(): FormGroup {
    return this.formBuilder.group({
      id: [0],
      value: [0],
      analyticDataServiceInputParamId: [0],
      status: [''],
      dashBoardWidgetId: [0]
    })
  }


  ngOnInit() {
    this.subscription = this.sharedData.getChangedMessage().subscribe(message => {
      if (this.options.api != undefined) {
        this.options.api.resize();
      }
    })

    this.sharedData.getCategory().subscribe(data => {
      this.assetData = data;
      // this.category = this.assetData.category;
      // alert('in DB COntainer::'+ this.category)
    })
    //currently all available active Analytic widget list binding
    this.getWidgetListByUserId("A");

    let userId = sessionStorage.getItem("userId");
    let beId = sessionStorage.getItem("beId");
    this.getDashboardListByBeId(+beId);
    //OnLoad Function end from here.
    //below are the statics code, need to be replaced in code factor steps
    this.stackedChartOptions = {
      chart: {
        type: 'stackedAreaChart',
        height: 260,
        useInteractiveGuideline: true,
        x: function (d) { return d[0]; },
        y: function (d) { return d[1]; },
        pointSize: 0.5,
        margin: { top: 20, right: 25, bottom: 20, left: 35 },
        controlLabels: { stacked: 'Stacked' },
        showControls: false,
        duration: 300,
        xAxis: {
          tickFormat: function (d) {
            var monthsName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            d = new Date(d);
            d = monthsName[d.getMonth()] + ' ' + d.getDate();
            return d;
          }
        }
      }
    }

    this.stackedChartData = [{
      key: "Unique Visitors",
      color: global.COLOR_AQUA,
      values: [
        [1511605558229, 13], [1511691958229, 13], [1511778358229, 6], [1511951158229, 6], [1512037558229, 6], [1512123958229, 5], [1512210358229, 5], [1512296758229, 5], [1512383158229, 6], [1512469558229, 7], [1512555958229, 6], [1512642358229, 9], [1512728758229, 9], [1512815158229, 8], [1512901558229, 10], [1512987958229, 10], [1513074358229, 10], [1513160758229, 10], [1513247158229, 9], [1513333558229, 9], [1513419958229, 10], [1513506358229, 9], [1513592758229, 9], [1513679158229, 8], [1513765558229, 8], [1513851958229, 8], [1513938358229, 8], [1514024758229, 8], [1514111158229, 7], [1514197558229, 7], [1514283958229, 6], [1514370358229, 6], [1514456758229, 6], [1514543158229, 6], [1514629558229, 5], [1514715958229, 5], [1514802358229, 4], [1514888758229, 4], [1514975158229, 5], [1515061558229, 5], [1515147958229, 5], [1515234358229, 7], [1515320758229, 7], [1515407158229, 7], [1515493558229, 10], [1515579958229, 9], [1515666358229, 9], [1515752758229, 10], [1515839158229, 11], [1515925558229, 11],
        [1516011958229, 8], [1516098358229, 8], [1516184758229, 7], [1516271158229, 8], [1516357558229, 9], [1516443958229, 8], [1516530358229, 9], [1516616758229, 10], [1516703158229, 9], [1516789558229, 10], [1516875958229, 16], [1516962358229, 17], [1517048758229, 16], [1517135158229, 17], [1517221558229, 16], [1517307958229, 15], [1517394358229, 14], [1517480758229, 24], [1517567158229, 18], [1517653558229, 15], [1517739958229, 14], [1517826358229, 16], [1517912758229, 16], [1517999158229, 17], [1518085558229, 7], [1518171958229, 7], [1518258358229, 7]
      ]
    }, {
      key: "Page Views",
      color: global.COLOR_BLUE,
      values: [
        [1511605558229, 14], [1511691958229, 13], [1511778358229, 15], [1511951158229, 14], [1512037558229, 13], [1512123958229, 15], [1512210358229, 16], [1512296758229, 16], [1512383158229, 14], [1512469558229, 14], [1512555958229, 13], [1512642358229, 12], [1512728758229, 13], [1512815158229, 13], [1512901558229, 15], [1512987958229, 16], [1513074358229, 16], [1513160758229, 17], [1513247158229, 17], [1513333558229, 18], [1513419958229, 15], [1513506358229, 15], [1513592758229, 15], [1513679158229, 19], [1513765558229, 19], [1513851958229, 18], [1513938358229, 18], [1514024758229, 17], [1514111158229, 16], [1514197558229, 18], [1514283958229, 18], [1514370358229, 18], [1514456758229, 16], [1514543158229, 14], [1514629558229, 14], [1514715958229, 13], [1514802358229, 14], [1514888758229, 13], [1514975158229, 10], [1515061558229, 9],
        [1515147958229, 10], [1515234358229, 11], [1515320758229, 11], [1515407158229, 11], [1515493558229, 10], [1515579958229, 9], [1515666358229, 10], [1515752758229, 13], [1515839158229, 14], [1515925558229, 14], [1516011958229, 13], [1516098358229, 12], [1516184758229, 11], [1516271158229, 13], [1516357558229, 13], [1516443958229, 13], [1516530358229, 13], [1516616758229, 14], [1516703158229, 13], [1516789558229, 13], [1516875958229, 19], [1516962358229, 21], [1517048758229, 22], [1517135158229, 25], [1517221558229, 24], [1517307958229, 24], [1517394358229, 22], [1517480758229, 16], [1517567158229, 15], [1517653558229, 12], [1517739958229, 12], [1517826358229, 15], [1517912758229, 15], [1517999158229, 15], [1518085558229, 18], [1518085558229, 18], [1518258358229, 17]
      ]
    }];
    this.barChart = true;
    this.pieChart = true;
    this.locationMap = true;

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 500);

  }
  ngAfterViewInit() {
    this.screenStatus = this.ClicktoMaximize.nativeElement.innerText;
    this.cdr.detectChanges();
  }


  createWidget() {
    const dashboardWidgetL = new DashboardWidget();
    //debugger;
    //dashboardWidgetL.id = +this.selectedWidgetId
    this.widgetFormData = <WidgetFormData>this.widgetForm.value;
    dashboardWidgetL.analyticWidgetId = this.currentWidgetId;
    dashboardWidgetL.createdBy = +sessionStorage.getItem("userId");
    //assigned parameters for widget param
    for (var key in this.widgetFormData["widget"]) {
      let setKey = false;
      let dashboardWidgetParamTemp = new DashboardWidgetParamValue();
      // let analyticDataService = new AnalyticDataService();
      if (key.match("id")) {
        if (this.widgetFormData["widget"][key] != undefined && this.widgetFormData["widget"][key] != null) {
          dashboardWidgetParamTemp.dashboardWidgetId = this.widgetFormData["widget"][key];
          dashboardWidgetL.id = this.widgetFormData["widget"][key];
          setKey = true;
        }
      }
      else if (key.match("analyticWidgetId")) {
        dashboardWidgetL.analyticWidgetId = this.widgetFormData["widget"][key];
        setKey = true;
      }
      else if (key.match("RI")) {
        dashboardWidgetL.refreshIntervalInSec = this.widgetFormData["widget"][key];
        setKey = true;
        if (this.containerForm) {
          dashboardWidgetL.refreshIntervalInSec = 60;
        }
      }
      else if (key.match("dashboardId")) {
        dashboardWidgetL.dashboardId = + $('#dashboardList').val();
        setKey = true;
      }

      // else if(key.match("DS"))
      // {
      //   dashboardWidgetL.analyticDataServiceId=this.widgetFormData["widget"][key];
      //   setKey=true;
      // }
      else if (key.match("dsInputParams")) {
        if (this.widgetFormData["widget"][key] != "asia/kolkata") {
          this.dashboardWidgetServiceInputParamValues = this.widgetFormData["widget"][key];
        }
        setKey = true;
      }
      else if (!setKey) {

        if (key.match("DS")) {
          dashboardWidgetL.analyticDataServiceId = this.widgetFormData["widget"][key];
        }

        dashboardWidgetParamTemp.widgetParamCode = key;
        var hiddenIdAppVal = '#' + key + '_ID'
        this.hiddenId = + $(hiddenIdAppVal).val();
        if (this.hiddenId > 0) {

          dashboardWidgetParamTemp.AnalyticWidgetParamId = this.hiddenId;
        }
        if (this.widgetFormData["widget"][key] === "") {
          dashboardWidgetParamTemp.value = "null"
        }
        else {
          dashboardWidgetParamTemp.value = this.widgetFormData["widget"][key];
        }
        this.dashboardWidgetParamValue.push(dashboardWidgetParamTemp)
      }
    }
    dashboardWidgetL.dashboardWidgetParamValues = this.dashboardWidgetParamValue;
    dashboardWidgetL.dashboardWidgetServiceInputParamValues = this.dashboardWidgetServiceInputParamValues;

    //if id null add new widget
    if (dashboardWidgetL.id == null) {
      if (this.widgetForm.valid) {
        this.widgetService.addDashboardWidget(dashboardWidgetL)
          .subscribe(
            res => {
              if (res["code"] == "800") {
                this.getDashboardOnLoad(+ $('#dashboardList').val());
                this.clearFormVisibility();
                // this.modalService.dismissAll('dismiss');
                // this.modelNotification.swalSuccess('Widget Added Successfully.');
                this.handlingExpandCollapse('sidebarActiveNull', "Click to Widgets", "0px");
                this.callApiToWidgetResize(true);
              }
              else {
                this.getDashboardOnLoad(+ $('#dashboardList').val());
                this.clearFormVisibility();
                // this.modalService.dismissAll('dismiss');
                let mess = res["message"];
                this.modelNotification.alertMessage(this.globalService.messageType_Fail, mess);
                this.handlingExpandCollapse('sidebarActiveNull', "Click to Widgets", "0px");
                this.callApiToWidgetResize(true);
              }

            },
            (error: any) => {
              this.getDashboardOnLoad(+ $('#dashboardList').val());
              this.clearFormVisibility();
              this.modalService.dismissAll('dismiss');
              this.modelNotification.alertMessage(this.globalService.messageType_Fail, "Unable to save widget on dashboard!");
              // this.modelNotification.swalErrorInfo('Error !','Unable to save widget on dashboard !');
              this.handlingExpandCollapse('sidebarActiveNull', "Click to Widgets", "0px");
              this.callApiToWidgetResize(true);
            });
      }
    }
    else {
      dashboardWidgetL.updatedBy = +sessionStorage.getItem("userId");
      if (this.widgetForm.valid) {
        this.widgetService.updateDashboardWidget(dashboardWidgetL)
          .subscribe(
            res => {
              if (res["code"] == "800") {
                this.getDashboardOnLoad(+ $('#dashboardList').val());
                this.clearFormVisibility();
                this.modalService.dismissAll('dismiss');
                // this.modelNotification.swalSuccess('Widget updated successfully.');
                this.handlingExpandCollapse('sidebarActiveNull', "Click to Widgets", "0px");
                this.callApiToWidgetResize(true);
              }
              else {
                this.getDashboardOnLoad(+ $('#dashboardList').val());
                this.clearFormVisibility();
                // this.modalService.dismissAll('dismiss');
                let mess = res["message"];
                this.modelNotification.alertMessage(this.globalService.messageType_Fail, mess);
                this.handlingExpandCollapse('sidebarActiveNull', "Click to Widgets", "0px");
                this.callApiToWidgetResize(true);
              }
            },
            (error: any) => {
              this.getDashboardOnLoad(+ $('#dashboardList').val());
              this.clearFormVisibility();
              // this.modalService.dismissAll('dismiss');
              this.modelNotification.alertMessage(this.globalService.messageType_Fail, "Unable to update widget on dashboard!");
              this.handlingExpandCollapse('sidebarActiveNull', "Click to Widgets", "0px");
              this.callApiToWidgetResize(true);
            });
      }

    }

    //clean array container for next process
    this.dashboardWidgetParamValue = [];
    this.analyticDataService = [];

  }

  clearFormVisibility() {
    this.barWidgetForm = false;
    this.pieWidgetForm = false;
    this.lineWidgetForm = false;
    this.labelWidgetForm = false;
    this.gaugeMeterForm = false;
    this.tableWidgetForm = false;
    this.floatWidgetForm = false;
    this.mapWidgetForm = false;
    this.directionMapForm = false;
    this.submitButton = false;
    this.treeViewForm = false;
    this.alarmForm = false;
    this.eventForm = false;
    this.containerForm = false;
    this.layout = [];
    this.widgetForm.reset();
  }

  callApiWidgetResize = true;

  openFormModel(id: string, code: string, status: string, container: any) {
    let widgetGroup = this.widgetForm.controls['widget'] as FormGroup
    // $('.modal-content').animate({ opacity: 0.8 }).slideUp(100);
    this.handlingExpandCollapse('widgetSetting', "Click to Cancel", "23%");
    // this.sidebarExpandCollapseStatus = true;
    if (this.callApiWidgetResize) {
      this.callApiToWidgetResize(true);
      this.callApiWidgetResize = false;
    }

    this.widgetForm.reset();
    this.submitButton = false;
    this.barWidgetForm = false;
    this.pieWidgetForm = false;
    this.lineWidgetForm = false;
    this.mapWidgetForm = false;
    this.directionMapForm = false;
    this.floatWidgetForm = false;
    this.labelWidgetForm = false;
    this.gaugeMeterForm = false;
    this.tableWidgetForm = false;
    this.treeViewForm = false;
    this.alarmForm = false;
    this.eventForm = false;
    this.containerForm = false;
    if (code == "lineChart") {
      this.lineWidgetForm = true;
      this.submitButton = true;
      widgetGroup.controls['ICN'].clearValidators()
      widgetGroup.controls['ICN'].updateValueAndValidity();
    }
    if (code == "areaChart") {
      this.lineWidgetForm = true;
      this.submitButton = true;
      widgetGroup.controls['ICN'].clearValidators()
      widgetGroup.controls['ICN'].updateValueAndValidity();
    }
    if (code == "tableMatrix") {
      this.tableWidgetForm = true;
      this.submitButton = true;
      widgetGroup.controls['ICN'].clearValidators()
      widgetGroup.controls['ICN'].updateValueAndValidity();
    }
    if (code == "labelCard") {
      this.labelWidgetForm = true;
      this.submitButton = true;
      widgetGroup.controls['ICN'].setValidators(Validators.required);
      widgetGroup.controls['ICN'].updateValueAndValidity();
    }
    if (code == "barChart") {
      this.barWidgetForm = true;
      this.submitButton = true;
      widgetGroup.controls['ICN'].clearValidators()
      widgetGroup.controls['ICN'].updateValueAndValidity();
    }
    if (code == "locationMap") {
      this.mapWidgetForm = true;
      this.submitButton = true;
      widgetGroup.controls['ICN'].clearValidators()
      widgetGroup.controls['ICN'].updateValueAndValidity();
    }
    if (code == "gaugeMeter") {
      this.gaugeMeterForm = true;
      this.submitButton = true;
      widgetGroup.controls['ICN'].clearValidators()
      widgetGroup.controls['ICN'].updateValueAndValidity();
    }
    if (code == "pieChart") {
      this.pieWidgetForm = true;
      this.submitButton = true;
      widgetGroup.controls['ICN'].clearValidators()
      widgetGroup.controls['ICN'].updateValueAndValidity();
    }
    if (code == "treeHierarchy") {
      this.treeViewForm = true;
      this.submitButton = true;
      widgetGroup.controls['ICN'].clearValidators()
      widgetGroup.controls['ICN'].updateValueAndValidity();
    }
    if (code == "alarm") {
      this.dashBoardWidgetId = container.id;
      this.alarmForm = true;
      this.submitButton = true;
      widgetGroup.controls['ICN'].clearValidators()
      widgetGroup.controls['ICN'].updateValueAndValidity();
    }
    if (code == "directionMap") {
      this.directionMapForm = true;
      this.submitButton = true;
      widgetGroup.controls['ICN'].clearValidators()
      widgetGroup.controls['ICN'].updateValueAndValidity();
    }
    if (code == "event") {
      this.eventForm = true;
      this.submitButton = true;
      widgetGroup.controls['ICN'].clearValidators()
      widgetGroup.controls['ICN'].updateValueAndValidity();
    }
    if (code == "container") {
      this.containerForm = true;
      this.widgetForm = this.formBuilder.group({
        widget: this.formBuilder.group({
          id: [null],
          dashboardWidgetId: [],
          TL: ['', [Validators.required, Validators.pattern(this.globalService.getNamePattern())]],
          WT: ['', Validators.required],
          STL: ['', Validators.required],
          WD: ['', [Validators.required, Validators.pattern(this.globalService.getPatternForCommunication('Integer'))]],
          ROW: ['', [Validators.required, Validators.pattern(this.globalService.getPatternForCommunication('Integer'))]],
          POS: [''],
          POSY: [''],
          XV: [],
          YV: [],
          PN: true,
          XT: [''],
          analyticWidgetId: [],
          YT: [''],
          DS: ['', Validators.required],
          ICN: [''],
          // dataSourceFormate: ['', Validators.required],
          dashboardId: [],
          ST: [],
          MIR: [],
          MAR: [],
          MIS: [],
          MAS: [],
          TYP: [],
          RI: ['', Validators.pattern(this.globalService.getPatternForCommunication('Integer'))],
          FS: ["", Validators.max(30)],
          dsInputParams: this.formBuilder.array([
            this.adddsInputParamValueForumGroup()
          ])
        }),
      });
      this.submitButton = true;
      widgetGroup.controls['ICN'].clearValidators()
      widgetGroup.controls['ICN'].updateValueAndValidity();
    }
    // this.modalService.open(content,
    //   {
    //     windowClass: 'custom-class',
    //     backdrop: 'static',
    //   }).result.then((result) => {
    //     $('.modal-body').addClass('custom-body');
    //     $('.modal-dialog').addClass('theme-panel theme-panel-lg active');
    //     $('.modal-backdrop').addClass('hide').removeClass('show');
    //     this.closeResult = `Closed with: ${result}`;
    //   }, (reason) => {
    //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    //   });

    if (status == "tempWidget") {
      this.formOpenType = status;
      this.selectedWidgetId = id;
      this.widgetService.getAnalyticWidgetAttByWidgetId(+id).subscribe(
        res => {
          this.widgetAttributes = res;
          this.assignParametrsToFormControls(this.widgetAttributes);
        },
        error => {
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, "There is error in getting analytic widget attribute data list");
          // this.modelNotification.swalErrorInfo('Error','There is error in getting analytic widget attribute data list');
        });
    }
    else {
      this.selectedWidgetId = container.analyticWidgetId;
      this.formOpenType = id;
      this.currentWidgetId = container.analyticWidgetId;
      //get data for Updating existing widget ===================
      this.widgetService.getDashboardWidgetDetailByIdExtended(+id).subscribe(
        res => {
          let widgetDetailE = new WidgetDetailExtended();
          widgetDetailE = res;
          this.widgetForm.patchValue({
            widget: {
              id: container.id
            }
          });
          this.widgetForm.patchValue({
            widget: {
              RI: container.RI
            }
          });
          this.assignParametrsToFormControlUpdate(widgetDetailE);
        },
        error => {
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, "There is error in  getting dashboard widget attribute data list");
        });
    }
  }

  resetWidgetForm() {
    let id = this.widgetForm.value.widget.id;
    if (id == null) {
      if (this.selectedWidgetId) {
        this.widgetService.getAnalyticWidgetAttByWidgetId(+this.selectedWidgetId).subscribe(
          res => {
            this.widgetAttributes = res;
            this.assignParametrsToFormControls(this.widgetAttributes);
          },
          error => {
            this.modelNotification.alertMessage(this.globalService.messageType_Fail, "There is error in  getting dashboard list");
          });
      }

    }
    else {
      this.widgetService.getDashboardWidgetDetailByIdExtended(+id).subscribe(
        res => {
          let widgetDetailE = new WidgetDetailExtended();
          widgetDetailE = res;
          this.assignParametrsToFormControlUpdate(widgetDetailE);
          this.getDataSourceFormOnUpdate(id);
        },
        error => {
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, "There is error in  getting dashboard widget attribute data list");
        });
    }

  }

  getDataSourceFormOnUpdate(id) {
    this.widgetService.getdashboardWidgetServiceInputParamValueByDashboardWidgetId(id).subscribe(data => {
      if (data !== null && data.length !== 0) {
        let array = [];
        this.widgetForm.value.widget.dsInputParams.forEach(element => {
          data.forEach(param => {
            if (param['analyticDataServiceInputParamId'] == element['analyticDataServiceInputParamId'])
              element.value = param['value']
          });
          array.push(element)
        });
        this.widgetForm.patchValue({
          widget: {
            dsInputParams: array
          }
        });
      }
    });
  }

  dashboardChange(event: Event) {
    this.layout = []
    this.dcstatus = true;
    if (+event > 0) {
      this.loadEnable();
      this.getDashboardOnLoad(+event);
    }
    else {
      this.loadDisable();
    }
    this.selectedDashboardIdName = this.globalService.getDashboardSelectedName(this.userDashboardList, event);
    if (this.selectedDashboardIdName === 'Dashboard') {
      this.enableEditButton = false;
    } else {
      this.enableEditButton = true
    }
  }

  onDragStart(event: DragEvent) {
    //alert('drag and drop event started');
  }

  assignParameterToWidgetControl(wA: WidgetAttributes[], id: number) {
    let activeLen = new WidgetDetail();
    activeLen.id = id;
    for (var key in wA) {
      if (wA[key]["code"] == "WT") {
        activeLen.WT = wA[key]["defaultValue"];
      }
      if (wA[key]["code"] == "RI") {
        activeLen.RI = +wA[key]["defaultValue"];
      }
      if (wA[key]["code"] == "TL") {
        activeLen.TL = wA[key]["defaultValue"];
      }
      if (wA[key]["code"] == "FS") {
        activeLen.FS = wA[key]["defaultValue"];
      }
      if (wA[key]["code"] == "WD") {
        this.colClassId = +wA[key]["id"];
        activeLen.WD = wA[key]["defaultValue"];
      }
      if (wA[key]["code"] == "ROW") {
        activeLen.ROW = wA[key]["defaultValue"];
      }
      if (wA[key]["code"] == "POS") {
        activeLen.POS = wA[key]["defaultValue"];
      }
      if (wA[key]["code"] == "POSY") {
        activeLen.POSY = wA[key]["defaultValue"];
      }
      if (wA[key]["code"] == "STL") {
        this.styleId = +wA[key]["id"];
        activeLen.STL = wA[key]["defaultValue"];
      }
      if (wA[key]["code"] == "ICN") {
        this.iconId = wA[key]["id"];
        activeLen.ICN = wA[key]["defaultValue"];
      }
      if (wA[key]["code"] == "RI") {
        //this.maxRange=+wA[key]["defaultValue"];
        activeLen.RI = +wA[key]["defaultValue"];
      }
      if (wA[key]["code"] == "MAR") {
        //this.maxRange=+wA[key]["defaultValue"];
        activeLen.MAR = +wA[key]["defaultValue"];
      }
      if (wA[key]["code"] == "MIR") {
        activeLen.MIR = +wA[key]["defaultValue"];
      }
      if (wA[key]["code"] == "MAS") {
        //this.maxRange=+wA[key]["defaultValue"];
        activeLen.MAS = +wA[key]["defaultValue"];
      }
      if (wA[key]["code"] == "MIS") {

        activeLen.MIS = +wA[key]["defaultValue"];
      }
      if (wA[key]["code"] == "TYP") {
        this.typeId = +wA[key]["id"];
        activeLen.TYP = wA[key]["defaultValue"];
      }
      //this.minRange=activeLen.MIR;
      //this.maxRange=activeLen.MAR;
      if (wA[key]["code"] == "DS") {
        activeLen.DA = true;
        activeLen.DS = JSON.parse(wA[key]["defaultValue"]);
        if (activeLen.WT == "locationMap") {
          this.mapFocusLat = 21.46;
          this.mapFocusLon = 77.59;
          this.mapZoom = 7;
        }
        if (activeLen.WT == "tableMatrix") {
          this.config = {
            itemsPerPage: this.itemsPerPage,
            currentPage: 1,
            totalItems: activeLen.DS["length"]
          };
          this.showListOfReport = true;
        }

      }
      if (wA[key]["code"] == "XT") {
        activeLen.XT = wA[key]["defaultValue"];
      }
      if (wA[key]["code"] == "CS") {
        activeLen.CS = wA[key]["defaultValue"];
      }
      if (wA[key]["code"] == "YV") {
        this.widgetForm.patchValue({
          widget: {
            YV: wA[key]["defaultValue"]
          }
        })
      }
      if (wA[key]["code"] == "XV") {
        this.widgetForm.patchValue({
          widget: {
            YV: wA[key]["defaultValue"]
          }
        })
      }
      if (wA[key]["code"] == "YT") {
        activeLen.YT = wA[key]["defaultValue"];
      }
    }
    let newGridterdata = {
      "rows": +activeLen.ROW,
      "cols": +activeLen.WD,
      "x": 0,
      "y": 0,
      "dbData": activeLen
    }
    this.layout.push(newGridterdata);
  }


  assignParametrsToFormControls(wA: WidgetAttributes[]) {
    let activeLen = new WidgetDetail();
    for (var key in wA) {
      if (wA[key]["code"] == "WT") {
        this.widgetForm.patchValue({
          widget: {
            WT: wA[key]["defaultValue"]
          }
        })
        $('#WT_ID').val(wA[key]["id"]);
      }
      if (wA[key]["code"] == "ST") {
        let status = wA[key]["defaultValue"];
        if (status === 'A') {
          status = 'true';
        }
        this.widgetForm.patchValue({
          widget: {
            ST: status
          }
        })
        $('#ST_ID').val(wA[key]["id"]);
      }
      if (wA[key]["code"] == "TL") {
        this.widgetForm.patchValue({
          widget: {
            TL: wA[key]["defaultValue"]
          }
        })
        $('#TL_ID').val(wA[key]["id"]);
      }
      if (wA[key]["code"] == "FS") {
        this.widgetForm.patchValue({
          widget: {
            FS: wA[key]["defaultValue"]
          }
        })
        $('#FS_ID').val(wA[key]["id"]);
      }
      if (wA[key]["code"] == "WD") {
        this.colClassId = +wA[key]["id"];
        this.widgetForm.patchValue({
          widget: {
            WD: wA[key]["defaultValue"]
          }
        })
        $('#WD_ID').val(wA[key]["id"]);
      }
      if (wA[key]["code"] == "ROW") {
        this.widgetForm.patchValue({
          widget: {
            ROW: wA[key]["defaultValue"]
          }
        });
        $('#ROW_ID').val(wA[key]["id"]);
      }
      if (wA[key]["code"] == "POS") {
        this.widgetForm.patchValue({
          widget: {
            //must set from UI value
            POS: wA[key]["defaultValue"]
          }
        })
        $('#POS_ID').val(wA[key]["id"]);
      }
      if (wA[key]["code"] == "POSY") {
        this.widgetForm.patchValue({
          widget: {
            //must set from UI value
            POSY: wA[key]["defaultValue"]
          }
        })
        $('#POSY_ID').val(wA[key]["id"]);
      }
      if (wA[key]["code"] == "STL") {
        this.styleId = +wA[key]["id"];
        this.widgetForm.patchValue({
          widget: {
            STL: wA[key]["defaultValue"]
          }
        })
        $('#STL_ID').val(wA[key]["id"]);
      }

      if (wA[key]["code"] == "ICN") {
        this.widgetForm.patchValue({
          widget: {
            ICN: wA[key]["defaultValue"]
          }
        })
        $('#ICN_ID').val(wA[key]["id"]);
      }
      if (wA[key]["code"] == "RI") {
        this.widgetForm.patchValue({
          widget: {
            RI: wA[key]["defaultValue"]
          }
        })
        $('#RI_ID').val(wA[key]["id"]);
      }
      if (wA[key]["code"] == "DS") {
        this.widgetForm.patchValue({
          widget: {
            DS: ""
          }
        })
        $('#DS_ID').val(wA[key]["id"]);
      }
      if (wA[key]["code"] == "XT") {
        this.widgetForm.patchValue({
          widget: {
            XT: wA[key]["defaultValue"]
          }
        })
        $('#XT_ID').val(wA[key]["id"]);
      }
      if (wA[key]["code"] == "XV") {
        this.widgetForm.patchValue({
          widget: {
            XV: wA[key]["defaultValue"]
          }
        })
        $('#XV_ID').val(wA[key]["id"]);
      }
      if (wA[key]["code"] == "YV") {
        this.widgetForm.patchValue({
          widget: {
            YV: wA[key]["defaultValue"]
          }
        })
        $('#YV_ID').val(wA[key]["id"]);
      }
      if (wA[key]["code"] == "MIR") {
        this.widgetForm.patchValue({
          widget: {
            MIR: wA[key]["defaultValue"]
          }
        })
        $('#MIR_ID').val(wA[key]["id"]);
      }
      if (wA[key]["code"] == "MAR") {
        this.widgetForm.patchValue({
          widget: {
            MAR: wA[key]["defaultValue"]
          }
        })
        $('#MAR_ID').val(wA[key]["id"]);
      }
      if (wA[key]["code"] == "MIS") {
        this.widgetForm.patchValue({
          widget: {
            MIS: wA[key]["defaultValue"]
          }
        })
        $('#MIS_ID').val(wA[key]["id"]);
      }
      if (wA[key]["code"] == "MAS") {
        this.widgetForm.patchValue({
          widget: {
            MAS: wA[key]["defaultValue"]
          }
        })
        $('#MAS_ID').val(wA[key]["id"]);
      }
      if (wA[key]["code"] == "TYP") {
        this.typeId = +wA[key]["id"];
        this.widgetForm.patchValue({
          widget: {
            TYP: wA[key]["defaultValue"]
          }
        })
        $('#TYP_ID').val(wA[key]["id"]);
      }
      if (wA[key]["code"] == "YT") {
        activeLen.YT = wA[key]["defaultValue"];
        this.widgetForm.patchValue({
          widget: {
            YT: wA[key]["defaultValue"]
          }
        })
        $('#YT_ID').val(wA[key]["id"]);
      }
    }

  }

  assignParametrsToFormControlUpdate(wA: WidgetDetailExtended) {
    for (var key in wA) {
      if (wA[key]["widgetParamCode"] == "WT") {
        this.widgetForm.patchValue({
          widget: {
            WT: wA[key]["value"]
          }
        });
        $('#WT_ID').val(wA[key]["AnalyticWidgetParamId"]);
      }
      if (wA[key]["widgetParamCode"] == "ST") {
        let paramValue: boolean = true;
        if (wA[key]["value"] == "false" || wA[key]["value"] == "False") {
          paramValue = false;
        };
        this.widgetForm.patchValue({
          widget: {
            ST: paramValue
          }
        });
        $('#ST_ID').val(wA[key]["AnalyticWidgetParamId"]);
      }
      if (wA[key]["widgetParamCode"] == "TL") {
        this.widgetForm.patchValue({
          widget: {
            TL: wA[key]["value"]
          }
        });
        $('#TL_ID').val(wA[key]["AnalyticWidgetParamId"]);
      }
      if (wA[key]["widgetParamCode"] == "FS") {
        this.widgetForm.patchValue({
          widget: {
            FS: wA[key]["value"]
          }
        });
        $('#FS_ID').val(wA[key]["AnalyticWidgetParamId"]);
      }
      if (wA[key]["widgetParamCode"] == "WD") {
        //this.colClassId= +wA[key]["id"];
        this.colClassId = +wA[key].AnalyticWidgetParamId;
        this.widgetForm.patchValue({
          widget: {
            WD: wA[key]["value"]
          }
        });
        $('#WD_ID').val(wA[key]["AnalyticWidgetParamId"]);
      }
      if (wA[key]["widgetParamCode"] == "ROW") {
        this.widgetForm.patchValue({
          widget: {
            ROW: wA[key]["value"]
          }
        });
        $('#ROW_ID').val(wA[key]["AnalyticWidgetParamId"]);
      }
      if (wA[key]["widgetParamCode"] == "POS") {
        this.widgetForm.patchValue({
          widget: {
            //must set from UI value
            POS: wA[key]["value"]
          }
        });
        $('#POS_ID').val(wA[key]["AnalyticWidgetParamId"]);
      }
      if (wA[key]["widgetParamCode"] == "POSY") {
        this.widgetForm.patchValue({
          widget: {
            //must set from UI value
            POSY: wA[key]["value"]
          }
        });
        $('#POSY_ID').val(wA[key]["AnalyticWidgetParamId"]);
      }
      if (wA[key]["widgetParamCode"] == "STL") {
        this.styleId = +wA[key].AnalyticWidgetParamId;
        this.widgetForm.patchValue({
          widget: {
            STL: wA[key]["value"]
          }
        });
        $('#STL_ID').val(wA[key]["AnalyticWidgetParamId"]);
      }
      if (wA[key]["widgetParamCode"] == "TYP") {
        this.typeId = +wA[key]["AnalyticWidgetParamId"];
        this.widgetForm.patchValue({
          widget: {
            TYP: wA[key]["value"]
          }
        });
        $('#TYP_ID').val(wA[key]["AnalyticWidgetParamId"]);
      }
      if (wA[key]["widgetParamCode"] == "ICN") {
        this.iconId = +wA[key].AnalyticWidgetParamId;
        this.widgetForm.patchValue({
          widget: {
            ICN: wA[key]["value"]
          }
        });
        $('#ICN_ID').val(wA[key]["AnalyticWidgetParamId"]);
      }
      if (wA[key]["widgetParamCode"] == "DS") {
        this.widgetForm.patchValue({
          widget: {
            DS: wA[key]["value"]
          }
        });
        $('#DS_ID').val(wA[key]["AnalyticWidgetParamId"]);
      }
      if (wA[key]["widgetParamCode"] == "XT") {
        this.widgetForm.patchValue({
          widget: {
            XT: wA[key]["value"]
          }
        });
        $('#XT_ID').val(wA[key]["AnalyticWidgetParamId"]);
      }
      if (wA[key]["widgetParamCode"] == "XV") {
        let paramValue: boolean = true;
        if (wA[key]["value"] == "false" || wA[key]["value"] == "False") {
          paramValue = false;
        };

        this.widgetForm.patchValue({
          widget: {
            XV: paramValue
          }
        });
        $('#XV_ID').val(wA[key]["AnalyticWidgetParamId"]);
      }
      if (wA[key]["widgetParamCode"] == "YV") {
        let paramValue: boolean = true;
        if (wA[key]["value"] == "false" || wA[key]["value"] == "False") {
          paramValue = false;
        };
        this.widgetForm.patchValue({
          widget: {
            YV: paramValue
          }
        });
        $('#YV_ID').val(wA[key]["AnalyticWidgetParamId"]);
      }
      if (wA[key]["widgetParamCode"] == "MIR") {
        this.widgetForm.patchValue({
          widget: {
            MIR: wA[key]["value"]
          }
        });
        $('#MIR_ID').val(wA[key]["AnalyticWidgetParamId"]);
      }
      if (wA[key]["widgetParamCode"] == "MAR") {
        this.widgetForm.patchValue({
          widget: {
            MAR: wA[key]["value"]
          }
        });
        $('#MAR_ID').val(wA[key]["AnalyticWidgetParamId"]);
      }
      if (wA[key]["widgetParamCode"] == "MIS") {
        this.widgetForm.patchValue({
          widget: {
            MIS: wA[key]["value"]
          }
        });
        $('#MIS_ID').val(wA[key]["AnalyticWidgetParamId"]);
      }
      if (wA[key]["widgetParamCode"] == "MAS") {
        this.widgetForm.patchValue({
          widget: {
            MAS: wA[key]["value"]
          }
        });
        $('#MAS_ID').val(wA[key]["AnalyticWidgetParamId"]);
      }
      if (wA[key]["widgetParamCode"] == "YT") {
        this.widgetForm.patchValue({
          widget: {
            YT: wA[key]["value"]
          }
        });
        $('#YT_ID').val(wA[key]["AnalyticWidgetParamId"]);
      }
    }

  }
  saveDashboardPosition() {
    let id = $('#dashboardList').val();
    if (DashboardConfigComponent.updateWidgetParamValueList != undefined && DashboardConfigComponent.updateWidgetParamValueList.length > 0) {
      this.widgetService.updateDashboardWidgetPosition(DashboardConfigComponent.updateWidgetParamValueList).subscribe(
        res => {
          // this.modelNotification.swalSuccess('Dashboar Widget position updated Successfully.');
          if (+id > 0) {
            this.loadEnable();
            this.getDashboardOnLoad(+id);
          }
          this.loadDisable();
          DashboardConfigComponent.updateWidgetParamValueList = []
        },
        error => {
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, "There is error in updating widget position!");
          this.loadDisable();
        });
    }

  }

  onDragEnd(id: number, code: string) {
    this.parentVariable = 55;

    this.currentWidgetId = id;
    this.currentWidgetCode = code;
    $('#currentFormWidgetCode').val(code);
    $('#widgetConfigStatus').val("tempWidget");

    this.submitButton = false;
    this.barWidgetForm = false;
    this.pieWidgetForm = false;
    this.gaugeMeterForm = false;
    this.lineWidgetForm = false;
    this.mapWidgetForm = false;
    this.directionMapForm = false;
    this.floatWidgetForm = false;
    this.labelWidgetForm = false;
    this.tableWidgetForm = false;
    this.treeViewForm = false;
    this.alarmForm = false;
    this.eventForm = false;
    this.containerForm = false;
    this.widgetService.getAnalyticWidgetAttByWidgetId(id).subscribe(
      res => {
        this.widgetAttributes = res;
        this.assignParameterToWidgetControl(this.widgetAttributes, id);
      },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, "There is error in  getting dashboard list!");

      });
  }

  onDragCanceled(event: DragEvent) {
  }


  global = global;

  lat: number = 21.4654309;
  lng: number = 77.7588319;
  mapStyles = {};

  // calendar
  viewDate: Date = new Date();
  events = [{
    start: subDays(startOfDay(new Date()), 1),
    end: addDays(new Date(), 1),
    title: 'A 3 day event',
    color: '#00acac'
  }, {
    start: startOfDay(new Date()),
    title: 'An event with no end date',
    color: '#ff5b57'
  }, {
    start: subDays(endOfMonth(new Date()), 3),
    end: addDays(endOfMonth(new Date()), 3),
    title: 'A long event that spans 2 months',
    color: '#348fe2'
  }, {
    start: addHours(startOfDay(new Date()), 2),
    end: new Date(),
    title: 'A draggable and resizable event',
    color: '#727cb6'
  }];

  MapResultByMarkerId: TestMapData[] = [];


  createUpdateText = "Create Dashboard";
  createUpdateSection = '';
  open(content, flag: string) {

    this.handlingExpandCollapse('sidebarActiveNull', "Click to Expand", "0px");
    this.callApiToWidgetResize(false);

    this.MapResultByMarkerId = [];
    if (flag == "create") {
      this.createUpdateText = "Create Dashboard";
      this.createUpdateSection = "create";
      this.modalService.open(content, { windowClass: 'modal-holder-class animate-section', centered: true, size: 'sm' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });

      this.dashboardForm.reset();
      this.dashboardForm.patchValue({
        isDefault: false
      })
      this.dashboardForm.patchValue({
        status: true
      })

      setTimeout(() => {
        $('.modal-backdrop.show').appendTo('.gridster-container')
      }, 30)


      // this.handlingExpandCollapse('createUpdateDashboard', "Click to Cancel", "23%");
      // this.callApiToWidgetResize(true);

    }
    else if (flag == "update") {
      var id = $('#dashboardList').val();
      if (id > 0) {
        this.createUpdateText = "Update Dashboard";
        this.createUpdateSection = "update";
        this.modalService.open(content, { windowClass: 'modal-holder-class animate-section', centered: true, size: 'sm' }).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });

        // this.handlingExpandCollapse('createUpdateDashboard', "Click to Cancel", "23%");
        // this.callApiToWidgetResize(true);

        this.dashboardForm.reset();

        setTimeout(() => {
          $('.modal-backdrop.show').appendTo('.gridster-container')
        }, 50)

        this.dashboardService.getdashboardDetailsByDashboardId(id).subscribe(
          res => {
            this.userDashboard = res;
            this.dashboardForm.patchValue({
              id: this.userDashboard.id
            })
            this.dashboardForm.patchValue({
              name: this.userDashboard.name
            })
            this.dashboardForm.patchValue({
              description: this.userDashboard.description
            })
            this.dashboardForm.patchValue({
              isDefault: this.userDashboard.isDefault
            })
            let status: boolean = true;
            if (this.userDashboard.status == "I") {
              status = false;
            }
            this.dashboardForm.patchValue({
              status: status
            })
          },
          error => {
            this.modelNotification.alertMessage(this.globalService.messageType_Fail, "There  is error in  getting dashboard information");

          });
      }
      else {
        this.modelNotification.swalWarning('Please Select Dashboard From The List To Update !');
      }

    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
  getDashboardListByBeId(id: number) {
    this.dashboardService.getNonDeletedDashboardListByBeId(id).subscribe(
      res => {
        if (res) {
          this.userDashboardList = res;
          this.selectedDashboardId = 0;
          this.selectedDashboardIdName = this.globalService.getDashboardSelectedName(this.userDashboardList, null);
          this.enableEditButton = false;
          this.userDashboardList.forEach(element => {
            if (element.isDefault) {
              this.loadEnable();
              this.selectedDashboardId = element.id;
              this.getDashboardOnLoad(element.id);
              this.checked = true;
              this.enableEditButton = true;
            }
          });
        }

      },
      error => {
        this.loadDisable();
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, "There is error in  getting dashboard List");

      });
  }
  getDashboardOnLoad(id: number) {
    this.layout = [];
    this.selectedDashboardDiv = true;
    if (+id > 0) {
      this.loadEnable();
      this.targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      this.widgetService.getWidgetDetailListByDashboardId(id, this.targetTimeZone).subscribe(
        res => {
          let widgetData = res["dashboardWidgets"];
          this.getFormatedWidgetParamInfoAndAddToContainer(widgetData);

        },
        error => {
          this.loadDisable();
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, "Unable to pull data of Dashboard Widget");
          // this.modelNotification.swalErrorInfo('Error','Unable to pull data of download');

        });
    }
    else {
      this.loadDisable();
      this.modelNotification.alertMessage(this.globalService.messageType_Fail, "Please select valid Dashboard for loading contents");
      // this.modelNotification.swalErrorInfo('Error','Please select valid dashboard for loading contents');
    }
  }
  getFormatedWidgetParamInfoAndAddToContainer(dashboardWidgetObject: Object[]) {
    let dashboardWidgets = [];
    for (let i = 0; i < dashboardWidgetObject.length; i++) {
      let tempObject = {};
      dashboardWidgets = dashboardWidgetObject[i]["params"];
      let interval = dashboardWidgetObject[i]["refreshInterval"];
      let dataService = dashboardWidgetObject[i]["dataService"];
      tempObject["id"] = dashboardWidgetObject[i]["id"];
      tempObject["analyticWidgetId"] = dashboardWidgetObject[i]["analyticWidgetId"];
      for (let j = 0; j < dashboardWidgets.length; j++) {
        let keyName = dashboardWidgets[j]["code"];
        let keyVal = dashboardWidgets[j]["value"];
        tempObject[keyName] = keyVal;
      }
      tempObject["DS"] = dataService;
      tempObject["RI"] = interval;

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
    this.layout = this.layout.sort((a, b) => a.id - b.id);
    this.loadDisable();
  }

  saveDashboard() {

    let userId = Number(sessionStorage.getItem("userId"));
    let beId = Number(sessionStorage.getItem("beId"));
    this.dashboard = <Dashboard>this.dashboardForm.value;
    if (this.dashboardForm.value.status) {
      this.dashboard.status = "A";
    } else {
      this.dashboard.status = "I";
    }
    this.dashboard.businessEntityId = +beId;
    this.dashboard.createdBy = userId;
    if (this.dashboard.id == null) {
      if (this.dashboardForm.valid) {
        this.dashboardService.addDashboard(this.dashboard)
          .subscribe(
            res => {
              //reLoad list after addition
              this.dashboardService.getNonDeletedDashboardListByBeId(+beId).subscribe(
                res => {
                  this.userDashboardList = res;
                  this.selectedDashboardId = 0;
                  let newlyAdded = this.userDashboardList[0];
                  this.loadEnable();
                  this.selectedDashboardId = newlyAdded.id;
                  this.selectedDashboardIdName = newlyAdded.name
                  this.getDashboardOnLoad(newlyAdded.id);
                  this.checked = true;

                  this.handlingExpandCollapse('sidebarActiveNull', "Click to Widgets", "0px");
                  this.callApiToWidgetResize(true);

                },
                error => {
                  this.loadDisable();
                  this.modelNotification.alertMessage(this.globalService.messageType_Fail, "There is error in  getting dashboard List");
                  this.handlingExpandCollapse('sidebarActiveNull', "Click to Widgets", "0px");
                  this.callApiToWidgetResize(true);

                });
              this.dashboardForm.reset();
              this.modalService.dismissAll('dismiss');
              this.modelNotification.swalSuccess('Dashboard workspace Created Successfully.');

              this.handlingExpandCollapse('sidebarActiveNull', "Click to Widgets", "0px");
              this.callApiToWidgetResize(true);

            },
            error => {
              this.modalService.dismissAll('dismiss');
              this.modelNotification.alertMessage(this.globalService.messageType_Fail, "Unable to create Dashboard");
              // this.modelNotification.swalErrorInfo('Error','Unable to create Dashboard');
              this.handlingExpandCollapse('sidebarActiveNull', "Click to Widgets", "0px");
              this.callApiToWidgetResize(true);
            });
      }

    }
    else {
      if (this.dashboardForm.valid) {
        this.dashboardService.updateDashboard(this.dashboard)
          .subscribe(
            res => {
              //reLoad list after addition
              let id = $('#dashboardList').val();
              // this.dashboardChange(id);
              //this.getDashboardListByBeId(+beId);
              // this.getDashboardOnLoad(+id);
              this.dashboardForm.reset();
              this.modalService.dismissAll('dismiss');
              // this.modelNotification.swalSuccess('Dashboard Updated Successfully.');

              this.handlingExpandCollapse('sidebarActiveNull', "Click to Widgets", "0px");
              this.callApiToWidgetResize(true);

            },
            error => {
              this.getDashboardListByBeId(+beId);
              this.dashboardForm.reset();
              this.modalService.dismissAll('dismiss');
              this.modelNotification.alertMessage(this.globalService.messageType_Fail, "Unable to Update Dashboard");
              // this.modelNotification.swalErrorInfo('Error','Unable to update Dashboard');
              this.handlingExpandCollapse('sidebarActiveNull', "Click to Widgets", "0px");
              this.callApiToWidgetResize(true);
            });
      }
    }
  }
  getWidgetListByUserId(status: string) {
    this.widgetService.getWidgetListByUserId(status)
      .subscribe(
        res => {
          this.widgetList = res;
        },
        error => {
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, "There was an error while retrieving Analytic Widget List!");

        });
  }
  // @ViewChild(MatPaginator) paginator: MatPaginator;

  getSelectedWidgetFormInfoByWidgetId(widgetId: number) {
    this.widgetService.getWidgetDetailByWidgetId(widgetId).subscribe(
      res => {
        this.widgetFormData = res;
      },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, "There was an error while retrieving widget form info!");

      });
  }
  changeMessage(text: string) {
    //alert(text);
  }

  widgetRemove(id: number, status: any, index: number) {
    this.currentWidgetId = id;
    this.deleteFlag = "widget"
    this.deleteWidgetIndex = index;
    this.deleteWidgetStatus = status;
    if (id > 0) {
      this.modelNotification.swalDanger('You will not be able to recover this Widget!');
    }
  }
  dashboardRemove() {
    let id = $('#dashboardList').val();
    this.deleteFlag = "dashboard"
    if (id < 1) {
      this.modelNotification.swalWarning('Invalid Dashboard Id, Please select dashboard from the list to delete !');
    }
    else {
      this.modelNotification.swalDanger('You will not be able to recover this Dashboard and associated Widgets!');
    }
  }
  deleteObject() {
    let userId = sessionStorage.getItem("userId");
    if (this.deleteFlag == "widget") {
      if (this.deleteWidgetStatus == "tempWidget") {
        this.layout.splice(this.deleteWidgetIndex, 1);
        // this.modelNotification.swalSuccess('Widget Deleted Successfully.');
        this.handlingExpandCollapse('sidebarActiveNull', "Click to Widgets", "0px");
        this.callApiToWidgetResize(false);
      } else {
        this.widgetService.deleteDashboardWidget(+this.currentWidgetId, +userId).subscribe(
          res => {
            this.remove = !this.remove;
            this.getDashboardOnLoad(+ $('#dashboardList').val());
            // this.modelNotification.swalSuccess('Widget Deleted Successfully.');
            this.handlingExpandCollapse('sidebarActiveNull', "Click to Widgets", "0px");
            this.callApiToWidgetResize(false);
          },
          error => {
            this.modelNotification.alertMessage(this.globalService.messageType_Fail, "Unable to delete Dashboard Widget.");
            // this.modelNotification.swalErrorInfo('Error','Unable to delete dashboard widget!');
            this.handlingExpandCollapse('sidebarActiveNull', "Click to Widgets", "0px");
            this.callApiToWidgetResize(false);
          });
      }
    }
    if (this.deleteFlag == "dashboard") {
      let id = $('#dashboardList').val();
      this.dashboardService.deleteDashboard(+id, +userId).subscribe(
        res => {
          this.layout = []
          let beId = sessionStorage.getItem("beId");
          this.userDashboardList = [];
          this.getDashboardListByBeId(+beId);
          // let selectedDashboard = $('#dashboardList').val();
          // if (+selectedDashboard > 0 && +selectedDashboard != +id) {
          //   this.getDashboardOnLoad(+selectedDashboard);
          // }
          // this.modelNotification.swalSuccess('Dashboard Deleted Successfully.');
          this.handlingExpandCollapse('sidebarActiveNull', "Click to Widgets", "0px");
          this.callApiToWidgetResize(true);
        },
        error => {
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, "Unable to delete dashboard.");
          this.handlingExpandCollapse('sidebarActiveNull', "Click to Widgets", "0px");
          this.callApiToWidgetResize(true);
        });
    }
    this.deleteFlag = "";
  }


  loadEnable() {
    this.showLoaderImage = true;
    this.isDisabled = true;
  }
  loadDisable() {
    this.showLoaderImage = false;
    this.isDisabled = false;
  }
  bindWidgetData(event: Event) {
    //alert(JSON.stringify(event))
    let newData = {};
  }

  // Reset dashboard form
  resetDashboardForm() {
    this.dashboardResetFlag = true;
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes.');
  }

  //reset widgetform
  onClickResetWidgetForm() {
    this.dashboardResetFlag = false;
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes.');
  }
  // Form reset  confirm
  formResetConfirm() {
    if (this.dashboardResetFlag) {
      let id = this.dashboardForm.value.id
      if (id == null) {
        this.dashboardForm.reset();
        this.dashboardForm.patchValue({
          isDefault: false
        })
        this.dashboardForm.patchValue({
          status: true
        })
      } else {
        this.dashboardForm.patchValue({
          name: this.userDashboard.name
        })
        this.dashboardForm.patchValue({
          description: this.userDashboard.description
        })
        this.dashboardForm.patchValue({
          isDefault: this.userDashboard.isDefault
        })
        let status: boolean = true;
        if (this.userDashboard.status == "I") {
          status = false;
        }
        this.dashboardForm.patchValue({
          status: status
        })
      }
    } else {
      this.resetWidgetForm()
    }
  }

  onActiveClick() {
    let status = this.dashboardForm.value.status
    if (!status) {
      this.dashboardForm.patchValue({
        isDefault: false
      })
    }
  }

  onDefaultClick() {
    let isDefault = this.dashboardForm.value.isDefault
    if (isDefault) {
      this.dashboardForm.patchValue({
        status: true
      })
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.newInnerHeight = event.target.innerHeight;
    this.newInnerWidth = event.target.innerWidth;
  }


  // collapse and expand and for form cancel =======
  sidebarExpandCollapseText = "Click to Expand";

  // sidebar widges clicks
  displayWidgets = "Click to Widgets";

  toggleSidebar(clickAction) {
    if (clickAction == 'openArrowClick' || clickAction == 'widgetClick') {
      this.handlingExpandCollapse('widgets', "Click to Collapse", "23%");
      this.callApiToWidgetResize(true);
    } else if (clickAction == 'closeArrowClick') {
      this.handlingExpandCollapse('sidebarActiveNull', "Click to Expand", "0px");
      this.callApiToWidgetResize(false);
    }

    this.callApiWidgetResize = true;
  }


  // Handling sidebar expand and collapse
  handlingExpandCollapse(sidebarActive, sidebarExpandCollapseText, animateWidthExpandCollapse) {
    this.sidebarActive = sidebarActive;
    this.sidebarExpandCollapseText = sidebarExpandCollapseText;
    document.getElementById('widget-container').style.width = animateWidthExpandCollapse;
  }

  // When making expand and collapse call api to get all the widgets
  callApiToWidgetResize(resizeStatus) {
    this.sharedData.changeMessage(resizeStatus);
    this.options.api.resize();
  }

  // Cancel setting configuration
  CancelForm() {
    this.handlingExpandCollapse('sidebarActiveNull', "Click to Expand", "0px");
    this.callApiToWidgetResize(false);
  }
  onDraggableCopied(event) { }
  onDraggableLinked(event) { }

  onDraggableMoved(event) { }


}



