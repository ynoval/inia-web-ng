import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxEchartsModule } from 'ngx-echarts';
// import { AgGridModule } from '@ag-grid-community/angular';

import { AppSharedModule } from '@app/shared.module';
import { AppCommonModule } from '@app/common/common.module';
import { ZONES_SERVICE_CONTEXT } from '@app/common/services/zones.service';

import { ZonePageComponent } from './zone.component';
import { GridDeleteButtonRendererComponent } from './grid-delete-button';
import { PathMatch } from '@app/common/models/pathMatch.type';

export const routes = [
  {
    path: '',
    component: ZonePageComponent,
    pathMatch: 'full' as PathMatch,
  },
  {
    path: 'community/:id',
    loadChildren: () => import('../communityOLD/community.module').then((m) => m.CommunityModule),
    data: { breadcrumb: 'Comunidad' },
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    PerfectScrollbarModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    // AgGridModule.withComponents([GridDeleteButtonRendererComponent]),
    // AgGridModule,
    AppSharedModule,
    AppCommonModule,
  ],
  declarations: [ZonePageComponent, GridDeleteButtonRendererComponent],
  providers: [
    {
      provide: ZONES_SERVICE_CONTEXT,
      useValue: 'dashboard-zones',
    },
  ],
})
export class ZoneModule {}
