import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MaskedTextBoxComponent } from "@syncfusion/ej2-angular-inputs";
import { TreeViewComponent } from '@syncfusion/ej2-angular-navigations';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { ShareddataService } from '../../../shared/shareddata.service';
import { WidgetService } from 'src/app/dashboard-engine/services/widget/widget.service';
@Component({
  selector: 'app-rack-tree-view',
  templateUrl: './rack-tree-view.component.html',
  styleUrls: ['./rack-tree-view.component.css']
})
export class RackTreeViewComponent implements OnInit, OnDestroy {


  @ViewChild('treeview')
  public tree: TreeViewComponent;
  @ViewChild("maskObj") maskObj: MaskedTextBoxComponent;

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
  assetsForMultiSelect: any[] = [];
  userDashboard: boolean;
  assetTagIds: any[];
  assetId: any;
  // assetDataList: any[];
  constructor(private widgetService: WidgetService, private globalService: globalSharedService, private sharedDataService: ShareddataService) { }
  field: Object = {};
  targetTimeZone: string;
  reload: boolean;
  inter: NodeJS.Timeout;
  fontSize: string;
  da: boolean;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;
  selectedAssetIds: Number[] = [];
  selectedAsset: any;
  ngOnInit() {
    this.assetId = this.widgetService.getAssetId();
    let assetIds = this.widgetService.assetIds;
    this.assetTagIds = this.widgetService.assetTagIds;
    if (assetIds && assetIds.length) {
        this.getAssetsByAssetIDs(assetIds);
    } else {
      this.loadDataOnCall(this.DS);
    }
    this.fontSize = this.FS;
    this.userDashboard = false;
    if (this.origin == "UD") {
      this.userDashboard = true;
    }
  }



  getAssetsByAssetIDs(assetIds) {
    let asset = {
      "assetIds": assetIds
    }
    this.widgetService.getAssetsByAssetIds(asset).subscribe(data => {
      this.da = true;
      if (data && data.length) {
        this.assets = data;
        data.forEach(asset => {
          if (null != asset.subAssets && asset.subAssets.length != 0) {
            asset.hasChild = true;
            this.iterateTheSubList(asset.subAssets)
          }
        })
        this.assetsForMultiSelect = this.getFormattedAssetList(data);
        // this.assetsForMultiSelect = data;
        this.field = this.formatedResponse(this.assetsForMultiSelect);
        this.field['dataSource'][0].isSelected = true;
        this.displayParentNode(this.assets[0])
      } else {
        this.da = false;
      }
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, "Unable to pull data of download");
      })
  }

  ngOnDestroy() {
    this.widgetService.setAssetIds(null);
    this.widgetService.setAssetTagsIds(null);
    this.selectedAsset = null;
    this.selectedAssetIds.length = 0;
    clearInterval(this.inter);
  }

  loadDataOnCall(ds: Object) {
    let url;
    let organizationId = sessionStorage.getItem('beId');
    url = this.widgetService.getApiUrl().subscribe(data => {
      let api = data.api;
      url = api + 'AssetManagementService/asset/' + organizationId;
      this.getDataByDataServiceUrl(url);
    })

  }
  @ViewChild(UIModalNotificationPage) modelNotification;


  getDataByDataServiceUrl(url: string) {
    this.widgetService.getDashboardData(url, "treeHierarchy", null, null, null).subscribe(data => {
      this.da = true;
      if (data && data.length) {
        let assetsData = data;
        this.assets = JSON.parse(JSON.stringify(data));
        this.assetsForMultiSelect = this.getFormattedAssetList(assetsData);
        this.field = this.formatedResponse(this.assetsForMultiSelect);
        if (this.assetId) {
          let asset = this.getAssetData(this.assetId, this.assets);
          this.setSelectedAssetIds(this.field['dataSource']);
          this.setFieldByAssetId(this.field['dataSource'])
          this.displayParentNode(asset)
        }
        else {
          this.field['dataSource'][0].isSelected = true;
          this.displayParentNode(assetsData[0])
        }
      } else {
        this.da = false;
      }

    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, "Unable to pull data of download");
      })
  }

  setSelectedAssetIds(assets: any) {
    this.getAsset(this.assetId, assets);
    while (null != this.selectedAsset.refAssetId) {
      this.getAsset(this.selectedAsset.refAssetId, assets);
    }
  }

  getAsset(selectedAssetId, assets) {
    assets.forEach((asset) => {
      if (selectedAssetId == asset.id) {
        this.selectedAsset = asset;
        if (!this.selectedAssetIds.includes(asset.id)) {
          this.selectedAssetIds.push(asset.id);
        }
      }
      if (null != asset.child && asset.child.length > 0)
        this.getAsset(selectedAssetId, asset.child)
    })
  }

  setFieldByAssetId(dataSource) {
    dataSource.forEach((element, index) => {
      if (this.selectedAssetIds.includes(element.id)) {
        element.expanded = true;
      }
      if (this.assetId == element.id) {
        element.isSelected = true;
      }
      if (element.child.length > 0) {
        this.setFieldByAssetId(element.child);
      }
    });

  }
  displayParentNode(data: any) {
    this.widgetService.setAssetTagsIds(this.assetTagIds);
    this.sharedDataService.setRackAsset(data);
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
        "expanded": false,
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
        expanded: false,
        child: that.assetIterate(l.subAssets),
        data: l
      };
    });
  }

  selectedNode(event) {
    let id = event.nodeData.id;
    let asset = this.getAssetData(id, this.assets);
    this.sharedDataService.setRackAsset(asset);

  }


  getAssetData(id: any, assets: any[]) {
    let assetData;
    for (let asset of assets) {
      if (asset.id == id) {
        assetData = asset;
        break;
      } else {
        if (null != asset.subAssets && asset.subAssets.length != 0) {
          assetData = this.getAssetData(id, asset.subAssets);
          if (assetData) {
            break;
          }
        }
      }
    }
    return assetData;
  }



  filterAsset(filterText: string) {
    let assetDataList = [];
    assetDataList = JSON.parse(JSON.stringify(this.assets));
    if (filterText.length > 0) {
      this.applyFilter(assetDataList, filterText);
      assetDataList = assetDataList.filter(
        node => node.visible === true);
    }
    if (assetDataList.length == 0) {
      this.da = false;
    } else {
      this.da = true;
      this.assetsForMultiSelect = this.getFormattedAssetList(assetDataList);
      this.field = this.formatedResponse(this.assetsForMultiSelect);
      this.directiveRef.scrollToTop();
      this.directiveRef.update();
      this.field['dataSource'][0].isSelected = true;
      this.displayParentNode(this.assets[0])
    }

  }

  // Filtering the Nodes by user input
  applyFilter(list, searchString) {
    const that = this;
    let isSubMenusVisible;
    return list.map(function (d) {
      isSubMenusVisible = null;
      if (d.subAssets && d.subAssets.length) {
        d.subAssets = that.applyFilter(d.subAssets, searchString);
        isSubMenusVisible = d.subAssets.filter(function (sm) {
          return sm.visible;
        });
      }
      d.visible = d.name.toLowerCase().includes(searchString.toLowerCase()) || (isSubMenusVisible && isSubMenusVisible.length > 0 ? true : false);
      if (d.subAssets && d.subAssets.length) {
        d.subAssets = d.subAssets.filter(sub => sub.visible)
      }
      return d;
    });
  }


}
