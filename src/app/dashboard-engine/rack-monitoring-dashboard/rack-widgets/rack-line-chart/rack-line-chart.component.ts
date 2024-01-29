import { formatDate } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartComponent, ChartTheme, ILoadedEventArgs } from '@syncfusion/ej2-angular-charts';
import { Browser } from '@syncfusion/ej2-base';
import { UIModalNotificationPage } from 'global';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
//import { EJComponents } from '@syncfusion/ej2-angular-base';
import { WidgetService } from '../../../services/widget/widget.service';
import { ShareddataService } from '../../../shared/shareddata.service';

@Component({
  selector: 'app-rack-line-chart',
  templateUrl: './rack-line-chart.component.html',
  styleUrls: ['./rack-line-chart.component.css']
})
export class RackLineChartComponent implements OnInit {

  @ViewChild('chartLine', { static: false })
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
  @Input() tagId2
  @Input() tagId3
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
  newSeriesDataTemp: any;
  dataValuesTemp: any;
  tag1SeriesData: any[];
  tag2SeriesData: any[];
  tag3SeriesData: any[];
  url: string;

  refresCharts() {
  }


  constructor(private widgetService: WidgetService, private globalService: globalSharedService,
    private sharedData: ShareddataService) {

  };

  ngOnInit() {

    this.minSeg = this.minSegment
    this.maxSeg = this.maxSegment
    this.loadDataOnCall(this.DS, "init");
    this.widgetService.getTimeIntervalsFromFile().toPromise().then(data => {
      let interval = data.rackMonitorRefreshTimeInterval;
      this.inter = setInterval(() => {
        this.loadDataOnCall(this.DS, "auto")
      }, +interval);
    })

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
    // this.subscription.unsubscribe();
  }


  loadDataOnCall(ds: Object, loadType: string) {
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
    url = url + queryString;
      this.widgetService.getApiUrl().subscribe(data => {
        let api = data.api;
        url = api + url;
        if(!this.url){
          this.url = url
        }
        this.getdataSeriesByTagIds(this.tagId, this.tagId2, this.tagId3, 'lineChart', this.url);
      })


    // if (this.tagId3) {
    //   let tag3url = url + '&assetTagId=' + this.tagId3;
    //   this.widgetService.getApiUrl().subscribe(data => {
    //     let api = data.api;
    //     tag3url = api + tag3url;
    //     this.getDataByDataServiceUrl(tag3url, loadType, 3);
    //   })
    // }
    // this.tag3SeriesData = [{"x":1613519160000,"y":32.54834},{"x":1613519190000,"y":25.689396},{"x":1613519220000,"y":30.311605},{"x":1613519250000,"y":22.238811},{"x":1613519280000,"y":30.843609},{"x":1613519310000,"y":32.127655}]

    // this.tag2SeriesData = [{"x":1613519160000,"y":26.363638},{"x":1613519190000,"y":26.950943},{"x":1613519220000,"y":24.300158},{"x":1613519250000,"y":24.169918},{"x":1613519280000,"y":25.97376},{"x":1613519310000,"y":31.048567}]

    // this.tag1SeriesData = [{"x":1613519160000,"y":33.678375},{"x":1613519190000,"y":34.422497},{"x":1613519220000,"y":33.307842},{"x":1613519250000,"y":33.451694},{"x":1613519280000,"y":33.980946},{"x":1613519310000,"y":33.113647}]

    // this.tag1SeriesData = this.tag1SeriesData;
    // this.tag2SeriesData = this.tag2SeriesData;
    // this.tag3SeriesData = this.tag3SeriesData;
    //this.getDataByDataServiceUrl("http://10.225.10.26:8080/AssetManagementService/asset/datewisePvData/?targetTimeZone=Asia/Calcutta&assetTagId=3408&endDate=2020-05-26T13:09:32.252Z&startDate=2020-01-26T13:09:32.252Z",loadType);
  }


