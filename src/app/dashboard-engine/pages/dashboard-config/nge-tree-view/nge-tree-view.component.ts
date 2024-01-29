import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { WidgetService } from '../../../services/widget/widget.service';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { ShareddataService } from '../../../shared/shareddata.service';
import { UIModalNotificationPage } from 'global';

@Component({
  selector: 'app-nge-tree-view',
  templateUrl: './nge-tree-view.component.html',
  styleUrls: ['./nge-tree-view.component.css']
})
export class NgeTreeViewComponent implements OnInit, OnDestroy {


  @Input()
  FS;


  @Input()
  DS;

  @Input()
  OND;

  @Input()
  RI;
  // @Input()
  // params;
  @Input()
  origin;
  @Input() interval;

  assets: any[];
  assetsForMultiSelect:  any[] = [];
  userDashboard: boolean;
  constructor(private widgetService: WidgetService, private globalService:globalSharedService, private sharedDataService: ShareddataService) { }
  field: Object = {};
  targetTimeZone: string;
  reload: boolean;
  inter: NodeJS.Timeout;
  fontSize:string;
  da: boolean;
  ngOnInit() {
    this.fontSize=this.FS;
     if(this.origin=="UD")
     {
      // if(typeof this.RI !== 'undefined')
      // {
      // this.inter = setInterval( ()=>{
      //   this.loadDataOnCall(this.DS)},+this.RI*1000);
      // }
     }

      this.loadDataOnCall(this.DS);

     this.userDashboard=false;
     if(this.origin=="UD")
     {
       this.userDashboard=true;
     }
  }

  ngOnDestroy(){
    clearInterval(this.inter);
  }

  loadDataOnCall(ds:Object)
  {

    let url=ds["URL"];
    //debugger;
    if(url != undefined){
      var splitted = url.replace("{paramString}","")
    //debugger;
    let params=ds["params"];
    // this.targetTimeZone=Intl.DateTimeFormat().resolvedOptions().timeZone;
    let queryString="";//"?targetTimeZone=" + this.targetTimeZone;
    for(let k=0; k<params.length;k++)
    {
      queryString=queryString+'' + params[k]["value"];
    }
    url=splitted + queryString;
    this.getDataByDataServiceUrl(url);
    }else{
      this.da = true;
       let data =  [{
        "organizationId": 1,
        "name": "Test asset",
        "description": "",
        "assetCategoryId": 2,
        "isTemplate": false,
        "assetTemplateId": 110,
        "refAssetId": null,
        "gateWayTemplateId": 124,
        "assetCategory": {
            "name": "Equipment",
            "id": 2,
            "createdOn": "Nov 20, 2019 6:06:28 PM",
            "updatedOn": null,
            "createdBy": null,
            "updatedBy": null,
            "status": "Active",
            "createdByUser": null,
            "updatedByUser": null
        },
        "assetTemplate": {
            "organizationId": 1,
            "name": "VTS Asset Template",
            "description": "VTS Asset Template",
            "assetCategoryId": 2,
            "isTemplate": true,
            "assetTemplateId": null,
            "refAssetId": null,
            "gateWayTemplateId": 123,
            "assetCategory": {
                "name": "Equipment",
                "id": 2,
                "createdOn": "Nov 20, 2019 6:06:28 PM",
                "updatedOn": null,
                "createdBy": null,
                "updatedBy": null,
                "status": "Active",
                "createdByUser": null,
                "updatedByUser": null
            },
            "assetTemplate": null,
            "subAssets": null,
            "assetTags": null,
            "isGenanrateAssetTag": true,
            "assetRefId": null,
            "assetParams": null,
            "id": 110,
            "createdOn": null,
            "updatedOn": null,
            "createdBy": null,
            "updatedBy": null,
            "status": "Active",
            "createdByUser": null,
            "updatedByUser": null
        },
        "hasChild":false,
        "subAssets": [
            {
                "organizationId": 1,
                "name": "child asset",
                "description": "",
                "assetCategoryId": 2,
                "isTemplate": false,
                "assetTemplateId": 113,
                "refAssetId": 201,
                "gateWayTemplateId": 124,
                "assetCategory": {
                    "name": "Equipment",
                    "id": 2,
                    "createdOn": "Nov 20, 2019 6:06:28 PM",
                    "updatedOn": null,
                    "createdBy": null,
                    "updatedBy": null,
                    "status": "Active",
                    "createdByUser": null,
                    "updatedByUser": null
                },
                "assetTemplate": {
                    "organizationId": 1,
                    "name": "check",
                    "description": "",
                    "assetCategoryId": 2,
                    "isTemplate": true,
                    "assetTemplateId": null,
                    "refAssetId": null,
                    "gateWayTemplateId": 123,
                    "assetCategory": {
                        "name": "Equipment",
                        "id": 2,
                        "createdOn": "Nov 20, 2019 6:06:28 PM",
                        "updatedOn": null,
                        "createdBy": null,
                        "updatedBy": null,
                        "status": "Active",
                        "createdByUser": null,
                        "updatedByUser": null
                    },
                    "assetTemplate": null,
                    "subAssets": null,
                    "assetTags": null,
                    "isGenanrateAssetTag": true,
                    "assetRefId": null,
                    "assetParams": null,
                    "id": 113,
                    "createdOn": null,
                    "updatedOn": null,
                    "createdBy": null,
                    "updatedBy": null,
                    "status": "Active",
                    "createdByUser": null,
                    "updatedByUser": null
                },
                "hasChild" :false,
                "subAssets": [],
                "assetTags": null,
                "isGenanrateAssetTag": true,
                "assetRefId": null,
                "assetParams": null,
                "id": 206,
                "createdOn": null,
                "updatedOn": null,
                "createdBy": null,
                "updatedBy": null,
                "status": "Active",
                "createdByUser": null,
                "updatedByUser": null
            }
        ],
        "assetTags": null,
        "isGenanrateAssetTag": true,
        "assetRefId": null,
        "assetParams": null,
        "id": 201,
        "createdOn": null,
        "updatedOn": null,
        "createdBy": null,
        "updatedBy": null,
        "status": "Active",
        "createdByUser": null,
        "updatedByUser": null
    }]
    this.assets = data;
    this.assets = this.assets.sort((a, b) => a.name.localeCompare(b.name))
    data.forEach(asset => {
      if (null != asset.subAssets && asset.subAssets.length != 0) {
        asset.hasChild = true;
        this.iterateTheSubList(asset.subAssets)
      }
    })
    this.assetsForMultiSelect = this.getFormattedAssetList(data);
    // this.assetsForMultiSelect = data;
    this.field = this.formatedResponse(this.assetsForMultiSelect);

    }
  }
  @ViewChild(UIModalNotificationPage) modelNotification;


