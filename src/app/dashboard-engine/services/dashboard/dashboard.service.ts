import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { ActiveWidgetList, Dashboard, DashboardList } from '../../model/dashboard';
import { DashboardWidget } from '../../model/widget';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})

export class DashboardService {
  apiurl = environment.baseUrl_DashboardEngine;
  constructor(private http: HttpClient) {

  }


  getdashboardListByBeId(id: number): Observable<DashboardList[]> {
    let userId = sessionStorage.getItem("userId");
    let userType;
    if (sessionStorage.getItem("isAdmin") == "true") {
      userType = "Admin";
    }
    else {
      userType = "";
    }
    return this.http.get<DashboardList[]>(this.apiurl + 'getDashboardListByBeId/' + id + "?user-id=" + userId + "&user-type=" + userType);
  }

  getNonDeletedDashboardListByBeId(id: number): Observable<DashboardList[]> {
    let userId = sessionStorage.getItem("userId");
    let userType;
    if (sessionStorage.getItem("isAdmin") == "true") {
      userType = "Admin";
    }
    else {
      userType = "";
    }
    return this.http.get<DashboardList[]>(this.apiurl + 'getNonDeletedDashboardListByBeId/' + id + "?user-id=" + userId + "&user-type=" + userType);
  }

  getdashboardWidgetListByDashboardId(id: number): Observable<ActiveWidgetList[]> {
    alert('getdashboardWidgetListByDashboardId' + id);
    return this.http.get<ActiveWidgetList[]>(this.apiurl + 'getDashboardWidgetListByDashboardId/' + id);
  }

  getdashboardDetailsByDashboardId(id: number): Observable<DashboardList> {
    return this.http.get<DashboardList>(this.apiurl + 'dashboardDetail/' + id);
  }
  addDashboard(dashboard: Dashboard): Observable<Dashboard> {
    return this.http.post<Dashboard>(`${this.apiurl + 'addDashboard'}`, dashboard, httpOptions);
  }
  addDashboardWidget(dashboardWidget: DashboardWidget): Observable<Dashboard> {

    return this.http.post<Dashboard>(`${this.apiurl + 'addDashboardWidget'}`, dashboardWidget, httpOptions);
  }
  updateDashboard(dashboard: Dashboard): Observable<Dashboard> {
    return this.http.put<Dashboard>(`${this.apiurl + 'updateDashboard'}`, dashboard, httpOptions);
  }
  deleteDashboard(id: number, userId: Number): Observable<Dashboard> {
    return this.http.delete<Dashboard>(this.apiurl + 'dashboard/' + id + "/" + userId);
  }
}
