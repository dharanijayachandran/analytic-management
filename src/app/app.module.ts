import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_CHECKBOX_DEFAULT_OPTIONS, MatCheckboxDefaultOptions, MatCheckboxModule } from '@angular/material/checkbox';
import { MatCommonModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MAT_RADIO_DEFAULT_OPTIONS, MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AccumulationChartAllModule, CategoryService, ChartAllModule, ChartModule, ColumnSeriesService, DateTimeService, LegendService, LineSeriesService, MultiColoredLineSeriesService, RangeColumnSeriesService, RangeNavigatorAllModule, StackingColumnSeriesService } from '@syncfusion/ej2-angular-charts';
import { CircularGaugeAllModule, CircularGaugeModule, GaugeTooltipService } from '@syncfusion/ej2-angular-circulargauge';
import { DropDownListModule, DropDownTreeModule } from '@syncfusion/ej2-angular-dropdowns';
import { ExcelExportService, FilterService, GridAllModule, GridModule, GroupService, PageService, PdfExportService, SortService, ToolbarService, VirtualScrollService } from '@syncfusion/ej2-angular-grids';
import { DashboardLayoutModule } from '@syncfusion/ej2-angular-layouts';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { CalendarModule } from 'angular-calendar';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { GridsterModule } from 'angular-gridster2';
import { AngularResizeEventModule } from 'angular-resize-event';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { GlobalModule, PendingChangesGuard} from 'global';
import { MatTableExporterModule } from 'mat-table-exporter';
import { NvD3Module } from 'ng2-nvd3';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DndModule } from 'ngx-drag-drop';
import { NgxGaugeModule } from 'ngx-gauge';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxTagsInputModule } from 'ngx-tags-input';
import { ToastrModule } from 'ngx-toastr';
import { TrendModule } from 'ngx-trend';
import { AppRoutingModule, dashboardEngine } from './app-routing.module';
import { AppComponent } from './app.component';
import { AgmDirection } from './dashboard-engine/pages/dashboard-config/directive/direction.directive';
import { KeysPipe } from './dashboard-engine/pages/edit-db/keys.pipe';
import { ExportFilesToComponent } from './shared/components/export-files-to/export-files-to.component';
import { MatTablePaginatorComponent } from './shared/components/mat-table-paginator/mat-table-paginator.component';
import { globalSharedService } from './shared/services/global/globalSharedService';
import { MainInterceptor } from './main-interceptor';
import { AssertDataPipe } from './reports/pages/asset-data/assert-data.pipe';
import { RackNgeEventComponent } from './dashboard-engine/rack-monitoring-dashboard/rack-widgets/rack-nge-event/rack-nge-event.component';
import { RackNgeAlarmComponent } from './dashboard-engine/rack-monitoring-dashboard/rack-widgets/rack-nge-alarm/rack-nge-alarm.component';
import { RackPaginatorComponent } from './dashboard-engine/rack-monitoring-dashboard/landing-page-dashboard/rack-paginator/rack-paginator.component';
@NgModule({
  declarations: [
    AppComponent,
    ExportFilesToComponent,
    AssertDataPipe,
    KeysPipe,
    AgmDirection,
    MatTablePaginatorComponent,
    dashboardEngine,
    RackNgeEventComponent,
    RackNgeAlarmComponent,
    RackPaginatorComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    NgbModule,
    RouterModule,
    MatCommonModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    NgxTagsInputModule,
    ToastrModule.forRoot(),
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyC5gJ5x8Yw7qP_DqvNq3IdZi2WUSiDjskk' }),
    ReactiveFormsModule,
    MatSortModule,
    TrendModule,
    MatToolbarModule,
    MatTreeModule,
    MatMenuModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    AngularDualListBoxModule,
    NvD3Module,
    NgxChartsModule,
    NgxDatatableModule,
    MatRadioModule,
    MatTooltipModule,
    CalendarModule,
    MatSlideToggleModule,
    DndModule,
    TreeViewModule,
    NgxGaugeModule,
    MatTableExporterModule,
    DashboardLayoutModule,
    NgxPaginationModule,
    DragDropModule,
    AngularMultiSelectModule,
    ChartModule,
    ChartAllModule,
    RangeNavigatorAllModule,
    AccumulationChartAllModule,
    CircularGaugeModule, CircularGaugeAllModule, GridModule,
    GridAllModule,
    AngularResizeEventModule,
    GridsterModule,
    DropDownTreeModule,
    DropDownListModule,
    GlobalModule,
    AppRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  providers: [
    MultiColoredLineSeriesService,
    PendingChangesGuard,
    GaugeTooltipService,
    LineSeriesService,
    CategoryService,
    LegendService, SortService, RangeColumnSeriesService,
    StackingColumnSeriesService, ColumnSeriesService,
    FilterService, VirtualScrollService, PageService,
    ToolbarService, PageService, ExcelExportService,
    DateTimeService, PdfExportService, GroupService, GoogleMapsAPIWrapper,
    globalSharedService,
    DeviceDetectorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MainInterceptor,
      multi: true
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    },
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'check-indeterminate', color: 'primary' } as MatCheckboxDefaultOptions }],
  bootstrap: [AppComponent]

})
export class AppModule { }
