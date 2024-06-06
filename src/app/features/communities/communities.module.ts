import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { createCustomElement } from '@angular/elements';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { NgxFileDropModule } from 'ngx-file-drop';
import { NotificationComponent } from '@app/common/components/notification/notification.component';
import { NgxEchartsModule } from 'ngx-echarts';

import { AppSharedModule } from '@app/shared.module';
import { AppCommonModule } from '@app/common/common.module';
import { ConfirmDialogComponent } from '@app/common/directives/confirm/confirm-dialog/confirm-dialog.component';
import { COMMUNITIES_LAYERS_SERVICE_CONTEXT } from '@app/common/services/communities-layers.service';

import { CommunitiesPageComponent } from './pages/communities/communities.component';
import { CommunityPageComponent } from './pages/community/community.component';

import { CommunitiesRoutes } from './communities.routing';
import { CommunitiesMapLayersComponent } from './components/communities-map-layers/communities-map-layers.component';
import { SubCommunityComponent } from './pages/community/components/subcommunity/subcommunity.component';
import { CommunityAPARAnalysisComponent } from './pages/community/components/community-apar-analysis/community-apar-analysis.component';
import { CommunityAPARAnnualChartComponent } from './pages/community/components/community-apar-annual-chart/community-apar-annual-chart.component';
import { CommunityAPARHistoricalChartComponent } from './pages/community/components/community-apar-historical-chart/community-apar-historical-chart.component';
import { CommunityEvapotranspirationAnalysisComponent } from './pages/community/components/community-evapotranspiration-analysis/community-evapotranspiration-analysis.component';
import { CommunityEvapotranspirationAnnualChartComponent } from './pages/community/components/community-evapotranspiration-annual-chart/community-evapotranspiration-annual-chart.component';
import { CommunityEvapotranspirationHistoricalChartComponent } from './pages/community/components/community-evapotranspiration-historical-chart/community-evapotranspiration-historical-chart.component';
import { CommunityHydrologicalPerformanceAnalysisComponent } from './pages/community/components/community-hydrological-performance-analysis/community-hydrological-performance-analysis.component';
import { CommunityHydrologicalPerformanceAnnualChartComponent } from './pages/community/components/community-hydrological-performance-annual-chart/community-hydrological-performance-annual-chart.component';
import { CommunityHydrologicalPerformanceHistoricalChartComponent } from './pages/community/components/community-hydrological-performance-historical-chart/community-hydrological-performance-historical-chart.component';
import { CommunityIOSEAnalysisComponent } from './pages/community/components/community-iose-analysis/community-iose-analysis.component';
import { CommunityIOSEChartComponent } from './pages/community/components/community-iose-chart/community-iose-chart.component';
import { CommunityPPNAAnalysisComponent } from './pages/community/components/community-ppna-analysis/community-ppna-analysis.component';
import { CommunityPPNAAnnualChartComponent } from './pages/community/components/community-ppna-annual-chart/community-ppna-annual-chart.component';
import { CommunityPPNAHistoricalChartComponent } from './pages/community/components/community-ppna-historical-chart/community-ppna-historical-chart.component';
import { CommunityChartSelectorComponent } from './pages/community/components/community-chart-selector/community-chart-selector.component';
import { SpeciePageComponent } from './pages/specie/specie.component';
import { CommunityAHPPNAnalysisComponent } from './pages/community/components/community-ahppn-analysis/community-ahppn-analysis.component';
import { CommunityEFTAnalysisComponent } from './pages/community/components/community-eft-analysis/community-eft-analysis.component';
import { CommunitySOILAnalysisComponent } from './pages/community/components/community-soil-analysis/community-soil-analysis.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GoogleMapsModule,
    PerfectScrollbarModule,
    HttpClientModule,
    HttpClientJsonpModule,
    NgxFileDropModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    RouterModule.forChild(CommunitiesRoutes),
    AppSharedModule,
    AppCommonModule,
  ],
  declarations: [
    CommunitiesPageComponent,
    CommunitiesMapLayersComponent,
    CommunityPageComponent,
    SpeciePageComponent,
    SubCommunityComponent,
    CommunityChartSelectorComponent,
    CommunityAPARAnalysisComponent,
    CommunityAPARAnnualChartComponent,
    CommunityAPARHistoricalChartComponent,

    CommunityPPNAAnalysisComponent,
    CommunityPPNAAnnualChartComponent,
    CommunityPPNAHistoricalChartComponent,

    CommunityEvapotranspirationAnalysisComponent,
    CommunityEvapotranspirationAnnualChartComponent,
    CommunityEvapotranspirationHistoricalChartComponent,

    CommunityHydrologicalPerformanceAnalysisComponent,
    CommunityHydrologicalPerformanceHistoricalChartComponent,
    CommunityHydrologicalPerformanceAnnualChartComponent,

    CommunityIOSEAnalysisComponent,
    CommunityIOSEChartComponent,
    CommunitySOILAnalysisComponent,
    CommunityEFTAnalysisComponent,
    CommunityAHPPNAnalysisComponent
  ],
  entryComponents: [CommunitiesMapLayersComponent, NotificationComponent, ConfirmDialogComponent],
  providers: [
    {
      provide: COMMUNITIES_LAYERS_SERVICE_CONTEXT,
      useValue: 'communities-layers',
    },
  ],
})
export class CommunitiesModule {
  constructor(injector: Injector) {
    const el = createCustomElement(CommunitiesMapLayersComponent, { injector });
    customElements.define('app-communities-map-layers', el);
  }
}