  getDataByDataServiceUrl(url: string) {
    this.widgetService.getDashboardWidgetDataByDataService(url, "treeHierarchy").subscribe(data => {

      let organizationId = sessionStorage.getItem('beId');
      this.da = true;
      this.assets = data;
      this.assets = this.assets.sort((a, b) => a.name.localeCompare(b.name))
      data.forEach(asset => {
        if (null != asset.subAssets && asset.subAssets.length != 0) {
          asset.hasChild = true;
          this.iterateTheSubList(asset.subAssets)
        }
      })
      this.assetsForMultiSelect = this.getFormattedAssetList(data);
      // this.assetsForMultiSelect = data;
      this.field = this.formatedResponse(this.assetsForMultiSelect);
      this.displayParentNode(this.assets[0])
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, "Unable to pull data of download");
      })
  }

  displayParentNode(data: any) {
    // alert("Data:"+ data.id)
    // data.category = 'Equipment'
    this.sharedDataService.setCategory(data);
  }


  formatedResponse(response) {
    return this.field = {
      dataSource: response,
      value: 'id',
      parentValue: 'refAssetId',
      text: 'name',
      hasChildren: 'hasChild',
      selected: 'isSelected'
    };

  }

  iterateTheSubList(subAssets: any[]) {
    const that = this;
    subAssets.forEach(asset => {
      if (null != asset.subAssets && asset.subAssets.length != 0) {
        asset.hasChild = true;
        this.iterateTheSubList(asset.subAssets)
      }
    })
  }

  assetIterate(assets) {
    const that = this;
    return assets && assets.length ? assets.map(function (o) {
      var returnObj = {
        "id": o.id,
        "name": o.name,
        "expanded" : true,
        "refAssetId": o.refAssetId,
        "child": that.assetIterate(o.subAssets),
      }
      if (o.refAssetId) {
        returnObj["refAssetId"] = o.refAssetId;
      }
      return returnObj;
    }) : [];
  }


  getFormattedAssetList(list) {
    const that = this;
    return list.map(function (l) {
      return {
        id: l.id,
        name: l.name,
        expanded : true,
        child: that.assetIterate(l.subAssets),
        data: l
      };
    });
  }

  selectedNode(event) {
    // alert('Node selected::' + event.nodeData.text)
    // if(event.nodeData.id == '251'){
    //   event.nodeData.category = 'Area';
    // }else if(event.nodeData.id == '274'){
    //   event.nodeData.category = 'Human';
    // }else{
    //   event.nodeData.category = 'Equipment';
    // }
    let id = event.nodeData.id;
    // console(this.assets)
    let asset = this.getAssetData(id, this.assets);
    this.sharedDataService.setCategory(asset);
  }


  getAssetData(id: any, assets: any[]) {
    let assetData;
    for(let asset of assets){
      if(asset.id == id){
        assetData = asset;
        break;
      }else{
        if(null != asset.subAssets && asset.subAssets.length != 0){
          assetData = this.getAssetData(id, asset.subAssets);
          if(assetData){
            break;
          }
        }
      }
    }
    return assetData;
  }
}
