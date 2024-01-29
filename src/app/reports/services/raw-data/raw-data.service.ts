import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { FramedDataPacket } from '../../model/framedDataPacket';
import { Gateway } from 'src/app/shared/model/gateway';
import { ResponseObject } from '../../model/Response';




const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class RawDataService {


  apiurl = environment.baseUrl_DashboardEngine;
  anlyticViewControllerUri = environment.baseUrl_analytic_view_controller;
  constructor(private http: HttpClient) { }

  rawDataFilterByData(organizationId, rawDataFilterObj, userId) {
    return this.http.post<any>(this.anlyticViewControllerUri + 'organizations/' + organizationId + '/raw-data-latest-filter?target-time-zone=Asia/Calcutta&user-id=' + userId + '&user-type=&offset=0&limit=0', rawDataFilterObj)
  }

  getRawData(targetTimeZone, offset, limit): Observable<ResponseObject> {
    let beId = sessionStorage.getItem("beId");
    let userId = sessionStorage.getItem("userId");
    let userType;
    if (sessionStorage.getItem("isAdmin") == "true") {
      userType = "Admin";
    }
    else {
      userType = "";
    }
    return this.http.get<ResponseObject>(this.anlyticViewControllerUri + 'raw-data-latest?organization-id=' + beId + "&target-time-zone=" + targetTimeZone + "&user-id=" + userId + "&user-type=" + userType + "&offset=" + offset + "&limit=" + limit);
  }

  getGateways(): Observable<Gateway[]> {
    return this.http.get<Gateway[]>(environment.baseUrl_gatewayManagement + 'allGateways');
  }
  getRawDataByGatewayId(gatewayId, startDate, endDate, targetTimeZone): Observable<FramedDataPacket[]> {

    return this.http.get<FramedDataPacket[]>(this.anlyticViewControllerUri + "gateway/raw-data?gateway-id=" + gatewayId + "&start-date=" + startDate + "&end-date=" + endDate + "&target-time-zone=" + targetTimeZone);
  }
  getGatewaysbyOrganizationId(id): Observable<Gateway[]> {
    let userId = sessionStorage.getItem("userId");
    let userType;
    if (sessionStorage.getItem("isAdmin") == "true") {
      userType = "Admin";
    }
    else {
      userType = "";
    }
    return this.http.get<Gateway[]>(this.anlyticViewControllerUri + 'organization/' + id + "/gateways?user-id=" + userId + "&user-type=" + userType);
  }
  getRawDataListGatewayByOrganizationId(id){
    return this.http.get<ResponseObject>(this.anlyticViewControllerUri + 'organizations/' + id + '/raw-data-latest' + '/gateways');
  }
}
