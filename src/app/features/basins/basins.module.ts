import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgxFileDropModule } from 'ngx-file-drop';
import { AppSharedModule } from '@app/shared.module';
import { AppCommonModule } from '@app/common/common.module';
import { NotificationComponent } from '@app/common/components/notification/notification.component';

import { ZONES_SERVICE_CONTEXT, ZONES_SERVICE_EDITABLE } from '@app/common/services/zones.service';
import { BASINS_SERVICE_CONTEXT } from './services/basins.service';

import { Ng2DeepSearchPipe } from './pipes/basins-search.pipe';
import { BasinPageComponent } from './pages/basin/basin.component';
import { BasinsPageComponent } from './pages/basins/basins.component';
import { BasinsRoutes } from './basins.routing';

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
    AppSharedModule,
    AppCommonModule,
  ],
  declarations: [BasinsPageComponent, BasinPageComponent, Ng2DeepSearchPipe],
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
