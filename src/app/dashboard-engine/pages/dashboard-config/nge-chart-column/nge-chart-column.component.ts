import { formatDate } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ChartComponent, ChartTheme, ILoadedEventArgs } from '@syncfusion/ej2-angular-charts';
import { Browser } from '@syncfusion/ej2-base';

import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { WidgetService } from '../../../services/widget/widget.service';
import { ShareddataService } from '../../../shared/shareddata.service';
import { UIModalNotificationPage } from 'global';

@Component({
  selector: 'app-nge-chart-column',
  templateUrl: './nge-chart-column.component.html',
  styleUrls: ['./nge-chart-column.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NgeChartColumnComponent implements OnInit, OnDestroy {
  @Input() xAxisLabel;

  @Input() yAxisLabel;

  dsSeries: any;
  //legend: string;
  newSeriesData: any[];
  @Input() chartType: string
  @Input() dwId;
  @Input() DS;
  @Input() DC: boolean;
  @Input() configValueDS: [];
  @Input() intervalRef;
  @Input() dsId;
  //title:string;
  legend: string;
  localSeriesList: any[];
  localDateObject: {};
  targetTimeZone: string;
  series1: any;
  public tooltip: Object;
  public zoomSettings: Object;
  public chartArea: Object;
  public primaryYAxis: Object;
  public primaryXAxis: Object;
  public animation: Object;
  interval: number;
  @ViewChild(UIModalNotificationPage) modelNotification;
  @Input() RI;
  @Input() origin;
  //public autoRefreshInterval: number = window.setInterval( ()=>{this.getNewSeries(+this.dwId,this.dsId)},45000);

  columnChartVisible: boolean;
  //@ViewChild('chartColumn') chart: any;
  @ViewChild('chartColumn')
  public chart: ChartComponent;
  da: boolean;
  inter: NodeJS.Timeout;
  subscription: any;
  constructor(private widgetService: WidgetService,
    private globalService: globalSharedService,
    private sharedData: ShareddataService) {
    //code
  };

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
        this.loadDataOnCall(this.DS, "auto");
    });
    this.initializationColumnChart();
  }
  ngOnDestroy() {
    clearInterval(this.inter);
    this.subscription.unsubscribe();
  }
  loadDataOnCall(ds: Object, loadType: string) {
    let url = ds["URL"];

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
            let todayDate = new Date();
            let endDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
            let startDate = todayDate.setDate(todayDate.getDate() - dayDiff);
            let startDateN = formatDate(startDate, 'yyyy-MM-dd', 'en');// new Date(startDate)
            let currentTime = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + ':' + new Date().getMilliseconds() + 'Z';
            let startTime = "00:00:00:000Z";
            queryString = queryString + '&endDate=' + endDate + 'T' + currentTime;
            queryString = queryString + '&startDate=' + startDateN + 'T' + startTime;
          }
        }
        else {
          queryString = queryString + '&' + params[k]["name"] + "=" + params[k]["value"];
        }

      }
      url = splitted + queryString;

      this.getDataByDataServiceUrl(url, loadType);
    } else {
      this.da = true;
      this.localSeriesList = [{ name: "00:02:26", value: "63.2" },
      { name: "00:05:33", value: "63.2" },
      { name: "00:08:33", value: "63.4" },
      { name: "00:11:41", value: "62.9" },
      { name: "00:14:45", value: "62.7" },
      { name: "00:17:46", value: "63.1" },
      { name: "00:20:54", value: "63.1" },
      { name: "00:24:01", value: "62.9" },
      { name: "00:27:13", value: "63.1" }];
      this.localDateObject = "2020-07-22";
      this.convertDateTimeToInteger(this.localSeriesList, this.localDateObject);
      this.initializationColumnChart();
      if (loadType == "init") {
        this.series1 = this.newSeriesData;
      }
    }


  }
  getDataByDataServiceUrl(url: string, loadType: string) {

    this.widgetService.getDashboardWidgetDataByDataService(url, "barChart").subscribe(resp => {
      if (resp.length > 0) {
        this.da = true;
        this.configValueDS = resp;
        this.localSeriesList = resp[0]["series"];
        this.localDateObject = resp[0]["name"];
        this.convertDateTimeToInteger(this.localSeriesList, this.localDateObject);
        this.initializationColumnChart();
        if (loadType == "init") {
          this.series1 = this.newSeriesData;
        }
        else {
          if (this.chart) {
            this.chart.series[0].dataSource = this.newSeriesData;
            this.chart.refresh();
          }
        }
      }
      else {
        //alert('no records');
        this.da = false;
      }

    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, "Unable to pull data of for linechart widget");
      })
  }
  initializationColumnChart() {
    this.setMinMaxRange();
    if (typeof this.chartType === 'undefined') {
      this.chartType = "Column";
    }
    this.columnChartVisible = true;
    this.tooltip = { enable: true };

    this.primaryXAxis = {
      title: this.xAxisLabel,
      valueType: 'DateTime',
      majorGridLines: { width: 0 },
      skeleton: 'hm',
      edgeLabelPlacement: 'Shift',
    };

    this.animation = { enable: false };
    this.zoomSettings = {
      mode: 'X',
      enableMouseWheelZooming: true,
      enablePinchZooming: true,
      enableSelectionZooming: true,
      enableScrollbar: true
    };
    this.chartArea = {
      border: {
        width: 0
      }
    };


  }
  //   primaryXAxis: Object = {

  //     title: this.xAxisLabel,
  //     valueType: 'DateTime',
  //     skeleton: 'yMMM',
  //     edgeLabelPlacement: 'Shift',
  //     majorGridLines: { width: 0 }
  // };
  // //Initializing Primary Y Axis



  // custom code start
  public width: string = Browser.isDevice ? '99%' : '99%';
  load(args: ILoadedEventArgs): void {
    alert('Load');
    let selectedTheme: string = location.hash.split('/')[1];
    selectedTheme = selectedTheme ? selectedTheme : 'Material';
    args.chart.theme = <ChartTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, "Dark");
    if (selectedTheme === 'highcontrast') {
      args.chart.series[0].marker.dataLabel.font.color = '#000000';
      args.chart.series[1].marker.dataLabel.font.color = '#000000';
      args.chart.series[2].marker.dataLabel.font.color = '#000000';
    }
  };
  bindDashboardWidgetData(event: Event) {
    this.columnChartVisible = false;

    // alert(JSON.stringify(event) + 'columnChart')
    this.series1 = [{ "x": 978287400000, "y": 30 }, { "x": 978373800000, "y": 50 }, { "x": 978460200000, "y": 40 }, { "x": 978546600000, "y": 60 }, { "x": 978633000000, "y": 45 }];

    this.chart.refresh()
    //alert(JSON.stringify(this.series1))
    this.columnChartVisible = true;
  }
  // custom code end
  public border: Object = { width: 1, color: '#00bdae' };
  //public title: string = 'Sales History of Product X';




  GetCrosshairData(): any {
    let series1: Object[] = [];
    let series2: Object[] = [];
    let point1: Object;
    let point2: Object;
    let value: number = 60;
    let value1: number = 50;
    let i: number;
    for (i = 1; i < 250; i++) {

      if (Math.random() > .5) {
        value += Math.random();
        value1 += Math.random();
      } else {
        value -= Math.random();
        value1 -= Math.random();
      }
      point1 = { x: new Date(2000, i, 1), y: value };
      point2 = { x: new Date(2000, i, 1), y: value1 };
      series1.push(point1);
      series2.push(point2);
    }
    return { 'series1': series1, 'series2': series2 };
  }
  GetScatterData(): any {
    let series1: Object[] = [];
    let series2: Object[] = [];
    let point1: Object;
    let value: number = 80;
    let value1: number = 70;
    let i: number;
    for (i = 1; i < 120; i++) {
      if (Math.random() > 0.5) {
        value += Math.random();
      } else {
        value -= Math.random();
      }
      value = value < 60 ? 60 : value > 90 ? 90 : value;
      point1 = { x: (145 + (i / 3)).toFixed(1), y: value.toFixed(1) };
      series1.push(point1);
    }
    for (i = 1; i < 120; i++) {
      if (Math.random() > 0.5) {
        value1 += Math.random();
      } else {
        value1 -= Math.random();
      }
      value1 = value1 < 60 ? 60 : value1 > 90 ? 90 : value1;
      point1 = { x: (145 + (i / 3)).toFixed(1), y: value1.toFixed(1) };
      series2.push(point1);
    }
    return { 'series1': series1, 'series2': series2 };
  }
  GetLocalData(): any {
    let series1: Object[] = [];
    let series2: Object[] = [];
    let point1: Object;
    let point2: Object;
    let value: number = 80;
    let value1: number = 90;
    let i: number;
    for (i = 1; i < 500; i++) {

      if (Math.random() > .5) {
        value += Math.random();
        value1 += Math.random();
      } else {
        value -= Math.random();
        value1 -= Math.random();
      }
      point1 = { x: new Date(1960, (i + 1), i), y: Math.round(value) };
      point2 = { x: new Date(1960, (i + 1), i), y: Math.round(value1) };
      series1.push(point1);
      series2.push(point2);
    }
    return { 'series1': series1, 'series2': series2 };
  }
  GetZoomingData(): any {
    let newSeriesData: Object[] = [];
    let point1: Object;
    let value: number = 80;
    let i: number;
    for (i = 1; i < 500; i++) {
      if (Math.random() > .5) {
        value += Math.random();
      } else {
        value -= Math.random();
      }
      point1 = { x: new Date(1950, i + 2, i), y: value.toFixed(1) };
      newSeriesData.push(point1);
    }
    return { 'series1': newSeriesData };
  }
  GetPolarSplineData(): any {
    let cardData: Object[] = [];
    let biDirData: Object[] = [];
    let omniDirData: Object[] = [];
    let point1: Object;
    let point2: Object;

    for (let x: number = -180; x < 180; x++) {
      point1 = { x: x, y: -12.6 * (1 - Math.cos(x * 3.14 / 180)) };
      cardData.push(point1);
      point2 = { x: x, y: -3 };
      omniDirData.push(point2);
    }

    for (let x: number = -180; x < -90; x++) {
      point1 = { x: x, y: -26 * (1 + Math.cos(x * 3.14 / 180)) };
      biDirData.push(point1);
    }

    for (let x: number = -90; x < 90; x++) {
      point1 = { x: x, y: -26 * (1 - Math.cos(x * 3.14 / 180)) };
      biDirData.push(point1);
    }

    for (let x: number = 90; x < 180; x++) {
      point1 = { x: x, y: -26 * (1 + Math.cos(x * 3.14 / 180)) };
      biDirData.push(point1);
    }
    return { 'series1': cardData, 'series2': omniDirData, 'series3': biDirData };
  }

  convertDateTimeToInteger(dataSource: any[], date: object) {
    let dateString = date;
    this.newSeriesData = [];
    dataSource.forEach(element => {
      let xV = 0;
      let yV = 0;
      let newObject = {};

      let time = element["name"];
      let FinalDate = new Date(date + ' ' + time).getTime();
      xV = FinalDate;

      yV = +element["value"];

      newObject = { x: xV, y: yV }
      this.newSeriesData.push(newObject)

    });
  }
  checkValidNumber(strNumber: string): boolean {
    if (strNumber === undefined) {
      return false;
    }
    else {
      //strNumber.trim();
      if (+strNumber >= 0) {
        return true;
      }
      else {
        return false;
      }
    }
  }
  setMinMaxRange() {
    this.primaryYAxis = {
      title: this.yAxisLabel,
      valueType: 'Double',
      rangePadding: 'None',
      lineStyle: { width: 0 },
      majorTickLines: { width: 0 }
    };

  }
}

