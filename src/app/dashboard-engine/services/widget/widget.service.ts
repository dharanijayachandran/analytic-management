import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DashboardWidget, Widget, WidgetAttributes, WidgetDataServiceParam, WidgetDataSource, WidgetDetail, WidgetFormData, WidgetParamObject, WidgetStyle } from '../../model/widget';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class WidgetService {
  private rackAssetId = new Subject();
  alarmApiUrl = environment.baseUrl_AlarmManagement;
  apiurl = environment.baseUrl_DashboardEngine;
  assetApiUrl = environment.baseUrl_AssetManagement
  masterApiurl = environment.baseUrl_MasterDataManagement;
  assetTagIds: any[];
  assetId: any;
  constructor(private http: HttpClient) {

  }
  ;

  iconFromDashboard = false;
  assetIds: any;
  getWidgetListByUserId(status: string): Observable<Widget[]> {
    return this.http.get<Widget[]>(this.apiurl + 'getAnalyticWidgetList/' + status);
  }
  getAnalyticWidgetAttByWidgetId(id: number): Observable<WidgetAttributes[]> {
    return this.http.get<WidgetAttributes[]>(this.apiurl + 'getAnalyticWidgetAttrByAnalyticWidgetId/' + id);
  }
  getWidgetListByDashboardId(id: number): Observable<Widget[]> {
    return this.http.get<Widget[]>(this.apiurl + 'getDashboardWidgetListByDashboardId/' + id);
  }

  getWidgetDetailByWidgetId(id: number): Observable<WidgetFormData> {
    return this.http.get<WidgetFormData>(this.apiurl + 'widgetDetail/' + id);
  }
  //
  getDashboardWidgetDetailByDashboardWidgetId(id: number, dsId: number, targetTimeZone: String): Observable<WidgetDetail> {
    return this.http.get<WidgetDetail>(this.apiurl + 'getDashboardWidgetDetailByWidgetId?id=' + id + "&dsId=" + dsId + "&timeZone=" + targetTimeZone);
  }
  getDashboardWidgetDetailById(id: number): Observable<WidgetDetail> {

    return this.http.get<WidgetDetail>(this.apiurl + 'getDashboardWidgetDetailByWidgetId/' + id);
  }
  getDashboardWidgetDetailByIdExtended(id: number): Observable<any> {
    return this.http.get<any>(this.apiurl + 'getDashboardWidgetAttrByDashboardWidgetId/' + id);
  }
  getWidgetParamValueByWidgetParamId(id: number): Observable<WidgetStyle[]> {
    return this.http.get<WidgetStyle[]>(this.apiurl + 'getWidgetParamValueByWidgetParamId/' + id);
  }
  getWidgetDataSourceListByWidgetCode(id: number): Observable<WidgetDataSource[]> {
    return this.http.get<WidgetDataSource[]>(this.apiurl + 'widgetDataSourceList/' + id);
  }
  //Highly visible API need to work for light weight call and short path call
  getWidgetDataSourceByWidgetId(dw_id: Number, ds_id: Number, widgetType: String, timeZone: String): Observable<any[]> {
    return this.http.get<any[]>(this.apiurl + 'DashboardWidgetDataService?dw_id=' + dw_id + '&ds_id=' + ds_id + '&wt=' + widgetType + '&timeZone=' + timeZone);
  }
  getWidgetDataSourceByDashboardWidgetId(dw_id: Number, widgetType: String, timeZone: String): Observable<any[]> {
    return this.http.get<any[]>(this.apiurl + 'DashboardWidgetDataService?dw_id=' + dw_id + '&wt=' + widgetType + '&timeZone=' + timeZone);
  }
  //new methods for add and update dashboard widget
  addDashboardWidget(dashboardWidget: DashboardWidget): Observable<WidgetFormData> {
    return this.http.post<WidgetFormData>(`${this.apiurl + 'dashboardWidget'}`, dashboardWidget, httpOptions);
  }
  updateDashboardWidget(dashboardWidget: DashboardWidget): Observable<WidgetFormData> {
    return this.http.put<WidgetFormData>(`${this.apiurl + 'dashboardWidget'}`, dashboardWidget, httpOptions);
  }
  updateDashboardWidgetPosition(widgetParamObject: WidgetParamObject[]): Observable<WidgetParamObject[]> {
    return this.http.put<WidgetParamObject[]>(`${this.apiurl + 'updateDashboardWidgetPosition'}`, widgetParamObject, httpOptions);
  }
  // addDashboardWidgetParam(dashboardWidget: DashboardWidget): Observable<DashboardWidget> {

  //   return this.http.post<DashboardWidget>(`${this.apiurl + 'dashboardWidget'}`, dashboardWidget, httpOptions);
  // }
  updateDashboardWidgetParam(widgetFormData: WidgetFormData): Observable<WidgetFormData> {
    return this.http.put<WidgetFormData>(`${this.apiurl + 'dashboardWidget'}`, widgetFormData, httpOptions);
  }
  deleteDashboardWidget(id: Number, userId: Number): Observable<Widget> {
    return this.http.delete<Widget>(this.apiurl + 'dashboardWidget/' + id + "/" + userId);
  }
  addWidgetAttribute(widgetAtt: Widget): Observable<Widget> {
    return this.http.post<Widget>(`${this.apiurl + 'addWidgetAttribute'}`, widgetAtt, httpOptions);
  }
  updateWidgetAttribute(widgetAtt: Widget): Observable<Widget> {
    return this.http.post<Widget>(`${this.apiurl + 'addWidgetAttribute'}`, widgetAtt, httpOptions);
  }
  deleteWidgetAttribute(id: Number): Observable<Widget> {
    return this.http.delete<Widget>(this.apiurl + 'deleteWidgetAttribute/' + id);
  }
  addMasterWidgetAttribute(widgetAtt: Widget): Observable<Widget> {
    return this.http.post<Widget>(`${this.apiurl + 'addWidgetAttribute'}`, widgetAtt, httpOptions);
  }
  updateMasterWidgetAttribute(widgetAtt: Widget): Observable<Widget> {
    return this.http.post<Widget>(`${this.apiurl + 'addWidgetAttribute'}`, widgetAtt, httpOptions);
  }
  deleteMasterWidgetAttribute(id: Number): Observable<Widget> {
    return this.http.delete<Widget>(this.apiurl + 'deleteWidgetAttribute/' + id);
  }
  addMasterWidget(widget: Widget): Observable<Widget> {
    return this.http.post<Widget>(`${this.apiurl + 'addMasterWidget'}`, widget, httpOptions);
  }
  updateMasterWidget(widget: Widget): Observable<Widget> {
    return this.http.put<Widget>(`${this.apiurl + 'updateMasterWidget'}`, widget, httpOptions);
  }
  deleteMasterWidget(id: Number): Observable<Widget> {
    return this.http.delete<Widget>(this.apiurl + 'deleteMasterWidget/' + id);
  }
  changeDashboardStatus(id: Number): Observable<Widget> {
    return this.http.get<Widget>(this.apiurl + 'updateDashboardStatus/' + id);
  }

  getAnalyticDataServiceInputParamsByDataServiceId(id: number): Observable<WidgetDataServiceParam[]> {
    return this.http.get<WidgetDataServiceParam[]>(this.apiurl + 'analyticDataServiceInputParams/' + id);
  }
  getWidgetDetailListByDashboardId(id: number, targetTimeZone: string): Observable<any> {

    return this.http.get<any[]>(this.apiurl + 'getWidgetDetailListByDashboardId/?id=' + id + "&timeZone=" + targetTimeZone);
  }

  getDashboardWidgetDataByDataService(url: string, type: string): Observable<any> {

    return this.http.get<any>(this.apiurl + 'getDashboardWidgetDataByDataService/' + type + '?url=' + encodeURIComponent(url));
  }

  getdashboardWidgetServiceInputParamValueByDashboardWidgetId(id: number): Observable<any> {

    return this.http.get<any[]>(this.apiurl + 'getDashboardWidgetServiceInputParamValueByDashboardWidgetId/' + id);
  }

  getAlarmTypesForDiscrete() {
    return this.http.get<any[]>(this.alarmApiUrl + 'discreteAlarmTypes')
  }

  getAlarmStates() {
    return this.http.get<any[]>(this.alarmApiUrl + 'alarmStates')
  }

  getAlarmSeveritys() {
    return this.http.get<any[]>(this.alarmApiUrl + 'alarm-severitys')
  }

  getAlarmTypes() {
    return this.http.get<any[]>(this.masterApiurl + 'alarm-types')
  }

  getAlarmDataByBusinessEntityId(beId: number, zoneId: string) {
    return this.http.get<any[]>(this.alarmApiUrl + 'organization/' + beId + '/alarms?targetTimeZone=' + zoneId)
  }

  saveAlarmEvent(alarmEvent: any) {
    return this.http.post<any>(this.alarmApiUrl + 'alarm-event', alarmEvent);
  }

  getIncrementalAlarmData(beId: number, zoneId: string, latestTime: number) {
    let url = 'organization/' + beId + '/alarms?targetTimeZone=' + zoneId
    if (null != latestTime) {
      url = url + "&latestTime=" + latestTime;
    } else {
      url = url + "&latestTime=";
    }
    return this.http.get<any[]>(this.alarmApiUrl + url)
  }

  getEnggUnits(): Observable<any[]> {
    return this.http.get<any[]>(environment.baseUrl_gatewayManagement + 'getEnggUnits');
  }


  getApiUrl(): Observable<any> {
    return this.http.get<any>('/assets/apiUrl/apiUrl.json');
  }

  getAssetTagsByAssetId(assetId): Observable<any[]> {
    return this.http.get<any[]>(this.assetApiUrl + 'assetTags/' + assetId);
  }

  getWidgetTagDataByTagIds(tag1, tag2, tag3, url, type) {
    let tagUrl = '';
    if (tag1) {
      tagUrl = tagUrl + "&tag1Id=" + tag1
    } else {
      tagUrl = tagUrl + "&tag1Id="
    }
    if (tag2) {
      tagUrl = tagUrl + "&tag2Id=" + tag2
    } else {
      tagUrl = tagUrl + "&tag2Id="
    }
    if (tag3) {
      tagUrl = tagUrl + "&tag3Id=" + tag3
    } else {
      tagUrl = tagUrl + "&tag3Id="
    }
    return this.http.get<any>(this.apiurl + 'getWidgetDataByTagIds/' + type + '?url=' + encodeURIComponent(url) + tagUrl);
  }

  getDashboardWidgetDataByDataServiceRack(url: string, type: string): Observable<any> {
    let organizationId = sessionStorage.getItem('beId');
    let targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return this.http.get<any>(this.apiurl + 'getDashboardWidgetDataByDataService/' + type + '?url=' + encodeURIComponent(url) + '&organization-id=' + organizationId + '&targetTimeZone=' + targetTimeZone);
  }


  getDashboardData(url: string, type: string, assetId, startDate, endDate) {
    let organizationId = sessionStorage.getItem('beId');
    let userId = parseInt(sessionStorage.getItem('userId'));
    let isAdmin = sessionStorage.getItem("isAdmin");
    let userType = '';
    if (sessionStorage.getItem("isAdmin") == "true") {
      userType = "Admin";
    }
    let targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let urlString = '';
    if (url) {
      urlString = urlString + '?url=' + url
    }
    if (organizationId) {
      urlString = urlString + '&organization-id=' + organizationId
    }
    if (userId) {
      urlString = urlString + '&user-id=' + userId
    }
    if (userType) {
      urlString = urlString + '&user-type=' + userType
    }
    if (targetTimeZone) {
      urlString = urlString + '&target-time-zone=' + targetTimeZone
    }
    if (assetId) {
      urlString = urlString + '&asset-id=' + assetId
    }
    if (startDate) {
      urlString = urlString + '&start-date=' + startDate
    }
    if (endDate) {
      urlString = urlString + '&end-date=' + endDate;
    }
    return this.http.get<any>(this.apiurl + 'widget-data/' + type + urlString);
  }

  getAssetTagsByAssetStandardTagCode(code: string, beId): Observable<any> {
    return this.http.get<any>(this.apiurl + 'asset-standard-tag/asset-tags/' + beId + '/' + code);
  }

  // getAssetTagsByAssetStandardTagId(assetStandardTagId):Observable<any>{
  //   return this.http.get<any>(this.apiurl + 'asset-tags/' +assetStandardTagId);
  // }

  getAlarmsDataByAssetTagIds(assetTagIds, beId): Observable<any> {
    return this.http.post<any>(this.apiurl + 'alarms/' + beId + '/asset-tag-ids', assetTagIds);
  }

  setAssetIds(assetIds: any) {
    this.assetIds = assetIds;
  }

  getAssetsByAssetIds(asset): Observable<any> {
    return this.http.post<any>(this.apiurl + 'assets', asset);
  }

  getAssetsByAssetCategoryCode(code: string, beId): Observable<any> {
    return this.http.get<any>(this.apiurl + 'asset-types/' + beId + '/' + code);
  }

  getAlarmsByAssetIds(assets, beid): Observable<any> {
    return this.http.post<any>(this.apiurl + 'alarms/' + beid + '/asset-ids/', assets);
  }

  getAssetCategoryByAssetype(assetTypeId, beId): Observable<any> {
    return this.http.get<any>(this.apiurl + 'asset-category/' + beId + '/' + assetTypeId);
  }

  getTimeIntervalsFromFile(): Observable<any> {
    return this.http.get<any>('/assets/json/omacRefreshTimeInterval.json');
  }

  setAssetTagsIds(tagIds: any[]) {
    this.assetTagIds = tagIds;
  }

  rackWidgetToggle(obj: any): Observable<any> {
    return this.http.put<any>(this.apiurl + 'widget-toggle', obj);
  }

  getAlarmConfigsByOrgAndAssetTagId(beId: number, entityId: number, alarmTypeId: number, entityTypeId: number) {
    let url = 'alarmConfigsByOrganizationId?organizationId=' + beId
    if (null != entityTypeId) {
      url = url + "&entityTypeId=" + entityTypeId;
    } else {
      url = url + "&entityTypeId=";
    }
    if (null != entityId) {
      url = url + "&entityId=" + entityId;
    } else {
      url = url + "&entityId=";
    }
    if (null != entityTypeId) {
      url = url + "&alarmTypeId=" + alarmTypeId;
    } else {
      url = url + "&alarmTypeId=";
    }

    return this.http.get<any[]>(this.alarmApiUrl + url)
  }

  isAlarmsRaisedForAssetTag(organizationId, assetTagId, targetTimeZone): Observable<any> {
    return this.http.get<any>(this.apiurl + "organizations/" + organizationId + "/is-alarms-raised/" + assetTagId + "?target-time-zone=" + targetTimeZone);
  }

  getAlarmCount(beId: number, zoneId: string, latestTime: number, userId: number, userType: String) {
    let url = 'organizations/' + beId + '/alarms/count?target-time-zone=' + zoneId + '&user-id=' + userId + '&user-type=' + userType
    if (null != latestTime) {
      url = url + "&latest-time=" + latestTime;
    } else {
      url = url + "&latest-time=";
    }
    return this.http.get<any>(this.alarmApiUrl + url)
  }

   setAssetId(assetId: any) {
    this.assetId = assetId;
  }

  getAssetId() {
    return this.assetId;
  }

  getLocationWiseAlarm(TimeZone: string, beId):Observable<any>{
    let userId = sessionStorage.getItem("userId");
    let userType="";
    if (sessionStorage.getItem("isAdmin") == "true") {
      userType = "Admin";
    }
    return this.http.get<any>(this.apiurl +"organizations/"+beId+"/locationwise/alarms?user-id="+userId+"&user-type="+userType+"&time-zone="+TimeZone)
  }

  getAssetIdsByParentAssetId(beId, assetId):Observable<any>{
    let userId = sessionStorage.getItem("userId");
    let userType="";
    if (sessionStorage.getItem("isAdmin") == "true") {
      userType = "Admin";
    }
    return this.http.get<any>(this.apiurl+"organizations/"+beId+"/assets/"+assetId+"/alarms/asset-ids?user-id="+userId+"&user-type="+userType);
  }

}
