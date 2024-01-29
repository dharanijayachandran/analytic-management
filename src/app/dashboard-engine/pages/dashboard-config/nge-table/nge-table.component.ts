import { Component, OnInit,TemplateRef, Input, ViewChild,ValueProvider, OnDestroy } from '@angular/core';
import { PageSettingsModel, GridComponent,ToolbarItems, EditSettingsModel, SearchSettingsModel, PdfExportProperties} from '@syncfusion/ej2-angular-grids';
  import { ClickEventArgs } from '@syncfusion/ej2-navigations'
import { WidgetService } from '../../../services/widget/widget.service';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';

import { ShareddataService } from '../../../shared/shareddata.service';
import { UIModalNotificationPage } from 'global';
@Component({
  selector: 'app-nge-table',
  templateUrl: './nge-table.component.html',
  providers: [],
  styleUrls: ['./nge-table.component.css']
})
export class NgeTableComponent implements OnInit, OnDestroy {
  public data: Object[];
  public pageSettings: PageSettingsModel;
  public columns: Object[];
  public initialSort: Object;
  public editSettings: EditSettingsModel;
  public toolbar: ToolbarItems[] | object;
  //@ViewChild('grid')
  @ViewChild('grid') public Grid: GridComponent;
  public grid: GridComponent;
  public toolbarOptions: ToolbarItems[];
  public searchOptions: SearchSettingsModel;
  @Input() dataSource;
  @Input() DC;
  @Input() RI;
  @Input() origin;
  public dataSourceR: Object[];
  @ViewChild(UIModalNotificationPage) modelNotification;
  targetTimeZone: string;
  da: boolean;
  inter: NodeJS.Timeout;
  subscription: any;
  constructor(private widgetService: WidgetService,
    private globalService:globalSharedService,
    private sharedData: ShareddataService) { }

  ngOnInit(): void {
     if(this.origin=="UD")
     {
      if(typeof this.RI !== 'undefined')
      {
      this.inter = setInterval( ()=>{
        this.loadDataOnCall(this.dataSource,"auto")},+this.RI*1000);
      }
     }
    this.loadDataOnCall(this.dataSource,"init");
    this.subscription =  this.sharedData.getChangedMessage().subscribe(message => {
          this.loadDataOnCall(this.dataSource, "auto")
    })
    if(typeof  this.dataSourceR!=="undefined")
    {
      this.da=true;
      this.createColumns(this.dataSourceR[0])

      this.data = this.dataSourceR;
      this.searchOptions = {operator: 'contains', key: '', ignoreCase: true };
      this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true };

      // this.toolbar = ['Add', 'Edit', 'Delete', 'Update', 'Cancel',
          //  { text: 'Click', tooltipText: 'Click', prefixIcon: 'e-expand', id: 'Click' }];
      this.initialSort = {
        columns: []
    };
      this.pageSettings = { pageSizes: [10,20,50,100,500,1000,5000], pageCount: 5,pageSize:10 };
      this.toolbarOptions = ['PdfExport','ExcelExport','Search'];

    }
    else
    {
      this.da=false;
    }
  }
  ngOnDestroy() {
    clearInterval( this.inter);
     this.subscription.unsubscribe();
  }
  loadDataOnCall(ds:Object,loadType:string)
  {
    let url=ds["URL"];

    if(url != undefined){
      var splitted = url.replace("{paramString}","")

    let params=ds["params"];
    this.targetTimeZone=Intl.DateTimeFormat().resolvedOptions().timeZone;
    let queryString="?targetTimeZone=" + this.targetTimeZone;
    let dayDiff=0;
    for(let k=0; k<params.length;k++)
    {

      if(params[k]["name"]=="dayDiff"||params[k]["name"]=="currentDate")
      {
        if(params[k]["name"]=="currentDate")
        {
          //do nothing right now..
        }
        else{
          dayDiff=+params[k]["value"];
          let endDate = new Date();
          let startDate=endDate.setDate(endDate.getDate()-dayDiff);
          let startDateN = new Date(startDate)
          queryString=queryString+'&endDate='+ endDate.toISOString();
          queryString=queryString+'&startDate='+ startDateN.toISOString();
        }
      }
      else
      {
        queryString=queryString+'&' + params[k]["name"]+"="+params[k]["value"];
      }
    }
    url=splitted + queryString;

    this.getDataByDataServiceUrl(url);
    }


  }

  getDataByDataServiceUrl(url:string)
  {

    this.widgetService.getDashboardWidgetDataByDataService(url,"tableMatrix").subscribe(resp=>{

      if(resp.length>0)
      {
        this.da=true;
        this.data=resp;
      }
      else{
        //alert('no records');
        this.da=false;
      }
    },
       error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, "Unable to pull data of for linechart widget");
  })
  }
  // toolbarClick(args: ClickEventArgs): void {
  //     if (args.item.id === 'Grid_pdfexport') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
  //         this.grid.pdfExport();
  //     }
  // }
  load() {
    const rowHeight: number = this.Grid.getRowHeight();  // height of the each row
    const gridHeight: any = this.Grid.height;  // grid height
    const pageSize: number = this.Grid.pageSettings.pageSize;   // initial page size
    const pageResize: any = (gridHeight - (pageSize * rowHeight)) / rowHeight; // new page size is obtained here
    this.Grid.pageSettings.pageSize = pageSize + Math.round(pageResize);
}
toolbarClick(args: ClickEventArgs): void {
 // alert(args.item.id);
  if (args.item.id === 'grid_1111871396_0_excelexport') { // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.Grid.excelExport();
  }
  if (args.item.id === 'grid_1111871396_0_pdfexport') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
//   const pdfExportProperties: PdfExportProperties = {
//     header: {
//         fromTop: 0,
//         height: 130,
//         contents: [
//             {
//                 type: 'Text',
//                 value: "New Grid Data",
//                 position: { x: 40, y: 10 },
//                 size: { height: 100, width: 250 },
//             }
//         ]
//     },
//     footer: {
//         fromBottom: 160,
//         height: 150,
//         contents: [
//             {
//                 type: 'PageNumber',
//                 pageNumberType: 'Arabic',
//                 format: 'Page {$current} of {$total}',
//                 position: { x: 0, y: 25 },
//                 style: { textBrushColor: '#ffff80'}
//             }
//         ]
//     }
// };
  this.Grid.pdfExport();
        }
}
  // toolbarClick(args: ClickEventArgs): void {
  //   switch (args.item.text) {
  //       case 'PDF Export':
  //           this.grid.pdfExport();
  //           break;
  //       case 'Excel Export':
  //           this.grid.excelExport();
  //           break;
  //       case 'CSV Export':
  //           this.grid.csvExport();
  //           break;
  //   }
//}
  createColumns(dataTable:Object)
  {

    //this.data.forEach()
    // this.dataTable.forEach(element => {

    // });
    let columns=[];
    let column={};
    for(let data in dataTable)
    {
      column["field"]=data;
      column["headerText"]=data;
      column["width"]=120;
      column["textAlign"]= 'left';
      columns.push(column);
      column={};
    }
    this.columns=columns;
  }

  }


