import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CircularGaugeComponent } from '@syncfusion/ej2-angular-circulargauge';
import { GaugeTheme, ILoadedEventArgs, IPointerDragEventArgs } from '@syncfusion/ej2-circulargauge';
import { UIModalNotificationPage } from 'global';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { WidgetService } from '../../../services/widget/widget.service';
import { ShareddataService } from '../../../shared/shareddata.service';

@Component({
  selector: 'app-nge-gauge',
  templateUrl: './nge-gauge.component.html',
  styleUrls: ['./nge-gauge.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NgeGaugeComponent implements OnInit, OnDestroy {
  @ViewChild('circulargauge')
  public circulargauge: CircularGaugeComponent;
  pValue: number = 90;
  @Input() minRange;
  @Input() maxRange;
  @Input() title: string;
  @Input() styleName;
  ITooltipRenderEventArgs;
  IPointerDragEventArgs
  minimum: number;
  maximum: number;
  @Input() DC: boolean;
  @Input() DS;
  public legendSettings: Object;
  configValueLegend: string;
  targetTimeZone: string;
  da: boolean;
  annotationVal: number;
  subscription: any;
  constructor(private widgetService: WidgetService,
     private globalService: globalSharedService,  private sharedData: ShareddataService) { }

  public content: string = '<div style="font-size: 16px;color:#5D5D5D;font-weight: 400;font-style: oblique;"><span>';
  public needleVal: number;
  public needleUnit: string;
  public labelStyle: Object;
  public lineStyle: Object;
  public majorTicks: Object;
  public minorTicks: Object;
  public cap: Object;
  public needleTail: Object;
  public animation: Object;
  public tooltip: Object;
  public pointers: Object;
  public annotaions: Object;
  public ranges: Object;
  @Input() origin;
  public gaugeLabelText: string;
  @Input() RI;
  inter: NodeJS.Timeout;
  @ViewChild(UIModalNotificationPage) modelNotification;

  ngOnInit() {

    this.loadDataOnCall(this.DS, "init");

    if (this.origin == "UD") {
      if (typeof this.RI !== 'undefined') {
        this.inter = setInterval(() => {
          this.loadDataOnCall(this.DS, "auto")
        }, +this.RI * 1000);
      }
    }
     this.subscription =  this.sharedData.getChangedMessage().subscribe(message => {
      // if (message) {
      //   this.loadDataOnCall(this.DS, "auto")
      // }
      if(this.circulargauge){
        this.loadDataOnCall(this.DS, "auto")
      }

    })

  }
  ngOnDestroy() {
    clearInterval(this.inter);
    this.subscription.unsubscribe();
  }
  loadDataOnCall(ds: Object, loadType: string) {
    let url = ds["URL"];
    //debugger;
    if (url != undefined) {
      var splitted = url.replace("{paramString}", "")

      let params = ds["params"];
      this.targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      let queryString = "?targetTimeZone=" + this.targetTimeZone;
      let dayDiff = 0;
      for (let k = 0; k < params.length; k++) {

        if (params[k]["name"] == "dayDiff" || params[k]["name"] == "currentDate") {
          if (params[k]["name"] == "currentDate") {
            //do nothing right now..
          }
          else {
            dayDiff = +params[k]["value"];
            let endDate = new Date();
            let startDate = endDate.setDate(endDate.getDate() - dayDiff);
            let startDateN = new Date(startDate)
            queryString = queryString + '&endDate=' + endDate.toISOString();
            queryString = queryString + '&startDate=' + startDateN.toISOString();
          }
        }
        else {
          queryString = queryString + '&' + params[k]["name"] + "=" + params[k]["value"];
        }
      }
      url = splitted + queryString;

      this.getDataByDataServiceUrl(url, loadType);
    }else{
      this.da = true;
      this.configValueLegend = "2020-07-22 15:46:52";
      this.annotationVal = 63.3;
      this.needleVal = 63.3;
      this.needleUnit = "";
      if (loadType == "init") {
        this.intializeGaugeMeter();
      }
    }

  }
  getDataByDataServiceUrl(url: string, loadType: string) {

    this.widgetService.getDashboardWidgetDataByDataService(url, "gaugeMeter").subscribe(resp => {
      if (resp.length > 0) {
        this.da = true;
        this.configValueLegend = resp[0]["name"];
        var valueGauge = resp[0]["value"].split(" ", 2);
        this.annotationVal = +valueGauge[0];
        this.needleVal = valueGauge[0];
        if (valueGauge[1] == undefined) {
          this.needleUnit = "";
        }
        else {
          this.needleUnit = valueGauge[1];
        }
        if (loadType == "init") {
          this.intializeGaugeMeter();
        }
        else {
          //debugger;
          this.intializeGaugeMeter();
          if(this.circulargauge){
            // this.circulargauge.refresh();
          }

        }

      }
      else {
        this.da = false;
      }
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, "Unable to pull data of for linechart widget");
      })
  }
  intializeGaugeMeter() {

    this.minimum = this.minRange;
    this.maximum = this.maxRange;
    this.annotationVal
    this.legendSettings = {
      visible: true,
      toggle: false,
      position: 'Bottom',
      legendText: this.configValueLegend
    }
    this.annotaions = [{
      content: '<div style="color:#5D5D5D; font-family:Roboto; font-size:14px;font-style: oblique;">' + this.annotationVal + '' + this.needleUnit + ' </div>',
      angle: 180,
      radius: '25%',
      zIndex: '100'
    }];

    this.ranges = [{
      //content:'<div style="color:#757575; font-family:Roboto; font-size:14px;">Multiple Needles</div>',
      start: 0, end: +this.needleVal, color: '#3BCEAC', width: 20, radius: '57%', legendText: this.configValueLegend, colorText: '#00FF00'
    }];
    this.pointers = [{
      radius: '80%',
      enablePointerDrag: false,
      value: +this.needleVal,
      markerWidth: 5,
      markerHeight: 5,
      animation: { enable: true, duration: 1500 },
      tooltip: {
        type: ['Pointer', 'Range'],
        enable: true,
        enableAnimation: false,
        legendText: 'test'
      },
      color: '#5D5D5D',
      pointerWidth: 10,
      cap: {
        radius: 9,
        color: 'white',
        border: {
          color: '#5D5D5D',
          width: 3
        }
      },
      needleTail: {
        length: '20%',
        color: '#5D5D5D'
      }
    }];

    // Initialize objects
    this.lineStyle = {
      width: 10,
      color: '#01AEBE'
    };
    this.majorTicks = {
      interval: 10,
      color: '#01AEBE',
      height: 13,
      width: 2
    };
    this.minorTicks = {
      interval: 5,
      position: 'Inside',
      color: '#3BCEAC',
      height: 5,
      width: 2
    };
    this.labelStyle = {
      tooltip: {
        enable: true,
        enableAnimation: false
      },
      format: '{value}' + this.needleUnit
    };

    this.legendSettings = {
      visible: true,
      position: 'Bottom'
    }
    this.tooltip = {
      type: ['Pointer', 'Range'],
      enable: true,
      enableAnimation: false
    };


  }
  public load(args: ILoadedEventArgs): void {

    let selectedTheme: string = location.hash.split('/')[1];
    selectedTheme = selectedTheme ? selectedTheme : 'Material';
    args.gauge.theme = <GaugeTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1));
  }

  public dragEnd(args: IPointerDragEventArgs): void {
    // if (args.currentValue >= 0 && args.currentValue <= 50) {
    //     args.pointer.color = '#3A5DC8';
    //     args.pointer.cap.border.color = '#3A5DC8';
    // } else {
    //     args.pointer.color = '#33BCBD';
    //     args.pointer.cap.border.color = '#33BCBD';
    // }
    // args.pointer.value = args.currentValue;
    // args.pointer.animation.enable = false;
    this.circulargauge.refresh();
  }
  ngAfterViewInit() {

    //this.circulargauge.setAnnotationValue(0, 0, this.content + this.configValue.value + ' </span></div>');
    // this.circulargauge.enablePointerDrag=false;
  }
  panelReload() {
    alert('test')
    this.loadDataOnCall(this.DS, "init");
  }
}
