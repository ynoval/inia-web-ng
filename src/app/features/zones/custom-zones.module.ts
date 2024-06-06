import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';
import { createCustomElement } from '@angular/elements';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxFileDropModule } from 'ngx-file-drop';

import { AppSharedModule } from '@app/shared.module';
import { AppCommonModule } from '@app/common/common.module';
import { NotificationComponent } from '@app/common/components/notification/notification.component';
import { ZONES_SERVICE_CONTEXT, ZONES_SERVICE_EDITABLE } from '@app/common/services/zones.service';

import { Ng2DeepSearchPipe } from './pipes/custom-zones-search.pipe';
import { LAYERS_SERVICE_CONTEXT } from '@app/common/services/layers.service';
import { CustomZonesRoutes } from './custom-zones.routing';
import { CustomZonesPageComponent } from './pages/custom-zones/custom-zones.component';
import { CustomZonePageComponent } from './pages/custom-zone/custom-zone.component';
import { MapLayersComponent } from './components/map-layers/map-layers.component';
import { ImportZonesComponent } from './components/import-zones/import-zones.component';
import { ExportZonesComponent } from './components/export-zones/export-zones.component';
import { AddZoneComponent } from './components/add-zone/add-zone.component';
import { DeleteZonesComponent } from './components/delete-zones/delete-zones.component';
import { ZoneAreaDistributionComponent } from './pages/custom-zone/components/zone-area-distribution/zone-area-distribution.component';
import { ZoneMarkerInformationComponent } from './pages/custom-zone/components/zone-marker-information/zone-marker-information.component';
import { ZonePropertiesComponent } from './pages/custom-zone/components/zone-properties/zone-properties.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { ZoneChartSelectorComponent } from './pages/custom-zone/components/zone-chart-selector/zone-chart-selector.component';

import { PPNAAnalysisComponent } from './pages/custom-zone/components/ppna-analysis/ppna-analysis.component';
import { PPNAAnnualChartComponent } from './pages/custom-zone/components/ppna-annual-chart/ppna-annual-chart.component';
import { PPNAHistoricalChartComponent } from './pages/custom-zone/components/ppna-historical-chart/ppna-historical-chart.component';

import { APARAnalysisComponent } from './pages/custom-zone/components/apar-analysis/apar-analysis.component';
import { APARAnnualChartComponent } from './pages/custom-zone/components/apar-annual-chart/apar-annual-chart.component';
import { APARHistoricalChartComponent } from './pages/custom-zone/components/apar-historical-chart/apar-historical-chart.component';

import { HydrologicalPerformanceAnalysisComponent } from './pages/custom-zone/components/hydrological-performance-analysis/hydrological-performance-analysis.component';
import { HydrologicalPerformanceAnnualChartComponent } from './pages/custom-zone/components/hydrological-performance-annual-chart/hydrological-performance-annual-chart.component';
import { HydrologicalPerformanceHistoricalChartComponent } from './pages/custom-zone/components/hydrological-performance-historical-chart/hydrological-performance-historical-chart.component';

import { EvapotranspirationAnalysisComponent } from './pages/custom-zone/components/evapotranspiration-analysis/evapotranspiration-analysis.component';
import { EvapotranspirationAnnualChartComponent } from './pages/custom-zone/components/evapotranspiration-annual-chart/evapotranspiration-annual-chart.component';
import { EvapotranspirationHistoricalChartComponent } from './pages/custom-zone/components/evapotranspiration-historical-chart/evapotranspiration-historical-chart.component';

import { IOSEAnalysisComponent } from './pages/custom-zone/components/iose-analysis/iose-analysis.component';
import { IOSEChartComponent } from './pages/custom-zone/components/iose-chart/iose-chart.component';
import { ConfirmDialogComponent } from '@app/common/directives/confirm/confirm-dialog/confirm-dialog.component';
// import { MapbiomasHistoricalChartComponent } from '../../common/components/indicators/mapbiomas/mapbiomas-historical-chart/mapbiomas-historical-chart.component';

import { SOILAnalysisComponent } from './pages/custom-zone/components/soil-analysis/soil-analysis.component';
import { EFTAnalysisComponent } from './pages/custom-zone/components/eft-analysis/eft-analysis.component';
import { AHPPNAnalysisComponent } from './pages/custom-zone/components/ahppn-analysis/ahppn-analysis.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CustomZonesRoutes),
    FormsModule,
    GoogleMapsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    PerfectScrollbarModule,
    NgxFileDropModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    AppSharedModule,
    AppCommonModule,
  ],
  declarations: [
    CustomZonesPageComponent,
    CustomZonePageComponent,
    Ng2DeepSearchPipe,
    MapLayersComponent,
    ImportZonesComponent,
    ExportZonesComponent,
    AddZoneComponent,
    DeleteZonesComponent,
    ZoneAreaDistributionComponent,
    ZoneMarkerInformationComponent,
    ZonePropertiesComponent,

    ZoneChartSelectorComponent,

    APARAnalysisComponent,
    APARAnnualChartComponent,
    APARHistoricalChartComponent,

    PPNAAnalysisComponent,
    PPNAAnnualChartComponent,
    PPNAHistoricalChartComponent,

    EvapotranspirationAnalysisComponent,
    EvapotranspirationAnnualChartComponent,
    EvapotranspirationHistoricalChartComponent,

    HydrologicalPerformanceAnalysisComponent,
    HydrologicalPerformanceHistoricalChartComponent,
    HydrologicalPerformanceAnnualChartComponent,

    IOSEAnalysisComponent,
    IOSEChartComponent,
    // MapbiomasHistoricalChartComponent,

    SOILAnalysisComponent,
    EFTAnalysisComponent,
    AHPPNAnalysisComponent

  ],
  entryComponents: [
    MapLayersComponent,
    NotificationComponent,
    ImportZonesComponent,
    ExportZonesComponent,
    AddZoneComponent,
    DeleteZonesComponent,
    ConfirmDialogComponent,
  ],
  providers: [
    {
      provide: LAYERS_SERVICE_CONTEXT,
      useValue: 'custom-zones-layers',
    },
    {
      provide: ZONES_SERVICE_CONTEXT,
      useValue: 'custom-zones',
    },
    {
      provide: ZONES_SERVICE_EDITABLE,
      useValue: false,
    },
  ],
})
export class CustomZonesModule {
  constructor(injector: Injector) {
    const el = createCustomElement(MapLayersComponent, { injector });
    customElements.define('app-map-layers', el);
  }
}
