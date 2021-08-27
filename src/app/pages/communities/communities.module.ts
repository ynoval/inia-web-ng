import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from '../../shared/shared.module';
import { CommunitiesPageComponent } from './communities.component';

export const routes = [
  {
    path: '',
    component: CommunitiesPageComponent,
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
    GoogleMapsModule,
    PerfectScrollbarModule,
    SharedModule,
  ],
  declarations: [CommunitiesPageComponent],
})
export class CommunitiesModule {}
