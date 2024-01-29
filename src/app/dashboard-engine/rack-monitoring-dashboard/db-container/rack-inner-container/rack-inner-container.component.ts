import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ShareddataService } from '../../../shared/shareddata.service';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { WidgetService } from '../../../services/widget/widget.service';

@Component({
  selector: 'app-rack-inner-container',
  templateUrl: './rack-inner-container.component.html',
  styleUrls: ['./rack-inner-container.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RackInnerContainerComponent implements OnInit {
  assetData: any;
  assetId: any;
  category: any;
  assetTags: any[];
  assetTemplateTags: any[];
  cardWidgets: any[] = [];
  showLoaderImage = false;
  loadChildComponent = false;
  tempTag1;
  tempTag2;
  tempTag3;
  humidityTag1;
  humidityTag2;
  humidityTag3;
  temperatureLineZone = {
    'XT': 'Time',
    'YT': 'Deg C',
    'RI': 60,
    'TYP': 'Spline',
    'MIS': 33,
    'MAS': 66,
    'tagName': '',
    'tagId': ''
  }
  // humidityChartArea = {};
  humidityChartArea = {
    'XT': 'Time',
    'YT': 'Percentage',
    'RI': 60,
    'TYP': 'Area',
    'tagName': '',
    'tagId': ''
  }
  green: any[] = [];
  aqua: any[] = [];
  inter: NodeJS.Timeout;
  extraCard: any[];
  Area: string;
  tempTag: any;

  downloadData =[];
  displayedColumns = [];
  displayTableHeader = [];
  constructor(private sharedData: ShareddataService, private dashboardService: DashboardService,
    private widgetService: WidgetService, private globalService: globalSharedService) { }

  ngOnDestroy() {
    this.widgetService.iconFromDashboard = false;
  }

  ngOnInit(): void {
    this.showLoaderImage = true;
    this.widgetService.iconFromDashboard = true;
    this.sharedData.getRackAsset().subscribe(data => {
      this.showLoaderImage = true;
      this.loadChildComponent = false;
      this.assetData = data;
      this.assetId = this.assetData.id
      let assetTemplateId = this.assetData.assetTemplateId;
      let assetTypeId = this.assetData.typeId;
      this.getAssetCategoryByAssetType(assetTypeId, assetTemplateId);
      this.showLoaderImage = false;
    })

  }
  getAssetCategoryByAssetType(assetTypeId: any, assetTemplateId) {
    let organizationId = sessionStorage.getItem('beId');
    this.category = '';
    this.widgetService.getAssetCategoryByAssetype(assetTypeId,organizationId).subscribe(assetCategory => {
      if(assetCategory){
        this.category = assetCategory.code;
        if(assetTemplateId){
          this.getAssetTagsByAssetId(assetTemplateId);
        }

      }
    })
  }


  getAssetTagsByAssetId(assetTemplateId: any) {
    this.widgetService.getAssetTagsByAssetId(assetTemplateId).subscribe(templatTags => {
      this.cardWidgets = [];
      this.green = [];
      this.aqua = [];
      this.extraCard = [];
      this.showLoaderImage = true;
      this.assetTemplateTags = templatTags;
      this.widgetService.getAssetTagsByAssetId(this.assetId).subscribe(assetTags => {
        this.assetTags = assetTags
        if (this.assetTemplateTags) {
          this.assetTemplateTags.forEach(templateTag => {
            let card;
            if (templateTag.name == 'Humidity') {
              for (let tag of this.assetTags) {
                if (tag.assetTemplateTagId == templateTag.id) {
                  card = {
                    'STL': 'widget widget-stats bg-aqua',
                    'TL': 'Humidity (%)',
                    'ICN': 'icon-humidity',
                    'FS': '20px',
                    'dcstatus': '',
                    'RI': 60,
                    'tagId': tag.id,
                    'tagName': tag.name
                  }
                  this.humidityChartArea = {
                    'XT': 'Time',
                    'YT': 'Percentage',
                    'RI': 60,
                    'TYP': 'Area',
                    'tagId': tag.id,
                    'tagName': tag.name
                  }
                  this.aqua.push(card);
                  this.humidityTag1 = tag.id
                  break;
                }
              }
            } else if (templateTag.name == 'Humidity 1') {
              for (let tag of this.assetTags) {
                if (tag.assetTemplateTagId == templateTag.id) {
                  card = {
                    'STL': 'widget widget-stats bg-aqua',
                    'TL': 'Humidity 1(%)',
                    'ICN': 'icon-humidity',
                    'FS': '20px',
                    'dcstatus': '',
                    'RI': 60,
                    'tagId': tag.id,
                    'tagName': tag.name
                  }
                  this.humidityChartArea = {
                    'XT': 'Time',
                    'YT': 'Percentage',
                    'RI': 60,
                    'TYP': 'Area',
                    'tagId': tag.id,
                    'tagName': tag.name
                  }
                  this.humidityTag1 = tag.id
                  this.aqua.push(card)
                  // this.extraCard.push(card);
                  break;
                }
              }
            }
            else if (templateTag.name == 'Humidity 2') {
              for (let tag of this.assetTags) {
                if (tag.assetTemplateTagId == templateTag.id) {
                  card = {
                    'STL': 'widget widget-stats bg-aqua',
                    'TL': 'Humidity 2(%)',
                    'ICN': 'icon-humidity',
                    'FS': '20px',
                    'dcstatus': '',
                    'RI': 60,
                    'tagId': tag.id,
                    'tagName': tag.name
                  }
                  this.humidityChartArea = {
                    'XT': 'Time',
                    'YT': 'Percentage',
                    'RI': 60,
                    'TYP': 'Area',
                    'tagId': tag.id,
                    'tagName': tag.name
                  }
                  this.humidityTag2 = tag.id
                  this.aqua.push(card)
                  // this.extraCard.push(card);
                  break;
                }
              }
            }
            else if (templateTag.name == 'Humidity 3') {
              for (let tag of this.assetTags) {
                if (tag.assetTemplateTagId == templateTag.id) {
                  card = {
                    'STL': 'widget widget-stats bg-aqua',
                    'TL': 'Humidity 3(%)',
                    'ICN': 'icon-humidity',
                    'FS': '20px',
                    'dcstatus': '',
                    'RI': 60,
                    'tagId': tag.id,
                    'tagName': tag.name
                  }
                  this.humidityChartArea = {
                    'XT': 'Time',
                    'YT': 'Percentage',
                    'RI': 60,
                    'TYP': 'Area',
                    'tagId': tag.id,
                    'tagName': tag.name
                  }
                  this.humidityTag3 = tag.id
                  this.aqua.push(card);
                  break;
                }
              }
            }
            else if (templateTag.name == 'Gateway Power') {
              for (let tag of this.assetTags) {
                if (tag.assetTemplateTagId == templateTag.id) {
                  card = {
                    'STL': 'widget widget-stats bg-aqua',
                    'ICN': 'fa fa-power-off',
                    'TL': 'Iot Power State',
                    'FS': '20px',
                    'dcstatus': '',
                    'RI': 60,
                    'tagId': tag.id,
                    'tagName': tag.name
                  }
                  this.aqua.push(card);
                  break;
                }
              }
            }
            else if (templateTag.name == 'Temperature') {
              for (let tag of this.assetTags) {
                if (tag.assetTemplateTagId == templateTag.id) {
                  card = {
                    'STL': 'widget widget-stats bg-aqua',
                    'ICN': 'fa fa-thermometer-half',
                    'TL': 'Temp. (Celsius)',
                    'FS': '20px',
                    'dcstatus': '',
                    'RI': 60,
                    'tagId': tag.id,
                    'tagName': tag.name
                  }
                  this.temperatureLineZone = {
                    'XT': 'Time',
                    'YT': 'Deg C',
                    'RI': 60,
                    'TYP': 'Spline',
                    'MIS': 33,
                    'MAS': 66,
                    'tagName': tag.name,
                    'tagId': tag.id
                  }
                  this.tempTag1 = tag.id;
                  this.aqua.push(card);
                  break;
                }
              }
            }
            else if (templateTag.name == 'Temperature 1') {
              for (let tag of this.assetTags) {
                if (tag.assetTemplateTagId == templateTag.id) {
                  card = {
                    'STL': 'widget widget-stats bg-aqua',
                    'ICN': 'fa fa-thermometer-half',
                    'TL': 'Temp. 1(Celsius)',
                    'FS': '20px',
                    'dcstatus': '',
                    'RI': 60,
                    'tagId': tag.id,
                    'tagName': tag.name
                  }
                  this.temperatureLineZone = {
                    'XT': 'Time',
                    'YT': 'Deg C',
                    'RI': 60,
                    'TYP': 'Spline',
                    'MIS': 33,
                    'MAS': 66,
                    'tagName': tag.name,
                    'tagId': tag.id
                  }
                  this.tempTag1 = tag.id;
                  this.aqua.push(card);
                  break;
                }
              }
            }
            else if (templateTag.name == 'Temperature 2') {
              for (let tag of this.assetTags) {
                if (tag.assetTemplateTagId == templateTag.id) {
                  card = {
                    'STL': 'widget widget-stats bg-aqua',
                    'ICN': 'fa fa-thermometer-half',
                    'TL': 'Temp. 2(Celsius)',
                    'FS': '20px',
                    'dcstatus': '',
                    'RI': 60,
                    'tagId': tag.id,
                    'tagName': tag.name
                  }
                  this.temperatureLineZone = {
                    'XT': 'Time',
                    'YT': 'Deg C',
                    'RI': 60,
                    'TYP': 'Spline',
                    'MIS': 33,
                    'MAS': 66,
                    'tagName': tag.name,
                    'tagId': tag.id
                  }
                  this.tempTag2 = tag.id;
                  this.aqua.push(card);
                  break;
                }
              }
            }
            else if (templateTag.name == 'Temperature 3') {
              for (let tag of this.assetTags) {
                if (tag.assetTemplateTagId == templateTag.id) {
                  card = {
                    'STL': 'widget widget-stats bg-aqua',
                    'ICN': 'fa fa-thermometer-half',
                    'TL': 'Temp. 3(Celsius)',
                    'FS': '20px',
                    'dcstatus': '',
                    'RI': 60,
                    'tagId': tag.id,
                    'tagName': tag.name
                  }
                  this.temperatureLineZone = {
                    'XT': 'Time',
                    'YT': 'Deg C',
                    'RI': 60,
                    'TYP': 'Spline',
                    'MIS': 33,
                    'MAS': 66,
                    'tagName': tag.name,
                    'tagId': tag.id
                  }
                  this.tempTag3 = tag.id;
                  this.aqua.push(card);
                  break;
                }
              }
            }
            else if (templateTag.name == 'Door Status') {
              for (let tag of this.assetTags) {
                if (tag.assetTemplateTagId == templateTag.id) {
                  card = {
                    'STL': 'widget widget-stats bg-green-lighter',
                    'ICN': 'fas fa-door-open',
                    'TL': 'Door Status',
                    'FS': '20px',
                    'dcstatus': '',
                    'RI': 60,
                    'tagId': tag.id,
                    'tagName': tag.name
                  }
                  this.aqua.push(card);
                  break;
                }
              }
            }
            else if (templateTag.name == 'Water Leakage') {
              for (let tag of this.assetTags) {
                if (tag.assetTemplateTagId == templateTag.id) {
                  card = {
                    'STL': 'widget widget-stats bg-green-lighter',
                    'ICN': 'icon-pipe-leakage',
                    'TL': 'Water Leakage',
                    'FS': '20px',
                    'dcstatus': '',
                    'RI': 60,
                    'tagId': tag.id,
                    'tagName': tag.name
                  }
                  this.aqua.push(card);
                  break;
                }
              }
            }
            else if (templateTag.name == 'PDU2 Power') {
              for (let tag of this.assetTags) {
                if (tag.assetTemplateTagId == templateTag.id) {
                  card = {
                    'STL': 'widget widget-stats bg-green-lighter',
                    'ICN': 'icon-plug',
                    'TL': 'PDU 02',
                    'FS': '20px',
                    'dcstatus': '',
                    'RI': 60,
                    'tagId': tag.id,
                    'tagName': tag.name
                  }
                  this.aqua.push(card);
                  break;
                }
              }
            }
            else if (templateTag.name == 'Battery Status') {
              for (let tag of this.assetTags) {
                if (tag.assetTemplateTagId == templateTag.id) {
                  card = {
                    'STL': 'widget widget-stats bg-navy',
                    'ICN': 'icon-vertical-battery',
                    'TL': 'IoT Battery (%)',
                    'FS': '20px',
                    'dcstatus': '',
                    'RI': 60,
                    'tagId': tag.id,
                    'tagName': tag.name
                  }
                  this.aqua.push(card);
                  break;
                }
              }
            }
            else if (templateTag.name == 'PDU1 Power') {
              for (let tag of this.assetTags) {
                if (tag.assetTemplateTagId == templateTag.id) {
                  card = {
                    'STL': 'widget widget-stats bg-green-lighter',
                    'ICN': 'icon-plug',
                    'TL': 'PDU 01',
                    'FS': '20px',
                    'dcstatus': '',
                    'RI': 60,
                    'tagId': tag.id,
                    'tagName': tag.name,
                    'color': 'blue'
                  }
                  this.aqua.push(card);
                  break;
                }
              }
            }
            if (card) {
              // this.cardWidgets.push(card);
            }

          })
        }

        this.loadChildComponent = true;
        this.showLoaderImage = false;
      })

    })
  }


  // Dynamic height for line Chart
  lineChartHeight(totalNumberOfCards) {
    if (totalNumberOfCards.length > 8) {
      let totalNumberOfCardRows = totalNumberOfCards.length / 2;
      let evenOrOddCards = Number.isInteger(totalNumberOfCardRows);
      if (!evenOrOddCards) {
        var str = totalNumberOfCardRows.toString();
        let splittedDecimalValue = str.split('.');
        totalNumberOfCardRows = Number(splittedDecimalValue[0]) + 1;
      }

      let totalNumberOfCardPaddingSpace = (totalNumberOfCardRows - 1) * 8;
      let cardContainerHeight = totalNumberOfCardRows * 116;
      let mergeCardHeightWithPadding = totalNumberOfCardPaddingSpace + cardContainerHeight;
      mergeCardHeightWithPadding /= 2;
      return { 'height': mergeCardHeightWithPadding - 5 + "px" };
    } else {
      return { 'height': 240 + "px" };
    }

  }





}
