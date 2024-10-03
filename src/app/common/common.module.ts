import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
// import { NgxEchartsModule } from 'ngx-echarts';

import { AppSharedModule } from '@app/shared.module';
import { NotificationComponent } from './components/notification/notification.component';
import { NotificationService } from './components/notification/notification.service';
import { ConfirmDirective } from './directives/confirm/confirm.directive';
import { ConfirmDialogComponent } from './directives/confirm/confirm-dialog/confirm-dialog.component';
import { ApiService } from './services/api.service';
import { ZonesService } from './services/zones.service';
import { LayersService } from './services/layers.service';
import { CommunitiesLayersService } from './services/communities-layers.service';
import { CommunitiesService } from './services/communities.service';
import { GoogleMapService } from './services/google-map.service';
import { ZoneListComponent } from './components/zoneList/zoneList.component';
import { SearchComponent } from './components/search/search.component';
import { MapbiomasAnalysisComponent } from './components/indicators/mapbiomas/mapbiomas-analysis/mapbiomas-analysis.component';
import { MapbiomasHistoricalChartComponent } from './components/indicators/mapbiomas/mapbiomas-historical-chart/mapbiomas-historical-chart.component';
import { ChartSelectorComponent } from './components/chart-selector/chart-selector.component';
import { MapbiomasAnnualChartComponent } from './components/indicators/mapbiomas/mapbiomas-annual-chart/mapbiomas-annual-chart.component';
import { NgxEchartsModule } from 'ngx-echarts';
// import echarts from '@app/echarts-module';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { YearPickerComponent } from './components/year-picker/year-picker.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxEchartsModule.forRoot({
    echarts: async () => await import('echarts'),
    }),
    AppSharedModule,
  ],
  declarations: [
    NotificationComponent,
    ConfirmDirective,
    ConfirmDialogComponent,
    ZoneListComponent,
    SearchComponent,
    YearPickerComponent,
    ChartSelectorComponent,
    PieChartComponent,
    MapbiomasAnalysisComponent,
    MapbiomasAnnualChartComponent,
    MapbiomasHistoricalChartComponent,
  ],
  exports: [
    NotificationComponent,
    ConfirmDirective,
    ConfirmDialogComponent,
    ZoneListComponent,
    SearchComponent,
    YearPickerComponent,
    ChartSelectorComponent,
    PieChartComponent,
    MapbiomasAnalysisComponent,
    MapbiomasAnnualChartComponent,
    MapbiomasHistoricalChartComponent,
  ],
  providers: [
    NotificationService,
    ApiService,
    ZonesService,
    CommunitiesService,
    LayersService,
    CommunitiesLayersService,
    GoogleMapService,
  ]
})
export class AppCommonModule {}
