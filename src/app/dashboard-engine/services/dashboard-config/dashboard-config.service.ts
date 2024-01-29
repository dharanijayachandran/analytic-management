import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Widget, WidgetData } from '../../model/widget';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})

export class DashboardConfigService {

  apiurl = environment.baseUrl_DashboardEngine;
  constructor(private http: HttpClient) {

   }

  getWidgetListByDashboardId(id: number): Observable<Widget[]> {
    return this.http.get<Widget[]>(this.apiurl + 'widgetList/'  + id);
  }
  getWidgetDetailByWidgetId(id: number): Observable<Widget[]> {
    return this.http.get<Widget[]>(this.apiurl + 'widgetDetail/'  + id);
  }
  getWidgetDataByWidgetId(id: number): Observable<WidgetData[]> {
    return this.http.get<WidgetData[]>(this.apiurl + 'widgetData/'  + id);
  }
  getWidgetDataAnyByWidgetId(id: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiurl + 'widgetData/'  + id);
  }
  addWidget(widget: Widget): Observable<Widget> {
    return this.http.post<Widget>(`${this.apiurl + 'addWidget'}`, widget, httpOptions);
  }
  addWidgetInfo(widgetInfo: Widget): Observable<Widget> {
    return this.http.post<Widget>(`${this.apiurl + 'addWidgetInfo'}`, widgetInfo, httpOptions);
  }
  addWidgetAttribute(widgetAtt: Widget): Observable<Widget> {
    return this.http.post<Widget>(`${this.apiurl + 'addWidgetAttribute'}`, widgetAtt, httpOptions);
  }
  updateWidget(widget: Widget): Observable<Widget> {
    return this.http.put<Widget>(`${this.apiurl + 'updateWidget'}`, widget, httpOptions);
  }
  deleteWidget(widget: Widget): Observable<Widget> {
    return this.http.put<Widget>(`${this.apiurl + 'deleteWidget'}`, widget, httpOptions);
  }
}
