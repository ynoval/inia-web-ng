import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgxFileDropModule } from 'ngx-file-drop';
import { NgxEchartsModule } from 'ngx-echarts';

import { AppSharedModule } from '@app/shared.module';
import { AppCommonModule } from '@app/common/common.module';
import { NotificationComponent } from '@app/common/components/notification/notification.component';
import { ZONES_SERVICE_CONTEXT, ZONES_SERVICE_EDITABLE } from '@app/common/services/zones.service';

import { BASINS_SERVICE_CONTEXT } from './services/basins.service';
import { Ng2DeepSearchPipe } from './pipes/basins-search.pipe';
import { BasinPageComponent } from './pages/basin/basin.component';
import { BasinsPageComponent } from './pages/basins/basins.component';
import { BasinsRoutes } from './basins.routing';
import { BasinChartSelectorComponent } from './pages/basin/components/basin-chart-selector/basin-chart-selector.component';

import { BasinAPARAnalysisComponent } from './pages/basin/components/basin-apar-analysis/basin-apar-analysis.component';
import { BasinAPARAnnualChartComponent } from './pages/basin/components/basin-apar-annual-chart/basin-apar-annual-chart.component';
import { BasinAPARHistoricalChartComponent } from './pages/basin/components/basin-apar-historical-chart/basin-apar-historical-chart.component';

import { BasinPPNAAnalysisComponent } from './pages/basin/components/basin-ppna-analysis/basin-ppna-analysis.component';
import { BasinPPNAAnnualChartComponent } from './pages/basin/components/basin-ppna-annual-chart/basin-ppna-annual-chart.component';
import { BasinPPNAHistoricalChartComponent } from './pages/basin/components/basin-ppna-historical-chart/basin-ppna-historical-chart.component';

import { BasinHydrologicalPerformanceAnalysisComponent } from './pages/basin/components/basin-hydrological-performance-analysis/basin-hydrological-performance-analysis.component';
import { BasinHydrologicalPerformanceAnnualChartComponent } from './pages/basin/components/basin-hydrological-performance-annual-chart/basin-hydrological-performance-annual-chart.component';
import { BasinHydrologicalPerformanceHistoricalChartComponent } from './pages/basin/components/basin-hydrological-performance-historical-chart/basin-hydrological-performance-historical-chart.component';

import { BasinIOSEAnalysisComponent } from './pages/basin/components/basin-iose-analysis/basin-iose-analysis.component';
import { BasinEvapotranspirationAnalysisComponent } from './pages/basin/components/basin-evapotranspiration-analysis/basin-evapotranspiration-analysis.component';
import { BasinEvapotranspirationHistoricalChartComponent } from './pages/basin/components/basin-evapotranspiration-historical-chart/basin-evapotranspiration-historical-chart.component';
import { BasinEvapotranspirationAnnualChartComponent } from './pages/basin/components/basin-evapotranspiration-annual-chart/basin-evapotranspiration-annual-chart.component';
import { BasinIOSEChartComponent } from './pages/basin/components/basin-iose-chart/basin-iose-chart.component';
import { BasinAreaDistributionComponent } from './pages/basin/components/basin-area-distribution/basin-area-distribution.component';
import { BasinPropertiesComponent } from './pages/basin/components/basin-properties/basin-properties.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(BasinsRoutes),
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
    BasinsPageComponent,
    BasinPageComponent,

    BasinAreaDistributionComponent,
    BasinPropertiesComponent,

    BasinChartSelectorComponent,

    BasinAPARAnalysisComponent,
    BasinAPARAnnualChartComponent,
    BasinAPARHistoricalChartComponent,

    BasinPPNAAnalysisComponent,
    BasinPPNAAnnualChartComponent,
    BasinPPNAHistoricalChartComponent,

    BasinEvapotranspirationAnalysisComponent,
    BasinEvapotranspirationAnnualChartComponent,
    BasinEvapotranspirationHistoricalChartComponent,

    BasinHydrologicalPerformanceAnalysisComponent,
    BasinHydrologicalPerformanceAnnualChartComponent,
    BasinHydrologicalPerformanceHistoricalChartComponent,

    BasinIOSEAnalysisComponent,
    BasinIOSEChartComponent,

    Ng2DeepSearchPipe,
  ],
  entryComponents: [NotificationComponent],
  providers: [
    {
      provide: BASINS_SERVICE_CONTEXT,
      useValue: 'basins',
    },
    {
      provide: ZONES_SERVICE_CONTEXT,
      useValue: 'basins-zones',
    },
    {
      provide: ZONES_SERVICE_EDITABLE,
      useValue: false,
    },
  ],
})
export class BasinsModule {}
