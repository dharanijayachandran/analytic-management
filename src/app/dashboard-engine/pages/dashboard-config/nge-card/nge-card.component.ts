import { Component, OnInit, Input, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { WidgetService } from '../../../services/widget/widget.service';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { UIModalNotificationPage } from 'global';

@Component({
  selector: 'app-nge-card',
  templateUrl: './nge-card.component.html',
  styleUrls: ['./nge-card.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NgeCardComponent implements OnInit, OnDestroy {

  @Input()
  styling;
  @Input() FS;
  @Input()
  icon;
  @Input()
  title;
  @Input()
  DS;
  @Input() OND;
  @Input()
  RI;
  // @Input()
  // params;
  @Input()
  origin;
  @Input() interval;
  intervals = [];
  cardVal: any;
  cardName: any;
  userDashboard: boolean;
  @ViewChild(UIModalNotificationPage) modelNotification;
  targetTimeZone: string;
  reload: boolean;
  inter: NodeJS.Timeout;
  fontSize: string;
  @Input() tagName;
  @Input() tagId;
  constructor(private widgetService: WidgetService, private globalService: globalSharedService) { }
  @Input() DC;
  ngOnInit() {
    this.fontSize = this.FS;
    if (this.origin == "UD") {
      if (typeof this.RI !== 'undefined') {
        this.inter = setInterval(() => {
          if (this.tagId && this.tagName) {
            this.getRackAssetTagCard()
          } else {
            this.loadDataOnCall(this.DS)
          }
        }, +this.RI * 1000);
      }
    }

    this.loadDataOnCall(this.DS);

    this.userDashboard = false;
    if (this.origin == "UD") {
      this.userDashboard = true;
    }

    // this.getRackAssetTagCard()
  }

  getRackAssetTagCard() {

  }

  ngOnDestroy() {
    clearInterval(this.inter);
  }

  loadDataOnCall(ds: Object) {
    this.cardVal = "Loading...";
    this.cardName = "Loading..."
    if(ds){
      let url = ds["URL"];
      //debugger;
      if (url != undefined) {
        var splitted = url.replace("{paramString}", "")
        //debugger;
        let params = ds["params"];
        this.targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        let queryString = "?targetTimeZone=" + this.targetTimeZone;
        for (let k = 0; k < params.length; k++) {
          queryString = queryString + '&' + params[k]["name"] + "=" + params[k]["value"];
        }
        url = splitted + queryString;
        this.getDataByDataServiceUrl(url);
      }
    }else{
      if (this.tagId && this.tagName) {
        let api;
        let targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        let url = 'AssetManagementService/asset/latestPvData?assetTagId=' + this.tagId + '&targetTimeZone=' + targetTimeZone
        this.widgetService.getApiUrl().subscribe(data => {
          // "http://10.225.10.26:8080/AssetManagementService/asset/latestPvData/{paramString}"
          api = data.api;
          url = api + url;
          this.getDataByDataServiceUrl(url);

        })
      }
    }

  }
  getDataByDataServiceUrl(url: string) {
    this.widgetService.getDashboardWidgetDataByDataService(url, "labelCard").subscribe(resp => {
      // debugger;
      var value = resp[0]["value"];
      this.cardName = resp[0]["name"];
      let splittedValue = value.split(" ")

      if(!isNaN(splittedValue[0])){
        if(Number.isInteger(+splittedValue[0])){
          this.cardVal = value;
        }else{
          let v = Number.parseFloat(splittedValue[0]).toFixed(2)
          for(let i=1 ; i< splittedValue.length ; i++){
            v = v + ' ' + splittedValue[i]
          }
          this.cardVal =  v
        }
      }else{
        this.cardVal = value
      }
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, "Unable to pull data of download");
      })
  }
  panelReload() {
    this.loadDataOnCall(this.DS);
  }

}
