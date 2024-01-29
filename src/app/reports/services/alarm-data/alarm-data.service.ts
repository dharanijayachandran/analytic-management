import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AssetTemplate } from 'src/app/shared/model/assetTemplate';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class AlarmDataService {

  apiurl = environment.baseUrl_AlarmManagement;
  assetApiurl = environment.baseUrl_AssetManagement;
  dashBoardApiurl = environment.baseUrl_DashboardEngine;
  constructor(private http: HttpClient) { }

  alarmDataByOrganizationId(organizationId: number, startDate: string, endDate: string, targetTimeZone: String) {

    return this.http.get<any[]>(this.apiurl + 'alarmData?organizationId=' + organizationId
      + '&startDate=' + startDate + '&endDate=' + endDate + '&targetTimeZone=' + targetTimeZone);
  }

  alarmDataByAssetId(assetId: number, startDate: string, endDate: string, targetTimeZone: String) {
    return this.http.get<any[]>(this.apiurl + 'alarmDataByAssetId?assetId=' + assetId
      + '&startDate=' + startDate + '&endDate=' + endDate + '&targetTimeZone=' + targetTimeZone);
  }

  // To get all the records for asset template list
  getAssetList(organizationId: number): Observable<AssetTemplate[]> {
    let userId = sessionStorage.getItem("userId");
    let userType;
    if (sessionStorage.getItem("isAdmin") == "true") {
      userType = "Admin";
    }
    else {
      userType = "";
    }
    return this.http.get<AssetTemplate[]>(this.dashBoardApiurl + 'assetsByOrganizationId/' + organizationId + "?user-id=" + userId + "&user-type=" + userType);
  }

}
