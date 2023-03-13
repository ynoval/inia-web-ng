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

import { PoliceSectionalsComponent } from './police-sectionals.component';
import { PathMatch } from '@app/common/models/pathMatch.type';

export const routes = [
  { path: '', component: PoliceSectionalsComponent, pathMatch: 'full' as PathMatch },
  {
    path: 'zone/:id',
    loadChildren: () => import('../zone/zone.module').then((m) => m.ZoneModule),
    data: { breadcrumb: 'Zona Seleccionada' },
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    GoogleMapsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    PerfectScrollbarModule,
    NgxFileDropModule,
    AppSharedModule,
    AppCommonModule,
  ],
  declarations: [PoliceSectionalsComponent],
  entryComponents: [NotificationComponent],
  providers: [
    {
      provide: ZONES_SERVICE_CONTEXT,
      useValue: 'police-zones',
    },
    {
      provide: ZONES_SERVICE_EDITABLE,
      useValue: false,
    },
  ],
})
export class PoliceSectionalsModule {}
