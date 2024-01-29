import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UIModalNotificationPage } from 'global';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';
import { WidgetService } from '../../../services/widget/widget.service';
@Component({
  selector: 'app-rack-nge-card',
  templateUrl: './rack-nge-card.component.html',
  styleUrls: ['./rack-nge-card.component.css']
})
export class RackNgeCardComponent implements OnInit {

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
  warningFlag: string;
  status: string;
  userType: string;
  constructor(private widgetService: WidgetService, private globalService: globalSharedService) { }
  @Input() DC;
  color: any;
  toggle: boolean
  isAlarm: boolean
  toggleToolTip = 'OFF'
  latestAlarmEventTime: any;
  ngOnInit() {
    this.loadData();
    // this.getRackAssetTagCard()
  }

  loadData() {
    let beId = parseInt(sessionStorage.getItem('beId'));
    this.widgetService.getAlarmConfigsByOrgAndAssetTagId(beId, this.tagId, null, null).subscribe(data => {
      if (data) {
        data.forEach(alarm => {
          let alarmStatus = alarm['status']
          this.isAlarm = true

          if (alarmStatus == 'Active') {
            this.toggle = true
            this.toggleToolTip = 'ON'
          }

        })
      }
      this.loadWidgetData()
    })
  }
  loadWidgetData() {
    this.fontSize = this.FS;
    this.widgetService.getTimeIntervalsFromFile().toPromise().then(data => {
      let interval = data.mainDashboardRefreshTimeInterval;
      this.inter = setInterval(() => {
        if (this.tagId && this.tagName) {
          this.getRackAssetTagCard()
        } else {
          this.loadDataOnCall(this.DS)
        }
      }, +interval);
    })

    this.loadDataOnCall(this.DS);

    this.userDashboard = false;
    if (this.origin == "UD") {
      this.userDashboard = true;
    }
  }

  getRackAssetTagCard() {

  }

  ngOnDestroy() {
    clearInterval(this.inter);
  }

  loadDataOnCall(ds: Object) {
    this.cardVal = "Loading...";
    this.cardName = "Loading..."
    if (ds) {
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
    } else {
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
    this.widgetService.getDashboardWidgetDataByDataServiceRack(url, "labelCard").subscribe(resp => {
      // debugger;
      var value = resp[0]["value"];
      this.cardName = resp[0]["name"];
      this.color = resp[0]["colorCode"]
      let splittedValue = value.split(" ")

      if (!isNaN(splittedValue[0])) {
        if (Number.isInteger(+splittedValue[0])) {
          this.cardVal = value;
        } else {
          let v = Number.parseFloat(splittedValue[0]).toFixed(2)
          for (let i = 1; i < splittedValue.length; i++) {
            v = v + ' ' + splittedValue[i]
          }
          this.cardVal = v
        }
      } else {
        this.cardVal = value
      }
      switch (this.tagName) {
        case 'Temperature':
          this.changeBorderColorOfTemperatureWidget();
          break;
        case 'Temperature 1':
          this.changeBorderColorOfTemperatureWidget();
          break;
        case 'Temperature 2':
          this.changeBorderColorOfTemperatureWidget();
          break;
        case 'Temperature 3':
          this.changeBorderColorOfTemperatureWidget();
          break;
        case 'Humidity':
          this.changeBorderColorOfHumidityWidget();
          break;
        case 'Humidity 1':
          this.changeBorderColorOfHumidityWidget();
          break;
        case 'Humidity 2':
          this.changeBorderColorOfHumidityWidget();
          break;
        case 'Humidity 3':
          this.changeBorderColorOfHumidityWidget();
          break;
        case 'Battery Status':
          this.changeBorderColorOfBatteryWidget();
          break;
        case 'PDU1 Power':
          this.changeBorderColorOfPDUWidget();
          break;
        case 'PDU2 Power':
          this.changeBorderColorOfPDUWidget();
          break;
        case 'Water Leakage':
          this.changeBorderColorOfWaterLeakageWidget();
          break;
        case 'Door Status':
          this.changeBorderColorOfDoorStatusWidget();
          break;
        case 'Gateway Power':
          this.changeBorderColorOfGatewayPowerWidget();
          break;
      }


    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, "Unable to pull data of download");
      })
  }

