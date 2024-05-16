import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgxFileDropModule } from 'ngx-file-drop';
import { NgxEchartsModule } from 'ngx-echarts';

import { AppSharedModule } from '@app/shared.module';
import { AppCommonModule } from '@app/common/common.module';
import { NotificationComponent } from '@app/common/components/notification/notification.component';

import { Ng2DeepSearchPipe } from './pipes/padrones-search.pipe';
import { PadronesPageComponent } from './pages/padrones/padrones.component';
import { PadronPageComponent } from './pages/padron/padron.component';
import { PadronesRoutes } from './padrones.routing';
import { AddPadronModalComponent } from './pages/padrones/components/add-padron-modal/add-padron-modal.component';

import { PadronChartSelectorComponent } from './pages/padron/components/padron-chart-selector/padron-chart-selector.component';

import { PadronAPARAnalysisComponent } from './pages/padron/components/padron-apar-analysis/padron-apar-analysis.component';
import { PadronAPARAnnualChartComponent } from './pages/padron/components/padron-apar-annual-chart/padron-apar-annual-chart.component';
import { PadronAPARHistoricalChartComponent } from './pages/padron/components/padron-apar-historical-chart/padron-apar-historical-chart.component';

import { PadronPPNAAnalysisComponent } from './pages/padron/components/padron-ppna-analysis/padron-ppna-analysis.component';
import { PadronPPNAAnnualChartComponent } from './pages/padron/components/padron-ppna-annual-chart/padron-ppna-annual-chart.component';
import { PadronPPNAHistoricalChartComponent } from './pages/padron/components/padron-ppna-historical-chart/padron-ppna-historical-chart.component';

import { PadronHydrologicalPerformanceAnalysisComponent } from './pages/padron/components/padron-hydrological-performance-analysis/padron-hydrological-performance-analysis.component';
import { PadronHydrologicalPerformanceAnnualChartComponent } from './pages/padron/components/padron-hydrological-performance-annual-chart/padron-hydrological-performance-annual-chart.component';
import { PadronHydrologicalPerformanceHistoricalChartComponent } from './pages/padron/components/padron-hydrological-performance-historical-chart/padron-hydrological-performance-historical-chart.component';

import { PadronIOSEAnalysisComponent } from './pages/padron/components/padron-iose-analysis/padron-iose-analysis.component';
import { PadronEvapotranspirationAnalysisComponent } from './pages/padron/components/padron-evapotranspiration-analysis/padron-evapotranspiration-analysis.component';
import { PadronEvapotranspirationHistoricalChartComponent } from './pages/padron/components/padron-evapotranspiration-historical-chart/padron-evapotranspiration-historical-chart.component';
import { PadronEvapotranspirationAnnualChartComponent } from './pages/padron/components/padron-evapotranspiration-annual-chart/padron-evapotranspiration-annual-chart.component';
import { PadronIOSEChartComponent } from './pages/padron/components/padron-iose-chart/padron-iose-chart.component';
import { PadronAreaDistributionComponent } from './pages/padron/components/padron-area-distribution/padron-area-distribution.component';
import { PadronPropertiesComponent } from './pages/padron/components/padron-properties/padron-properties.component';

import { ZONES_SERVICE_CONTEXT, ZONES_SERVICE_EDITABLE } from '@app/common/services/zones.service';
import { PADRONES_SERVICE_CONTEXT, PadronesService } from './services/padrones.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PadronesRoutes),
    FormsModule,
    ReactiveFormsModule,
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
    PadronesPageComponent,
    PadronPageComponent,

    PadronAreaDistributionComponent,
    PadronPropertiesComponent,

    PadronChartSelectorComponent,

    PadronAPARAnalysisComponent,
    PadronAPARAnnualChartComponent,
    PadronAPARHistoricalChartComponent,

    PadronPPNAAnalysisComponent,
    PadronPPNAAnnualChartComponent,
    PadronPPNAHistoricalChartComponent,

    PadronEvapotranspirationAnalysisComponent,
    PadronEvapotranspirationAnnualChartComponent,
    PadronEvapotranspirationHistoricalChartComponent,

    PadronHydrologicalPerformanceAnalysisComponent,
    PadronHydrologicalPerformanceAnnualChartComponent,
    PadronHydrologicalPerformanceHistoricalChartComponent,

    PadronIOSEAnalysisComponent,
    PadronIOSEChartComponent,
    Ng2DeepSearchPipe,
    AddPadronModalComponent
  ],
  entryComponents: [NotificationComponent, AddPadronModalComponent],
  providers: [
    {
      provide: PADRONES_SERVICE_CONTEXT,
      useValue: 'padrones',
    },
    {
      provide: ZONES_SERVICE_CONTEXT,
      useValue: 'padrones-zones',
    },
    {
      provide: ZONES_SERVICE_EDITABLE,
      useValue: false,
    },
    PadronesService,
  ],
})
export class PadronesModule {}
