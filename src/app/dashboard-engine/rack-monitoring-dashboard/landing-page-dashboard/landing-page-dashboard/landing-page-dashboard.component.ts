import { Component, OnInit, ViewChild } from '@angular/core';
import { globalSharedService, UIModalNotificationPage } from 'global';
import { WidgetService } from 'src/app/dashboard-engine/services/widget/widget.service';

@Component({
  selector: 'landing-page-dashboard',
  templateUrl: './landing-page-dashboard.component.html',
  styleUrls: ['./landing-page-dashboard.component.css']
})
export class LandingPageDashboardComponent implements OnInit {
  alarms: any[];
  masterMapOfAlarmData = new Map<string, any[]>();
  alarmDataForLocationwise = new Map<string, any[]>();
  inter: NodeJS.Timeout;
  tempTag1;
  tempTag2;
  tempTag3;
  humidityTag1;
  humidityTag2;
  humidityTag3;
  showLoaderImage = false;
  cardWidgets: any[] = [];
  alarmSeveritys: any[];
  alarmStates: any[];
  alarmStateMap = new Map<string, number>();
  alarmsDataForLications: any[];


  constructor(private widgetService: WidgetService, private globalService: globalSharedService) { }

  ngOnInit() {
    this.setCardValues();

    // this.getAlarmStates();
    // this.getAlarmSeveritys();
    // this.showLoaderImage = true
    // this.inter = setInterval(() => {
    //   this.getAllAlarms()
    // }, 60 * 1000);
    // this.getAllAlarms()
  }

  ngOnDestroy() {
    clearInterval(this.inter);
  }

  getAllAlarms() {
    let organizationId = sessionStorage.getItem('beId');
    let targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let userId = parseInt(sessionStorage.getItem('userId'));
    let url = 'AlarmManagementService/alarm/organization/' + organizationId + '/alarms?targetTimeZone=' + targetTimeZone + '&user-id=' + userId;
    this.widgetService.getApiUrl().subscribe(data => {
      let api = data.api
      url = api + url;
      this.getDataByDataServiceUrl(url);
    })

  }

  @ViewChild(UIModalNotificationPage) modelNotification;

  getAlarmSeveritys() {
    this.widgetService.getAlarmSeveritys().subscribe(res => {
      this.alarmSeveritys = res;
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
  }

  getDataByDataServiceUrl(url: any) {
    this.getTableResponse(url, "alarm");
  }

  getAlarmStates() {
    this.widgetService.getAlarmStates().subscribe(res => {
      if (null != res) {
        res = res.sort((a, b) => a.id - b.id);
        res.forEach(state => {
          this.alarmStateMap.set(state.name, state.id)
        })
      }
      this.alarmStates = res;
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    )
  }

  getTableResponse(url: any, type: string) {
    this.widgetService.getDashboardWidgetDataByDataService(url, type).subscribe(data => {
      let noClearedAlarms = [];
      data.forEach(r => {
        if (r.alarmStateId !== this.alarmStateMap.get('Cleared')) {
          noClearedAlarms.push(r)
        }
      })
      this.alarms = noClearedAlarms;
      this.alarms = this.alarms.sort((a, b) => b.alarmEventTime - a.alarmEventTime);
      this.setValuesToTheMap();
      this.alarmsDataForLications = []
      this.alarmDataForLocationwise.forEach((value : any[], key: string) =>{
        if(value){
          value = value.sort((a, b) => b.alarmEventTime - a.alarmEventTime)
          let alarm = value[0];
          alarm.totalCount = value.length
          this.alarmsDataForLications.push(alarm);
        }
      })
      this.showLoaderImage = false;
    })
  }


  setCardValues() {
    let cardArray = []
    let card;
    
    card = getCardValues('icon-humidity', 'HUM', 'Humidity (%)');
    cardArray.push(card);
    
    card = getCardValues('fa fa-power-off', 'GATEWAYPOWER','IoT Power State');
    cardArray.push(card);
    
    card = getCardValues('fa fa-thermometer-half', 'TEMP', 'Temp (Celsius)');
    cardArray.push(card);
    
    card = getCardValues('fas fa-door-open', 'DOOR', 'Door Status');
    cardArray.push(card);
    
    card = getCardValues('icon-pipe-leakage', 'WATERLEAKAGE', 'Water Leak');
    cardArray.push(card);
    
    card = getCardValues('icon-plug', 'PDU2', 'PDU 02');
    cardArray.push(card);
    
    card = getCardValues('icon-vertical-battery', 'BATTERY', 'IoT Battery (%)');
    cardArray.push(card);
    
    card = getCardValues('icon-plug', 'PDU1', 'PDU 01');
    cardArray.push(card);
    
    this.cardWidgets = cardArray;
  }


  setValuesToTheMap() {
    this.masterMapOfAlarmData.clear();
    this.alarmDataForLocationwise.clear();
    for (let alarm of this.alarms) {
      if (this.masterMapOfAlarmData.has(alarm.alarmEntityName)) {
        let array = this.masterMapOfAlarmData.get(alarm.alarmEntityName)
        array.push(alarm);
        this.masterMapOfAlarmData.set(alarm.alarmEntityName, array);
      } else {
        let array = [];
        array.push(alarm);
        this.masterMapOfAlarmData.set(alarm.alarmEntityName, array);
      }
      if(this.alarmDataForLocationwise.has(alarm.alarmEntityTypeName)){
        let array = this.alarmDataForLocationwise.get(alarm.alarmEntityTypeName)
        array.push(alarm);
        this.alarmDataForLocationwise.set(alarm.alarmEntityTypeName, array);
      }else{
        let array = [];
        array.push(alarm);
        this.alarmDataForLocationwise.set(alarm.alarmEntityTypeName, array);
      }
    }
  }
}

function getCardValues(icon: string, code: string, TL :string): any {
  let card = {
      'STL': 'widget widget-stats bg-green-lighter',
      'ICN': icon,
      'TL': TL,
      'FS': '30px',
      'dcstatus': '',
      'RI': 60,
      'totalCount': 0,
      'alarmTime': '-',
      'alarmValue': '-',
      'code': code
    }
  return card;
}

