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

import { BasinsComponent } from './basins.component';
import { Ng2DeepSearchPipe } from './basins.pipe';
import { PathMatch } from '@app/common/models/pathMatch.type';

export const routes = [
  {
    path: '',
    component: BasinsComponent,
    pathMatch: 'full' as PathMatch,
  },
  {
    path: 'basins/:id',
    loadChildren: () => import('../zone/zone.module').then((m) => m.ZoneModule),
    data: { breadcrumb: 'Cuenca Seleccionada' },
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
  declarations: [BasinsComponent, Ng2DeepSearchPipe],
  entryComponents: [NotificationComponent],
  providers: [
    {
      provide: ZONES_SERVICE_CONTEXT,
      useValue: 'basins',
    },
    {
      provide: ZONES_SERVICE_EDITABLE,
      useValue: false,
    },
  ],
})
export class BasinsModule {}
