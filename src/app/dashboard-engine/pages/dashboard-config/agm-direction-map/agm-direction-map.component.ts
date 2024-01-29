/// <reference types="googlemaps" />
import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { WidgetService } from '../../../services/widget/widget.service';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { ShareddataService } from '../../../shared/shareddata.service';
import { UIModalNotificationPage } from 'global';

@Component({
  selector: 'app-agm-direction-map',
  templateUrl: './agm-direction-map.component.html',
  styleUrls: ['./agm-direction-map.component.css']
})
export class AgmDirectionMapComponent implements OnInit, OnDestroy {

  mapFocusLat: number;
  mapFocusLon: number;
  @Input() zoom;
  @Input() items;
  @Input() DC: boolean;
  @Input() DS;
  @Input() RI;
  targetTimeZone: string;
  da: boolean;
  locationData: any[] = []
  mapZoom: number;
  @ViewChild(UIModalNotificationPage) modelNotification;
  @Input()
  origin;
  inter: NodeJS.Timeout;
  start : any;
  end : any;
  latitude: any;
  longitude: any;
  subscription: any;
  constructor(private widgetService: WidgetService, private globalService: globalSharedService,
    private sharedData: ShareddataService) { }
  @Input() strokeColor: string;
  @Input() strokeWeight: number;
  assetData: any;
  i = 0;
  ngOnInit(): void {
    this.sharedData.getData().subscribe(data => {
      // alert("Asset Id:" + data['id'])
      this.assetData = data;
      this.i = 0;
      this.locationData = [];
      this.loadDataOnCall(this.DS);
    })


    this.loadDataOnCall(this.DS);
    if (this.origin == "UD") {
      if (typeof this.RI !== 'undefined') {
        this.inter = setInterval(() => {
          this.loadDataOnCall(this.DS)
        }, +this.RI * 1000);
      }
    }
    this.subscription =  this.sharedData.getChangedMessage().subscribe(message => {
        this.loadDataOnCall(this.DS);
    })

    /*   let i=0
      setInterval(() => {
        if (i < this.tmpPoints.length) {
          const pos = this.tmpPoints[i];
          // this.origin = this.tmpPoints[i]
          this.end = this.tmpPoints[i + 1]
          this.points.push(pos);
          this.currentPos = pos;
          i++;
        }

      }, 2000) */
  }
  ngOnDestroy() {
    clearInterval(this.inter);
    this.subscription.unsubscribe();
  }
  loadDataOnCall(ds: Object) {
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
            let endDate = new Date();
            let startDate = endDate.setDate(endDate.getDate() - dayDiff);
            let startDateN = new Date(startDate)
            queryString = queryString + '&endDate=' + endDate.toISOString();
            queryString = queryString + '&startDate=' + startDateN.toISOString();
          }
        }
        else {

          if (params[k]["name"] === 'assetIds') {
            if (this.assetData) {
              queryString = queryString + '&' + params[k]["name"] + "=" + this.assetData.id
            } else {
              queryString = queryString + '&' + params[k]["name"] + "=" + params[k]["value"];
            }
          } else {
            queryString = queryString + '&' + params[k]["name"] + "=" + params[k]["value"];
          }

        }

      }
      url = splitted + queryString;

      this.getDataByDataServiceUrl(url);
    } else {
      this.da = true;
      this.strokeColor = "blue;"
      this.strokeWeight = 5;
      this.locationData = [{
        "latitude": 21.46,
        "longitude": 77.75
      }, {
        "latitude": 21.47,
        "longitude": 77.76
      }, {
        "latitude": 21.48,
        "longitude": 77.77
      }, {
        "latitude": 21.49,
        "longitude": 77.78
      }, {
        "latitude": 21.50,
        "longitude": 77.79
      }];
      this.origin = { "lat": 21.46, "lng": 77.75 }
      this.end = { "latitude": 21.50, "longitude": 77.79 }
      this.mapFocusLat = this.locationData[0]["latitude"];
      this.mapFocusLon = this.locationData[0]["longitude"];
      this.mapZoom = 7;
    }


  }
  getDataByDataServiceUrl(url: string) {
    this.widgetService.getDashboardWidgetDataByDataService(url, "locationMap").subscribe(resp => {
      if (resp.length > 0) {
        this.da = true;
        this.strokeColor = "blue;"
        this.strokeWeight = 5;
        for(let data of resp){
          this.longitude = resp[0]["longitude"]
            this.latitude = resp[0]["latitude"]
          if(this.i == 0){
            this.locationData.push(data);
            this.start = { "lat": resp[0]["latitude"], "lng": resp[0]["longitude"] };
            this.end = { "lat": resp[0]["latitude"], "lng": resp[0]["longitude"] };

            this.i++;
          }else{
            if(this.locationData[this.i-1]["latitude"] !== resp[0]["latitude"] && this.locationData[this.i-1]["longitude"] !== resp[0]["longitude"]){
              this.locationData.push(data);
              this.end = { "lat": resp[0]["latitude"], "lng": resp[0]["longitude"] };
              this.i++;
            }
          }
         if(this.locationData.length == 1){
          this.mapFocusLat = this.locationData[0]["latitude"];
          this.mapFocusLon = this.locationData[0]["longitude"];
         }else{
          this.mapFocusLat = this.locationData[this.i]["latitude"];
          this.mapFocusLon = this.locationData[this.i]["longitude"];
         }

        }

        /* if (this.i < this.locationData.length) {

         if(this.i==0){
          this.start = { "lat": this.locationData[this.i]["latitude"], "lng": this.locationData[this.i]["longitude"] };
          this.end = { "lat": this.locationData[this.i]["latitude"], "lng": this.locationData[this.i]["longitude"] };
         }else{
          // this.start = { "lat": this.locationData[this.i-1]["latitude"], "lng": this.locationData[this.i-1]["longitude"] };
          this.end = { "lat": this.locationData[this.i]["latitude"], "lng": this.locationData[this.i]["longitude"] };
         }


        } */

        this.mapZoom = 7;
      }
      else {
        this.da=true;

        this.mapFocusLat = 12.95;
        this.mapFocusLon =  77.74;
      }

    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, "Unable to pull data of for linechart widget");
      })
  }
  defaultSet() {
    //alert(event);
  }
  openWindow(id: number) {

  }
  isInfoWindowOpen(id: number) {
    //alert(id);
  }

  previous
  clickedMarker(infowindow) {
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
  }

  /* start = { lat: 12.9571, lng: 77.7091 };
  currentPos= { lat: 12.9571, lng: 77.7091 };
  points: any[] = [];
  tmpPoints: any[] = [
    { lat: 12.9571, lng: 77.7091 },
    // {lat:12.9569,lng:77.7011},
    { lat: 12.9558, lng: 77.7192 },
    { lat: 12.9561, lng: 77.7303 },
    // {lat:12.969247,lng:77.74226},
    { lat: 12.9559, lng: 77.7497 },
    // {lat:12.9696,lng:77.576435546875},
    // {lat:12.982434028282803,lng:77.586435546875}

  ]
  end = { lat: 12.9571, lng: 77.7091 } */


}
