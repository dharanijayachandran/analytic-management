import { Injectable, ɵConsole } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AssetTemplate } from 'src/app/shared/model/assetTemplate';
import { AssetTag } from 'src/app/shared/model/assetTag';
import { Asset } from 'src/app/shared/model/asset';
import { environment } from 'src/environments/environment';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class AssetService {

  apiurl = environment.baseUrl_DashboardEngine;
  constructor(private http: HttpClient) { }

  getAssetByOrganizationId(organizationId): Observable<Asset[]> {
    return this.http.get<Asset[]>(this.apiurl + 'assetsByOrganizationId/' + organizationId);
  }
  getAssetDataByAssetId(assetId, startDate, endDate, targetTimeZone, assetTagIds): Observable<any> {
    return this.http.get<any>(this.apiurl + 'assetDataByAssetId?assetId=' + assetId + '&startDate=' + startDate + '&endDate=' + endDate + '&targetTimeZone=' + targetTimeZone + '&assetTagIds=' + assetTagIds);
  }

  getAssetDataByAssetTaglist(assetTagDetals): Observable<any> {
    return this.http.post<any>(this.apiurl + 'assetDataByAssetTagIds', assetTagDetals);
  }
  getAssetByAssetId(assetId): Observable<AssetTag[]> {
    return this.http.get<AssetTag[]>(this.apiurl + 'assetTags/' + assetId);
  }

  // To get all the records for asset template list
  getAssetList(organizationId: number): Observable<AssetTemplate[]> {
    let userId=0;
     return this.http.get<AssetTemplate[]>(this.apiurl + 'assetsByOrganiztionId/' + organizationId+"?user-id="+userId);
   }

}
