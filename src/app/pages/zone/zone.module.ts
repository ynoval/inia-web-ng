import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxEchartsModule } from 'ngx-echarts';
import { AgGridModule } from '@ag-grid-community/angular';
import { ZONES_SERVICE_CONTEXT } from '@app/common/services/zones.service';
import { SharedModule } from '../../shared/shared.module';
import { ZonePageComponent } from './zone.component';
import { GridDeleteButtonRendererComponent } from './grid-delete-button';

export const routes = [
  {
    path: '',
    component: ZonePageComponent,
    pathMatch: 'full',
  },
  {
    path: 'community/:id',
    loadChildren: () => import('../community/community.module').then((m) => m.CommunityModule),
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
    AgGridModule.withComponents([GridDeleteButtonRendererComponent]),
    SharedModule,
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
