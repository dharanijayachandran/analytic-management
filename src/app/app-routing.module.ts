import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgmDirectionMapComponent } from './dashboard-engine/pages/dashboard-config/agm-direction-map/agm-direction-map.component';
import { AgmEuMapComponent } from './dashboard-engine/pages/dashboard-config/agm-eu-map/agm-eu-map.component';
import { InnerContainerComponent } from './dashboard-engine/pages/dashboard-config/inner-container/inner-container.component';
import { ManageServiceComponent } from './dashboard-engine/pages/dashboard-config/manage-service/manage-service.component';
import { ManageWidgetAttributeComponent } from './dashboard-engine/pages/dashboard-config/manage-widget-attribute/manage-widget-attribute.component';
import { ManageWidgetComponent } from './dashboard-engine/pages/dashboard-config/manage-widget/manage-widget.component';
import { NgeAlarmComponent } from './dashboard-engine/pages/dashboard-config/nge-alarm/nge-alarm.component';
import { NgeCardComponent } from './dashboard-engine/pages/dashboard-config/nge-card/nge-card.component';
import { NgeChartAreaComponent } from './dashboard-engine/pages/dashboard-config/nge-chart-area/nge-chart-area.component';
import { NgeChartColumnComponent } from './dashboard-engine/pages/dashboard-config/nge-chart-column/nge-chart-column.component';
import { NgeChartLinezoneComponent } from './dashboard-engine/pages/dashboard-config/nge-chart-linezone/nge-chart-linezone.component';
import { NgeChartComponent } from './dashboard-engine/pages/dashboard-config/nge-chart/nge-chart.component';
import { NgeEventComponent } from './dashboard-engine/pages/dashboard-config/nge-event/nge-event.component';
import { NgeGaugeComponent } from './dashboard-engine/pages/dashboard-config/nge-gauge/nge-gauge.component';
import { NgeTableComponent } from './dashboard-engine/pages/dashboard-config/nge-table/nge-table.component';
import { NgeTreeViewComponent } from './dashboard-engine/pages/dashboard-config/nge-tree-view/nge-tree-view.component';
import { WidgetServiceMappingComponent } from './dashboard-engine/pages/dashboard-config/widget-service-mapping/widget-service-mapping.component';
import { DashboardContainerComponent } from './dashboard-engine/pages/dashboard-container/dashboard-container.component';
import { DashboardConfigComponent } from './dashboard-engine/pages/edit-db/dashboard-config.component';
import { AlarmFormComponent } from './dashboard-engine/pages/edit-db/form-app/alarm-form/alarm-form.component';
import { BarChartFormComponent } from './dashboard-engine/pages/edit-db/form-app/bar-chart-form/bar-chart-form.component';
import { DirectionMapFormComponent } from './dashboard-engine/pages/edit-db/form-app/direction-map-form/direction-map-form.component';
import { EventFormComponent } from './dashboard-engine/pages/edit-db/form-app/event-form/event-form.component';
import { FloatChartFormComponent } from './dashboard-engine/pages/edit-db/form-app/float-chart-form/float-chart-form.component';
import { GaugeMeterFormComponent } from './dashboard-engine/pages/edit-db/form-app/gauge-meter-form/gauge-meter-form.component';
import { InnerContainerFormComponent } from './dashboard-engine/pages/edit-db/form-app/inner-container-form/inner-container-form.component';
import { LineChartFormComponent } from './dashboard-engine/pages/edit-db/form-app/line-chart-form/line-chart-form.component';
import { LocationMapFormComponent } from './dashboard-engine/pages/edit-db/form-app/location-map-form/location-map-form.component';
import { PieChartFormComponent } from './dashboard-engine/pages/edit-db/form-app/pie-chart-form/pie-chart-form.component';
import { TableMatrixFormComponent } from './dashboard-engine/pages/edit-db/form-app/table-matrix-form/table-matrix-form.component';
import { TitleWidgetFormComponent } from './dashboard-engine/pages/edit-db/form-app/title-widget-form/title-widget-form.component';
import { TreeViewFormComponent } from './dashboard-engine/pages/edit-db/form-app/tree-view-form/tree-view-form.component';
import { CardContainerComponent } from './dashboard-engine/rack-monitoring-dashboard/db-container/card-container/card-container.component';
import { RackContainerComponent } from './dashboard-engine/rack-monitoring-dashboard/db-container/rack-container/rack-container.component';
import { RackInnerContainerComponent } from './dashboard-engine/rack-monitoring-dashboard/db-container/rack-inner-container/rack-inner-container.component';
import { RackLineChartComponent } from './dashboard-engine/rack-monitoring-dashboard/rack-widgets/rack-line-chart/rack-line-chart.component';
import { RackTreeViewComponent } from './dashboard-engine/rack-monitoring-dashboard/rack-widgets/rack-tree-view/rack-tree-view.component';
import { AssetDataComponent } from './reports/pages/asset-data/asset-data.component';
import { RawDataListComponent } from './reports/pages/raw-data/raw-data-list/raw-data-list.component';
import { RawDataComponent } from './reports/pages/raw-data/raw-data/raw-data.component';
import { RackNgeCardComponent } from './dashboard-engine/rack-monitoring-dashboard/rack-widgets/rack-nge-card/rack-nge-card.component';
import { LandingPageDashboardComponent } from './dashboard-engine/rack-monitoring-dashboard/landing-page-dashboard/landing-page-dashboard/landing-page-dashboard.component';
import { LocationDataTableComponent } from './dashboard-engine/rack-monitoring-dashboard/landing-page-dashboard/location-data-table/location-data-table.component';
import { RackCardContainerComponent } from './dashboard-engine/rack-monitoring-dashboard/rack-card-container/rack-card-container.component';
import { RackLandingCardComponent } from './dashboard-engine/rack-monitoring-dashboard/rack-widgets/rack-landing-card/rack-landing-card.component';
import { PendingChangesGuard } from 'global';

