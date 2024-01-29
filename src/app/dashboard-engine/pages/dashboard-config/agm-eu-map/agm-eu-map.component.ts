import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { WidgetService } from '../../../services/widget/widget.service';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { ShareddataService } from '../../../shared/shareddata.service';
import { UIModalNotificationPage } from 'global';

@Component({
  selector: 'app-agm-eu-map',
  templateUrl: './agm-eu-map.component.html',
  styleUrls: ['./agm-eu-map.component.css']
})
export class AgmEuMapComponent implements OnInit, OnDestroy {
  mapFocusLat: number;
  mapFocusLon: number;
  @Input() zoom;
  @Input() items;
  @Input() DC:boolean;
  @Input() DS;
  @Input() RI;
  targetTimeZone: string;
  da: boolean;
  locationData:Object
  MapResultByMarkerId:any[]=[];
  mapZoom: number;
  @ViewChild(UIModalNotificationPage) modelNotification;
  @Input()
  origin;
  inter: NodeJS.Timeout;
  subscription: any;
  constructor(private widgetService: WidgetService, private globalService:globalSharedService,
    private sharedData: ShareddataService) { }
  @Input() strokeColor: string;
  @Input() strokeWeight: number;
  ngOnInit(): void {
    this.loadDataOnCall(this.DS);
    if(this.origin=="UD")
     {
      if(typeof this.RI !== 'undefined')
      {
      this.inter = setInterval( ()=>{
        this.loadDataOnCall(this.DS)},+this.RI*1000);
      }
     }
      this.subscription =this.sharedData.getChangedMessage().subscribe(message => {
        this.loadDataOnCall(this.DS);
    })
  }
  ngOnDestroy() {
    clearInterval( this.inter);
    this.subscription.unsubscribe();
  }
  loadDataOnCall(ds:Object)
  {
    let url=ds["URL"];
    if(url != undefined){
      var splitted = url.replace("{paramString}","")

      let params=ds["params"];
      this.targetTimeZone=Intl.DateTimeFormat().resolvedOptions().timeZone;
      let queryString="?targetTimeZone=" + this.targetTimeZone;
      let dayDiff=0;
      for(let k=0; k<params.length;k++)
      {

        if(params[k]["name"]=="dayDiff"||params[k]["name"]=="currentDate")
        {
          if(params[k]["name"]=="currentDate")
          {
            //do nothing right now..
          }
          else{
            dayDiff=+params[k]["value"];
            let endDate = new Date();
            let startDate=endDate.setDate(endDate.getDate()-dayDiff);
            let startDateN = new Date(startDate)
            queryString=queryString+'&endDate='+ endDate.toISOString();
            queryString=queryString+'&startDate='+ startDateN.toISOString();
          }
        }
        else
        {
          queryString=queryString+'&' + params[k]["name"]+"="+params[k]["value"];
        }

      }
      url=splitted + queryString;

      this.getDataByDataServiceUrl(url);
    }else{
      this.da=true;
      this.strokeColor="blue;"
      this.strokeWeight=5;
      this.locationData= [{
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
      this.mapFocusLat=this.locationData[0]["latitude"];
      this.mapFocusLon=this.locationData[0]["longitude"];
      this.mapZoom=7;
    }


  }
  getDataByDataServiceUrl(url:string)
  {

    this.widgetService.getDashboardWidgetDataByDataService(url,"locationMap").subscribe(resp=>{

      if(resp.length>0)
      {
        this.da=true;
        this.strokeColor="blue;"
        this.strokeWeight=5;
        this.locationData=resp;

        this.mapFocusLat=this.locationData[0]["latitude"];
        this.mapFocusLon=this.locationData[0]["longitude"];
        this.mapZoom=7;
      }
      else{
        this.da=true;

        this.mapFocusLat = 12.95;
        this.mapFocusLon =  77.74;
        // this.da=false;
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
  routeMap = false
  changeMap(event){
    this.sharedData.setData(event);
    this.routeMap = true;
  }

  previous;
  clickedMarker(infowindow) {
    if (this.previous) {
        this.previous.close();
    }
    this.previous = infowindow;
 }
}
