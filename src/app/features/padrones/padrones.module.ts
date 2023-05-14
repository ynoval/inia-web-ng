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
  declarations: [PadronesPageComponent, PadronPageComponent, Ng2DeepSearchPipe, AddPadronModalComponent],
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