  changeBorderColorOfGatewayPowerWidget() {
    // if (this.cardVal.toLowerCase() === 'ON'.toLowerCase()) {
    //   this.color = "green";
    // } else if (this.cardVal.toLowerCase() === 'OFF'.toLowerCase()) {
    //   this.color = "red";
    // }
  }
  changeBorderColorOfDoorStatusWidget() {
    // if (this.cardVal.toLowerCase() === 'CLOSE'.toLowerCase() || this.cardVal.toLowerCase() === 'CLOSED'.toLowerCase()) {
    //   this.color = "green";
    // } else if (this.cardVal.toLowerCase() === 'OPEN'.toLowerCase()) {
    //   this.color = "#ffbf00";
    // }
  }

  changeBorderColorOfWaterLeakageWidget() {
    // if (this.cardVal.toLowerCase() === 'NO'.toLowerCase()) {
    //   this.color = "green";
    // } else if (this.cardVal.toLowerCase() === 'YES'.toLowerCase()) {
    //   this.color = "red";
    // }
  }

  changeBorderColorOfPDUWidget() {
    // if (this.cardVal.toLowerCase() === 'ON'.toLowerCase()) {
    //   this.color = "green";
    // } else if (this.cardVal.toLowerCase() === 'OFF'.toLowerCase()) {
    //   this.color = "red";
    // }
  }

  changeBorderColorOfBatteryWidget() {
    // if (this.cardVal >= 70 && this.cardVal <= 100) {
    //   this.color = "green";
    // } else if (this.cardVal >= 30 && this.cardVal <= 69) {
    //   this.color = "#ffbf00";
    // } else if (this.cardVal >= 0 && this.cardVal <= 29) {
    //   this.color = "red";
    // }
    if (this.cardVal) {
      this.cardVal = this.cardVal
    }
  }


  changeBorderColorOfHumidityWidget() {
    // if (this.cardVal < 40) {
    //   this.color = "red";
    // } else if (this.cardVal >= 40 && this.cardVal < 61) {
    //   this.color = "green";
    // } else if (this.cardVal >= 61 && this.cardVal < 76) {
    //   this.color = "#ffbf00";
    // } else if (this.cardVal >= 76) {
    //   this.color = "red";
    // }
    if (this.cardVal) {
      this.cardVal = this.cardVal
    }
  }


  changeBorderColorOfTemperatureWidget() {
    // if (this.cardVal < 16) {
    //   this.color = "blue";
    // } else if (this.cardVal > 16 && this.cardVal < 24) {
    //   this.color = "green";
    // } else if (this.cardVal >= 24 && this.cardVal < 29) {
    //   this.color = "#ffbf00";
    // } else if (this.cardVal >= 29) {
    //   this.color = "red";
    // }
    if (this.cardVal) {
      this.cardVal = this.cardVal
    }
  }
  panelReload() {
    this.loadDataOnCall(this.DS);
  }

  onChange(event: any) {
    let toggleStatus = event['checked']
    if (toggleStatus == true) {
      this.status = "A"
      this.alertRedirection();
    }
    else {
      this.status = "I"
      let beId = sessionStorage.getItem("beId");
      this.targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      this.widgetService.isAlarmsRaisedForAssetTag(beId, this.tagId, this.targetTimeZone).subscribe(resp => {
        if (resp == true) {
          this.swalWarning("Alarm is in raised state, do you want to proceed?");
        }
        else {
          this.alertRedirection();
        }
      },
        error => {
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, "Unable to toggle");
        })
    }
  }
  alertRedirection() {
    let obj = {
      id: this.tagId,
      status: this.status
    }
    this.widgetService.rackWidgetToggle(obj).subscribe(resp => {
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, "Unable to toggle");
      })

    this.updateAlarmCount();
  }

  updateAlarmCount() {
    this.getUserType();
    let beId = parseInt(sessionStorage.getItem('beId'));
    let userId = parseInt(sessionStorage.getItem('userId'));
    let targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.widgetService.getAlarmCount(beId, targetTimeZone, this.latestAlarmEventTime, userId, this.userType).subscribe(res => {
      res = res != null ? res : 0;
      sessionStorage.setItem("alarmcount", res);
    })
  }

  getUserType() {
    let isAdmin = sessionStorage.getItem("isAdmin");
    if (isAdmin == 'true') {
      this.userType = 'Admin';
    }
  }

  // Modal window for Warning info (ex: Cancel/Reset/Tab navigation)
  @Output() modelNotificationWarning = new EventEmitter();
  swalWarning(message) {
    Swal.fire({
      title: 'Warning!',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      showCloseButton: true,
      customClass: {
        confirmButton: 'btn btn-warning',
        container: 'warning_info',
      },
      // customClass: 'warning_info'
    }).then((result) => {
      if (result.value) {
        this.alertRedirection()
      }
      else if (result.dismiss) {
        this.loadData();
        this.toggleToolTip = 'ON'
      }
    })
  }
}