const routes: Routes = [

  {
    path: 'dynamic',
    component: DashboardContainerComponent,
    data: {
      title: 'Dynamic Dashboard'
    }
  },
  {
    path: 'config-dashboard',
    component: DashboardConfigComponent,
    data: {
      title: 'Manage Dashboard'
    }
  },

  {
    path: 'asset-data',
    component: AssetDataComponent,
    data: {
      title: 'Asset Data'
    },
    canDeactivate: [PendingChangesGuard]
  },
  {
    path: 'raw-data-list',
    children: [
      {
        path: '',
        component: RawDataListComponent,
        data: {
          title: 'raw Data list'
        }
      },
      {
        path: 'raw-data',
        component: RawDataComponent,
        data: {
          title: 'raw Data'
        },
        canDeactivate: [PendingChangesGuard]
      }
    ]

  },
  {
    path: 'rack-monitoring-dashboard',
    component: RackContainerComponent,
    data: {
      title: 'rack monitoring dashboard'
    }
  },
  {
    path: 'landing-page-dashboard',
    component: LandingPageDashboardComponent,
    data: {
      title: 'landing-page-dashboard'
    }
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/analytic' },
  ],
})
export class AppRoutingModule { }

export const dashboardEngine = [

  DashboardContainerComponent,
  BarChartFormComponent,
  PieChartFormComponent,
  LineChartFormComponent,
  LocationMapFormComponent,
  TitleWidgetFormComponent,
  FloatChartFormComponent,
  ManageWidgetComponent,
  ManageServiceComponent,
  WidgetServiceMappingComponent,
  ManageWidgetAttributeComponent,
  TableMatrixFormComponent,
  AssetDataComponent,
  RawDataComponent,
  RawDataListComponent,
  GaugeMeterFormComponent,
  NgeChartComponent,
  NgeGaugeComponent,
  NgeChartAreaComponent,
  AgmEuMapComponent,
  NgeChartLinezoneComponent,
  NgeTableComponent,
  NgeCardComponent,
  DashboardConfigComponent,
  NgeChartColumnComponent,
  NgeTreeViewComponent,
  TreeViewFormComponent,
  NgeAlarmComponent,
  AlarmFormComponent,
  AgmDirectionMapComponent,
  DirectionMapFormComponent,
  NgeEventComponent,
  EventFormComponent,
  InnerContainerFormComponent,
  InnerContainerComponent,
  RackContainerComponent,
  RackTreeViewComponent,
  RackInnerContainerComponent,
  CardContainerComponent,
  RackLineChartComponent,
  RackNgeCardComponent,
  LandingPageDashboardComponent,
  LocationDataTableComponent,
  RackCardContainerComponent,
  RackLandingCardComponent
];
