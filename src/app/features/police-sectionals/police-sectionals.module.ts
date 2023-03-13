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
    AppSharedModule,
    AppCommonModule,
  ],
  declarations: [PoliceSectionalsPageComponent, PoliceSectionalPageComponent, Ng2DeepSearchPipe],
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
