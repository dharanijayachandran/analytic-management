import { formatDate } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AccumulationChart, AccumulationChartComponent, AccumulationTheme, IAccLoadedEventArgs } from '@syncfusion/ej2-angular-charts';
import { WidgetService } from '../../../services/widget/widget.service';

@Component({
  selector: 'app-nge-chart',
  templateUrl: './nge-chart.component.html',
  styleUrls: ['./nge-chart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NgeChartComponent implements OnInit {
  newSeriesData: any[] = [];
  @Input() chartType;
  @Input() DS;
  @Input() title;
  localSeriesList: [];
  localDateObject: {};
  targetTimeZone: string;
  // custom code end
  public center: Object = { x: '50%', y: '50%' };
  public startAngle: number = 0;
  public endAngle: number = 360;
  public explode: boolean = true;
  public enableAnimation: boolean = false;
  public tooltip: Object = { enable: true };
  //Initializing Legend
  public legendSettings: Object = {
    visible: false,
  };
  //Initializing Datalabel
  public dataLabel: Object = {
    visible: true,
    position: 'Inside', name: 'text',
    font: {
      fontWeight: '600'
    }
  };
  da: boolean;
  constructor(private widgetService: WidgetService,) {
    //code
  };
  @ViewChild('pie')
  public pie: AccumulationChartComponent | AccumulationChart;
  public animation: Object;
  ngOnInit() {
    this.loadDataOnCall(this.DS, "init");

    this.initializationFun();

  }
  public data: Object[]=[];




  initializationFun() {
    this.animation = {
      enable: false
    };
    this.center = { x: '50%', y: '40%' };
    this.startAngle = 0;
    this.endAngle = 360;
    this.explode = true;
    this.enableAnimation = false;
    this.tooltip = { enable: true };
  }


  // custom code start
  public load(args: IAccLoadedEventArgs): void {
    let selectedTheme: string = location.hash.split('/')[1];
    selectedTheme = selectedTheme ? selectedTheme : 'Material';
    args.accumulation.theme = <AccumulationTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, "Dark");
  };

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
      this.data = [{x: "00:00:30", y: 59.7, text: "59.7"},
      {x: "00:03:31", y: 59.5, text: "59.5"},
      {x: "00:05:45", y: 59.5, text: "59.5"},
      {x: "00:06:05", y: 59.5, text: "59.5"},
      {x: "00:09:06", y: 59.8, text: "59.8"},
      {x: "00:12:13", y: 59.6, text: "59.6"},
      {x: "00:15:15", y: 59.6, text: "59.6"},
      {x: "00:17:02", y: 59.5, text: "59.5"},
      {x: "00:20:03", y: 59.4, text: "59.4"},
      {x: "00:22:53", y: 59.5, text: "59.5"}];
      this.initializationFun();

    }


  }
  getDataByDataServiceUrl(url: string, loadType: string) {

    this.widgetService.getDashboardWidgetDataByDataService(url, "barChart").subscribe(resp => {
      if (resp.length > 0) {
        this.data = [];
        this.da = true;
        this.localSeriesList = resp[0]["series"];
        this.localDateObject = resp[0]["name"];
        this.initializationFun();
        this.convertDateTimeToInteger(this.localSeriesList, this.localDateObject);
        
        if (loadType == "init") {
        }
        else {
          this.pie.removeSvg();
          this.pie.refreshSeries();
          this.pie.refreshChart();
        }
      }
      else {
        //alert('no records');
        this.da = false;
      }

    },
      error => {
      })
  }
  convertDateTimeToInteger(dataSource: any[], date: object) {
    dataSource.forEach(element => {
      let newObject = {};
      let yV = +element["value"];
      let xV = element["name"];
      newObject = { 'x': xV, 'y': yV, text: ""+yV }
      this.data.push(newObject)

    });
  }



}