export class Widget {
    id: number
    name: string
    widgetStatus: boolean
    isPanelReq: boolean
    width: string
    widgetTypeName: string
    widgetDataResult: object
    widgetChartColor: object
    widgetType: string

    analyticDataServiceId:number
    url:string
}
export class Asset{
    static nodeData(nodeData: any) {
      throw new Error('Method not implemented.');
    }
}
export class WidgetTest {
    id: number
    name: string
    widgetStatus: boolean
    url:string
}
export class WidgetData {
    id: number
    widgetId: string
    widgetName: string
}

export class TestMapData {
    post_latitude: number
    post_longitude: number
}
export class DragDropContainer {
    id: number
    class: string
}

export class WidgetLabelAttributes{
    xAxisVisible:true
    yAxisVisible:true
    xAxisText:string
    yAxisText:string
}
export class WidgetMapAttributes{
    xAxisVisible:true
    yAxisVisible:true
    xAxisText:string
    yAxisText:string
}
export class WidgetTableAttributes{
    xAxisVisible:true
    yAxisVisible:true
    xAxisText:string
    yAxisText:string
}
export class WidgetPieAttributes{
    xAxisVisible:true
    yAxisVisible:true
    xAxisText:string
    yAxisText:string
}
export class WidgetFormData{
    dataSourceFormate: string
    id: number
    status: string
    isPanel:boolean
    title: string
    style_type: string
    data_source: string
    position:string
    widgetType: string
    xAxisText: string
    xAxisVisible: boolean
    yAxisText: string
    width: string
    yAxisVisible: boolean
    dashboardId:number
    analyticDataServiceId:number
    analyticWidgetId:number
    dsInputParams:object
}
export class WidgetDataSource
{

}
export class WidgetStyle
{
    
}
export class WidgetAttributes{
    code:string
    name:string
    description:string
    isNull:boolean
    defaultValue:string
    id:number
    createdOn:string
    updatedOn:string
    createdBy:number
    updatedBy:number
    status:string
}
export class DashboardWidgetAttribute
{

}
export class WidgetDetail
{
  id: number
  TL: string
  PN:boolean
  WD:string
  DS: object
  XT: string
  XV: boolean
  YT: string
  YV: boolean
  WT: string
  POS:string //posX value
  POSY:string
  ST:string
  STL:string
  CS:string
  DA:boolean
  ICN:string
  YFV:number
  YLV:number
  MIR:number
  TYP:string
  MAR:number
  MAS:number
  MIS:number
  DSID:number
  RI:Number
  FS:String
  CC:string
  ROW:String
  //dataServiceObject:object
}
export class FilterDataForm
{
    dashboardWidgetId:number
    startDate:string
    endDate:string
}

export class WidgetDetailExtended{
    id: number
    TL: string
    PN:boolean
    WD:string
    DS: object
    XT: string
    XV: boolean
    YT: string
    YV: boolean
    WT: string
    POS:string
    ST:string
    STL:string
    CS:string
    DA:boolean
    ICN:string
    YFV:number
    YLV:number
    MIN:number
    MAR:number
    //dataServiceObject:object
  }
export class WidgetDataServiceParam
{
    id:number
    analyticServiceId:number
    dataTypeId:number
    name:string
    value:string
    status:string
}


export class dsInputParamValueForm
{
    id:number
    value: string
    dsInputParamId: number
}
export class CommonProperty
{
    id:number
	status:string
}
export class DashboardWidget extends CommonProperty {
    dashboardId:number
    analyticWidgetId:number
    dashboardWidgetParamValues:DashboardWidgetParamValue[]
    dashboardWidgetServiceInputParamValues:DashboardWidgetServiceInputParamValue[]
    analyticDataServiceId:number
    analyticDataService:AnalyticDataService
    refreshIntervalInSec:number
    createdBy:number
    updatedBy:number
}

export class DashboardWidgetParamValue extends CommonProperty {
    dashboardWidgetId:number
    AnalyticWidgetParamId:number
    widgetParamName:string
    widgetParamCode:string
    value:string
}

export class AnalyticDataService extends CommonProperty {
    name:string
    dataServiceUrl:string
    description:string
    analyticDataServiceInputParams:AnalyticDataServiceInputParam[]
}

export class AnalyticDataServiceInputParam extends CommonProperty {
    analyticDataServiceId:number
    name:string
    description:string
    dataTypeId:number
    value:string
}

export class DashboardWidgetServiceInputParamValue extends CommonProperty {
    analyticDataServiceInputParamId:number
    value:string
}

export class AutoRefresh
{
    id:number
    nextRun:Date
    refreshInterval:number
}
export class WidgetParamObject
{
    dashboardWidgetId:number
    value:string
    widgetParamCode:string
    updatedBy:number
}