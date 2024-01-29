import { formatDate } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { ChartComponent, ChartTheme, ILoadedEventArgs } from '@syncfusion/ej2-angular-charts';
import { Browser } from '@syncfusion/ej2-base';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { WidgetService } from '../../../services/widget/widget.service';
import { ShareddataService } from '../../../shared/shareddata.service';
import { UIModalNotificationPage } from 'global';

@Component({
  selector: 'app-nge-chart-linezone',
  templateUrl: './nge-chart-linezone.component.html',
  styleUrls: ['./nge-chart-linezone.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NgeChartLinezoneComponent implements OnInit, OnDestroy {
  @ViewChild('chartLine')
  public chart: ChartComponent;
  newSeriesData: any[];
  @Input() chartType;
  @Input() dwId;
  @Input() DC: boolean;
  configValueDS: [];
  @Input() finalDataArray;
  Segment
  @Input() maxSegment;
  @Input() minSegment;
  @Input() maxRange;
  @Input() minRange;
  //@Input() widgetTitle;
  @Input() xAxisLabel;
  @Input()
  DS;
  @Input() yAxisLabel;
  htmlToAdd;
  gaugeConfigValue: any
  gmId: any;
  @Input() tagName;
  @Input() tagId;

  //title:string;
  //legend:string;
  @ViewChild(UIModalNotificationPage) modelNotification;
  localSeriesList: any[];
  localDateObject: {};
  xTitle: string;//= @Input() xAxisLabel;
  yTitle: string;
  series1: any;
  //public tooltip: Object;
  public marker: Object;
  public zoomSettings: Object;
  //public chartArea:Object;
  public primaryYAxis: Object;
  public primaryXAxis: Object;
  public segments: Object;
  public animation: Object;
  @Input() RI;
  @Input() origin;
  @Input() refreshGraph;
  targetTimeZone: string;
  da: boolean;
  inter: NodeJS.Timeout;
  minSeg: string;
  maxSeg: string;
  subscription: any;
  refresCharts() {
    //const intervalRefresh = setInterval( ()=>{this.getNewSeries(+this.dwId,this.dsId)},45000);
  }
  //private autoRefreshInterval: number = window.setInterval( ()=>{this.getNewSeries(+this.dwId,this.dsId)},45000);

  ngOnInit() {

    this.subscription =  this.sharedData.getChangedMessage().subscribe(message => {
        this.loadDataOnCall(this.DS, "auto");
    })
    this.minSeg = this.minSegment
    this.maxSeg = this.maxSegment
    this.loadDataOnCall(this.DS, "init");
    if (this.origin == "UD") {
      if (typeof this.RI !== 'undefined') {
        this.inter = setInterval(() => {
          this.loadDataOnCall(this.DS, "auto")
        }, +this.RI * 1000);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.refreshGraph) {
      if (changes.refreshGraph.currentValue != changes.refreshGraph.previousValue) {
            //this.loadDataOnCall(this.DS, "auto")
      }
    }
  }
  intializeLineChart() {
    if (typeof this.chartType === 'undefined') {
      this.chartType = "Spline";
    }
    this.setMinMaxRange();
    this.dataValues = this.newSeriesData;
    this.zoomSettings = {
      mode: 'X',
      enableMouseWheelZooming: true,
      enablePinchZooming: true,
      enableSelectionZooming: true,
      enableScrollbar: true
    };

    if (this.minSeg === "null") {
      //alert(this.maxSegment);
      // alert(this.minSeg);
      this.segments = [{
        value: 69,
        color: '#0000FF'
      }, {
        value: +this.maxSegment,
        color: '#03A712'
      },

      {
        color: '#FF0000'
      }];
    }
    if (this.maxSeg === "null") {
      this.segments = [{
        value: +this.minSegment,
        color: '#0000FF'
      },
      {
        color: '#03A712'
      }];
    }
    else if (this.maxSeg !== "null" && this.minSeg !== "null") {
      //alert(this.minSegment +' Both');
      this.segments = [{
        value: +this.minSegment,
        color: '#0000FF'
      }, {
        value: +this.maxSegment,
        color: '#03A712'
      },
      {
        color: '#FF0000'
      }];
    }

    this.primaryXAxis = {

      title: this.xAxisLabel,
      valueType: 'DateTime',
      skeleton: 'hm',
      edgeLabelPlacement: 'Shift',
      majorGridLines: { width: 0 }

    };
  }
  ngOnDestroy() {
    clearInterval(this.inter);
    this.subscription.unsubscribe();
  }
  loadDataOnCall(ds: Object, loadType: string) {
    if(ds){
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
      }else{
        this.da = true;
        this.localSeriesList = [{name: "00:02:26", value: "63.2"},
          {name: "00:05:33", value: "63.2"},
          {name: "00:08:33", value: "63.4"},
          {name: "00:11:41", value: "62.9"},
          {name: "00:14:45", value: "62.7"},
          {name: "00:17:46", value: "63.1"},
          {name: "00:20:54", value: "63.1"},
          {name: "00:24:01", value: "62.9"},
          {name: "00:27:13", value: "63.1"},
          {name: "00:30:13", value: "63.2"}]
          this.localDateObject = "2020-07-22"
          this.convertDateTimeToInteger(this.localSeriesList, this.localDateObject);
          this.intializeLineChart();
          if (loadType == "init") {
            this.dataValues = this.newSeriesData;
          }
      }
    }else{
      if(this.tagId && this.tagName){
        this.targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        let queryString = "?targetTimeZone=" + this.targetTimeZone;
        let dayDiff = 0;
        let todayDate = new Date();
        let url = 'AssetManagementService/asset/datewisePvData'
        let endDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
        let startDate = todayDate.setDate(todayDate.getDate() - dayDiff);
        let startDateN = formatDate(startDate, 'yyyy-MM-dd', 'en');// new Date(startDate)
        let currentTime = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds() + ':' + new Date().getMilliseconds() + 'Z';
        let startTime = "00:00:00:000Z";
        queryString = queryString + '&endDate=' + endDate + 'T' + currentTime;
        queryString = queryString + '&startDate=' + startDateN + 'T' + startTime;
        url = url + queryString + '&assetTagId='+this.tagId;
        this.widgetService.getApiUrl().subscribe(data => {
          let api = data.api;
          url = api + url;
          this.getDataByDataServiceUrl(url, loadType);
        })
      }
    }


    //this.getDataByDataServiceUrl("http://10.225.10.26:8080/AssetManagementService/asset/datewisePvData/?targetTimeZone=Asia/Calcutta&assetTagId=3408&endDate=2020-05-26T13:09:32.252Z&startDate=2020-01-26T13:09:32.252Z",loadType);
  }
  getDataByDataServiceUrl(url: string, loadType: string) {

    this.widgetService.getDashboardWidgetDataByDataService(url, "lineChart").subscribe(resp => {
      if (resp.length > 0) {
        this.da = true;
        this.configValueDS = resp;
        this.localSeriesList = resp[0]["series"];
        this.localDateObject = resp[0]["name"];
        this.convertDateTimeToInteger(this.localSeriesList, this.localDateObject);
        this.intializeLineChart();
        if (loadType == "init") {
          this.dataValues = this.newSeriesData;
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
  public dataValues: Object[] = [];
  public chartArea: Object = {
    border: {
      width: 0
    }
  };
  public width: string = Browser.isDevice ? '100%' : '100%';
  public legend: Object = { visible: false };

  public tooltip: Object = {
    enable: true
  };
  public load(args: ILoadedEventArgs): void {
    let selectedTheme: string = location.hash.split('/')[1];
    selectedTheme = selectedTheme ? selectedTheme : 'Material';
    args.chart.theme = <ChartTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, "Dark");
    if (selectedTheme === 'highcontrast') {
      args.chart.series[0].segments[0].color = '#FF0000';
      args.chart.series[0].segments[1].color = '#00FF00';
      args.chart.series[0].segments[2].color = '#0000FF';
    }
  };

  // public title: string = 'Annual Mean Rainfall for Australia';
  constructor(private widgetService: WidgetService, private globalService: globalSharedService,
    private sharedData: ShareddataService) {
    //code
  };
  convertDateTimeToInteger(dataSource: any[], date: object) {
    let dateString = date;
    this.newSeriesData = [];
    //console.log(JSON.stringify(dataSource));
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

      if (+strNumber >= 0) {
        return true;
      }
      else {
        return false;
      }
    }
  }
  bindDashboardWidgetData(event: Event) {

    //alert(JSON.stringify(event) + 'LineChart')
    let newData = {};
    this.dataValues = [{ "x": 978287400000, "y": 30 }, { "x": 978373800000, "y": 50 }, { "x": 978460200000, "y": 40 }, { "x": 978546600000, "y": 60 }, { "x": 978633000000, "y": 45 }];

  }
  setSegmentValue() {
    let ismirVal = this.checkValidNumber(this.minSegment);
    let ismarVal = this.checkValidNumber(this.maxSegment);
  }
  setMinMaxRange() {
    let ismirVal = this.checkValidNumber(this.minRange);
    let ismarVal = this.checkValidNumber(this.maxRange);

    if (ismirVal && ismarVal) {
      this.RI = Math.trunc(this.maxRange / 6);
      this.primaryYAxis = {
        title: this.yAxisLabel,
        valueType: 'Double',
        rangePadding: 'None',
        minimum: +this.minRange,
        maximum: +this.maxRange,
        interval: this.RI,
        lineStyle: { width: 1 },
        majorTickLines: { width: 0 }
      };
    }
    else {
      this.primaryYAxis = {
        title: this.yAxisLabel,
        valueType: 'Double',
        rangePadding: 'None',
        lineStyle: { width: 0 },
        majorTickLines: { width: 0 }
      };
    }
  }
}

