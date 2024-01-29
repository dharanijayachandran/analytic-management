import { Component, OnInit, Input, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { WidgetService } from '../../../services/widget/widget.service';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { UIModalNotificationPage } from 'global';
@Component({
  selector: 'rack-landing-card',
  templateUrl: './rack-landing-card.component.html',
  styleUrls: ['./rack-landing-card.component.css']
})
export class RackLandingCardComponent implements OnInit {
  @Input() styling;
  @Input() FS;
  @Input() icon;
  @Input() title;
  @Input() DS;
  @Input() OND;
  @Input() RI;
  @Input() origin;
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
  @Input() code;
  @Input() tagId;
  @Input() totalCount;
  @Input() cardValueTime;
  @Input() landingCardValue;
  assetIds = new Set<any>();
  assetTagMap = new Map<any, any>();
  assetTagIds: any[];
  constructor(private widgetService: WidgetService, private globalService: globalSharedService) { }
  @Input() DC;
  color: any;
  ngOnInit() {
    this.color = '#00FF00';
    this.cardVal = 0
    this.cardName = '-'
    this.fontSize = this.FS;
    this.loadDataOnCall();
    this.widgetService.getTimeIntervalsFromFile().toPromise().then(data => {
      let interval = data.mainDashboardRefreshTimeInterval;
      this.inter = setInterval(() => {
        this.loadDataOnCall()
      }, +interval);
    })
  }

  ngOnDestroy() {
    clearInterval(this.inter);
  }



  loadDataOnCall() {

    let organizationId = sessionStorage.getItem('beId');
    let targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let userId = parseInt(sessionStorage.getItem('userId'));
    this.assetTagMap.clear();
    this.widgetService.getAssetTagsByAssetStandardTagCode(this.code, organizationId).subscribe(assetTags => {
      if (assetTags && assetTags.length) {
        this.assetIds.clear();
        this.assetTagIds = [];
        let assetTagIds = [];
        assetTags.forEach(assetTag => {
          this.assetTagMap.set(assetTag.id, assetTag.assetId);
          // this.assetIds.push(assetTag.assetId);
          assetTagIds.push(assetTag.id);
        })
        let assetTag = {
          "entityIds": assetTagIds,
          "targetTimeZone": targetTimeZone
        }
        this.widgetService.getAlarmsDataByAssetTagIds(assetTag, organizationId).subscribe(alarms => {
          let totalAlarms = []
          if (alarms) {
            totalAlarms = alarms["alarm"];
            let alarmStateMap = alarms["states"];
            let alarmSeverityMap = alarms["severitys"];
            if (totalAlarms && totalAlarms.length) {
              totalAlarms = totalAlarms.filter(alarm => alarmStateMap[alarm.stateId] !== 'Cleared' && alarmStateMap[alarm.stateId] !== 'Disabled');
              if (totalAlarms && totalAlarms.length) {
                totalAlarms = totalAlarms.sort((a, b) => b.eventTime - a.eventTime);
                totalAlarms.forEach(alarm => {
                  if (this.assetTagMap.has(alarm.entityId)) {
                    this.assetTagIds.push(alarm.entityId);
                    this.assetIds.add(this.assetTagMap.get(alarm.entityId));
                  }
                })
                let priority = 0;
                totalAlarms.forEach(alarm => {
                  if (priority < alarm.severityId) {
                    priority = alarm.severityId;
                  }
                })
                this.cardVal = totalAlarms.length
                this.cardName = totalAlarms[0].eventDateTime
                this.color = alarmSeverityMap[priority]['colorCode']
              }
            } else {
              this.color = '#00FF00';
              this.cardVal = 0
              this.cardName = '-'
            }
          } else {
            this.color = '#00FF00';
            this.cardVal = 0
            this.cardName = '-'
          }
        })
      }
    })

  }

  changeBorderColorOfGatewayPowerWidget() {
    if (this.cardVal.toLowerCase() === 'ON'.toLowerCase()) {
      this.color = "green";
    } else if (this.cardVal.toLowerCase() === 'OFF'.toLowerCase()) {
      this.color = "red";
    }
    this.cardVal = this.totalCount
  }

  changeBorderColorOfDoorStatusWidget() {
    if (this.cardVal.toLowerCase() === 'CLOSE'.toLowerCase() || this.cardVal.toLowerCase() === 'CLOSED'.toLowerCase()) {
      this.color = "green";
    } else if (this.cardVal.toLowerCase() === 'OPEN'.toLowerCase()) {
      this.color = "#ffbf00";
    }
    this.cardVal = this.totalCount
  }

  changeBorderColorOfWaterLeakageWidget() {
    if (this.cardVal.toLowerCase() === 'NO'.toLowerCase()) {
      this.color = "green";
    } else if (this.cardVal.toLowerCase() === 'YES'.toLowerCase()) {
      this.color = "red";
    }
    this.cardVal = this.totalCount
  }

  changeBorderColorOfPDUWidget() {
    if (this.cardVal.toLowerCase() === 'ON'.toLowerCase()) {
      this.color = "green";
    } else if (this.cardVal.toLowerCase() === 'OFF'.toLowerCase()) {
      this.color = "red";
    }
    this.cardVal = this.totalCount
  }

  changeBorderColorOfBatteryWidget() {
    if (this.cardVal >= 70 && this.cardVal <= 100) {
      this.color = "green";
    } else if (this.cardVal >= 30 && this.cardVal <= 69) {
      this.color = "#ffbf00";
    } else if (this.cardVal >= 0 && this.cardVal <= 29) {
      this.color = "red";
    }
    this.cardVal = this.totalCount
  }


  changeBorderColorOfHumidityWidget() {
    if (this.cardVal < 40) {
      this.color = "red";
    } else if (this.cardVal >= 40 && this.cardVal < 61) {
      this.color = "green";
    } else if (this.cardVal >= 61 && this.cardVal < 76) {
      this.color = "#ffbf00";
    } else if (this.cardVal >= 76) {
      this.color = "red";
    }
    this.cardVal = this.totalCount
  }


  changeBorderColorOfTemperatureWidget() {

    if (this.cardVal < 16) {
      this.color = "blue";
    } else if (this.cardVal > 16 && this.cardVal < 24) {
      this.color = "green";
    } else if (this.cardVal >= 24 && this.cardVal < 29) {
      this.color = "#ffbf00";
    } else if (this.cardVal >= 29) {
      this.color = "red";
    }
    this.cardVal = this.totalCount
  }
  panelReload() {
  }

  redirectToDashboard() {
    let assetIds = [];
    let tagIds = [];
    assetIds = Array.from(this.assetIds);
    tagIds = Array.from(this.assetTagIds);
    this.widgetService.setAssetIds(assetIds);
    this.widgetService.setAssetTagsIds(tagIds);
  }

}
