export class Dashboard {
  id: number
  title: string
  isDefault: boolean
  description: string
  status: string
  businessEntityId: number
  createdBy: number
}
export class DashboardList {
  id: number
  name: string
  isDefault: boolean
  description: string
  status: string
  businessEntityId: number
}
export class ActiveWidgetList {
  id: number
  dashboardId: number
  widgetId: number
  status:string
  
}