  getdataSeriesByTagIds(tagId: any, tagId2: any, tagId3: any, type: string, url) {
    this.widgetService.getWidgetTagDataByTagIds(tagId, tagId2, tagId3, url, type).subscribe(data => {
      if (data) {
        this.intializeLineChart()
        this.tag1SeriesData = this.getSeriesDataOfTag(data[this.tagId]);
        this.tag2SeriesData = this.getSeriesDataOfTag(data[this.tagId2]);
        this.tag3SeriesData = this.getSeriesDataOfTag(data[this.tagId3]);
        // this.tag1SeriesData =
      }
    })
  }

  getSeriesDataOfTag(resp){
    let seriesData;
    if(resp && resp.length){
      this.configValueDS = resp;
      this.localSeriesList = resp[0]["series"];
      this.localDateObject = resp[0]["name"];
      seriesData = this.convertDateTimeToInteger(this.localSeriesList, this.localDateObject);
    }
    return seriesData
  }

  getDataByDataServiceUrl(url: string, loadType: string, tagNum) {
    let seriesData
    this.widgetService.getDashboardWidgetDataByDataService(url, "lineChart").subscribe(resp => {
      if (resp.length > 0) {
        this.configValueDS = resp;
        this.localSeriesList = resp[0]["series"];
        this.localDateObject = resp[0]["name"];
        seriesData = this.convertDateTimeToInteger(this.localSeriesList, this.localDateObject);
        this.tag1SeriesData = seriesData
        if (this.tagId2) {
          let tag2url = this.url + '&assetTagId=' + this.tagId2;
          this.widgetService.getApiUrl().subscribe(data => {
            let api = data.api;
            tag2url = api + tag2url;
            this.getDataByDataServiceUrlForTag2(tag2url, loadType, 2);
          })
        }
      }
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, "Unable to pull data of for linechart widget");
      })
  }


  getDataByDataServiceUrlForTag2(tag2url: string, loadType: string, tagNum: number) {
    this.widgetService.getDashboardWidgetDataByDataService(tag2url, "lineChart").subscribe(resp => {
      let seriesData
      if (resp.length > 0) {
        this.configValueDS = resp;
        this.localSeriesList = resp[0]["series"];
        this.localDateObject = resp[0]["name"];
        seriesData = this.convertDateTimeToInteger(this.localSeriesList, this.localDateObject);
        this.tag2SeriesData = seriesData
        if (this.tagId3) {
          let tag3url = this.url + '&assetTagId=' + this.tagId3;
          this.widgetService.getApiUrl().subscribe(data => {
            let api = data.api;
            tag3url = api + tag3url;
            this.getDataByDataServiceUrlForTag3(tag3url, loadType, 3);
          })
        }
      }
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, "Unable to pull data of for linechart widget");
      })
  }


  getDataByDataServiceUrlForTag3(tag3url: string, loadType: string, tagNum: number) {
    this.widgetService.getDashboardWidgetDataByDataService(tag3url, "lineChart").subscribe(resp => {
      let seriesData
      if (resp.length > 0) {
        this.configValueDS = resp;
        this.localSeriesList = resp[0]["series"];
        this.localDateObject = resp[0]["name"];
        this.tag3SeriesData = this.convertDateTimeToInteger(this.localSeriesList, this.localDateObject);
        this.intializeLineChart();
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


  // public title: string = 'Annual Mean Rainfall for Australia';



  convertDateTimeToInteger(dataSource: any[], date: object) {
    let dateString = date;
    let seriesData = [];
    dataSource.forEach(element => {
      let xV = 0;
      let yV = 0;
      let newObject = {};
      let time = element["name"];
      let FinalDate = new Date(date + ' ' + time).getTime();
      xV = FinalDate;
      yV = +element["value"];
      newObject = { x: xV, y: yV }
      seriesData.push(newObject)
    });
    console.log(JSON.stringify(seriesData))
    return seriesData;
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

}
