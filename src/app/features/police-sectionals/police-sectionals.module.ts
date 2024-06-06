import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgxFileDropModule } from 'ngx-file-drop';

import { Ng2DeepSearchPipe } from './pipes/police-sectionals-search.pipe';
import { AppSharedModule } from '@app/shared.module';
import { AppCommonModule } from '@app/common/common.module';
import { NotificationComponent } from '@app/common/components/notification/notification.component';
import { ZONES_SERVICE_CONTEXT, ZONES_SERVICE_EDITABLE } from '@app/common/services/zones.service';
import { POLICE_SECTIONALS_SERVICE_CONTEXT } from './services/police-sectionals.service';
import { PoliceSectionalsRoutes } from './police-sectionals.routing';
import { PoliceSectionalsPageComponent } from './pages/police-sectionals/police-sectionals.component';
import { PoliceSectionalPageComponent } from './pages/police-sectional/police-sectional.component';
import { PoliceSectionalAPARAnalysisComponent } from './pages/police-sectional/components/police-sectional-apar-analysis/police-sectional-apar-analysis.component';
import { PoliceSectionalAPARAnnualChartComponent } from './pages/police-sectional/components/police-sectional-apar-annual-chart/police-sectional-apar-annual-chart.component';
import { PoliceSectionalAPARHistoricalChartComponent } from './pages/police-sectional/components/police-sectional-apar-historical-chart/police-sectional-apar-historical-chart.component';
import { PoliceSectionalAreaDistributionComponent } from './pages/police-sectional/components/police-sectional-area-distribution/police-sectional-area-distribution.component';
import { PoliceSectionalChartSelectorComponent } from './pages/police-sectional/components/police-sectional-chart-selector/police-sectional-chart-selector.component';
import { PoliceSectionalEvapotranspirationAnalysisComponent } from './pages/police-sectional/components/police-sectional-evapotranspiration-analysis/police-sectional-evapotranspiration-analysis.component';
import { PoliceSectionalEvapotranspirationAnnualChartComponent } from './pages/police-sectional/components/police-sectional-evapotranspiration-annual-chart/police-sectional-evapotranspiration-annual-chart.component';
import { PoliceSectionalEvapotranspirationHistoricalChartComponent } from './pages/police-sectional/components/police-sectional-evapotranspiration-historical-chart/police-sectional-evapotranspiration-historical-chart.component';
import { PoliceSectionalHydrologicalPerformanceAnalysisComponent } from './pages/police-sectional/components/police-sectional-hydrological-performance-analysis/police-sectional-hydrological-performance-analysis.component';
import { PoliceSectionalHydrologicalPerformanceAnnualChartComponent } from './pages/police-sectional/components/police-sectional-hydrological-performance-annual-chart/police-sectional-hydrological-performance-annual-chart.component';
import { PoliceSectionalHydrologicalPerformanceHistoricalChartComponent } from './pages/police-sectional/components/police-sectional-hydrological-performance-historical-chart/police-sectional-hydrological-performance-historical-chart.component';
import { PoliceSectionalIOSEAnalysisComponent } from './pages/police-sectional/components/police-sectional-iose-analysis/police-sectional-iose-analysis.component';
import { PoliceSectionalIOSEChartComponent } from './pages/police-sectional/components/police-sectional-iose-chart/police-sectional-iose-chart.component';
import { PoliceSectionalPPNAAnalysisComponent } from './pages/police-sectional/components/police-sectional-ppna-analysis/police-sectional-ppna-analysis.component';
import { PoliceSectionalPPNAAnnualChartComponent } from './pages/police-sectional/components/police-sectional-ppna-annual-chart/police-sectional-ppna-annual-chart.component';
import { PoliceSectionalPPNAHistoricalChartComponent } from './pages/police-sectional/components/police-sectional-ppna-historical-chart/police-sectional-ppna-historical-chart.component';
import { PoliceSectionalPropertiesComponent } from './pages/police-sectional/components/police-sectional-properties/police-sectional-properties.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { PoliceSectionalSOILAnalysisComponent } from './pages/police-sectional/components/police-sectional-soil-analysis/police-sectional-soil-analysis.component';
import { PoliceSectionalEFTAnalysisComponent } from './pages/police-sectional/components/police-sectional-eft-analysis/police-sectional-eft-analysis.component';
import { PoliceSectionalAHPPNAnalysisComponent } from './pages/police-sectional/components/police-sectional-ahppn-analysis/police-sectional-ahppn-analysis.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PoliceSectionalsRoutes),
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
    PoliceSectionalsPageComponent,
    PoliceSectionalPageComponent,
    Ng2DeepSearchPipe,
    PoliceSectionalAreaDistributionComponent,
    PoliceSectionalPropertiesComponent,

    PoliceSectionalChartSelectorComponent,

    PoliceSectionalAPARAnalysisComponent,
    PoliceSectionalAPARAnnualChartComponent,
    PoliceSectionalAPARHistoricalChartComponent,

    PoliceSectionalPPNAAnalysisComponent,
    PoliceSectionalPPNAAnnualChartComponent,
    PoliceSectionalPPNAHistoricalChartComponent,

    PoliceSectionalEvapotranspirationAnalysisComponent,
    PoliceSectionalEvapotranspirationAnnualChartComponent,
    PoliceSectionalEvapotranspirationHistoricalChartComponent,

    PoliceSectionalHydrologicalPerformanceAnalysisComponent,
    PoliceSectionalHydrologicalPerformanceAnnualChartComponent,
    PoliceSectionalHydrologicalPerformanceHistoricalChartComponent,

    PoliceSectionalIOSEAnalysisComponent,
    PoliceSectionalIOSEChartComponent,
    PoliceSectionalSOILAnalysisComponent,
    PoliceSectionalEFTAnalysisComponent,
    PoliceSectionalAHPPNAnalysisComponent
  ],
  entryComponents: [NotificationComponent],
  providers: [
    {
      provide: POLICE_SECTIONALS_SERVICE_CONTEXT,
      useValue: 'police_sectionals',
    },
    {
      provide: ZONES_SERVICE_CONTEXT,
      useValue: 'police-sectionals-zones',
    },
    {
      provide: ZONES_SERVICE_EDITABLE,
      useValue: false,
    },
  ],
})
export class PoliceSectionalsModule {}
