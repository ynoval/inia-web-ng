import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { createCustomElement } from '@angular/elements';
import { COMMUNITIES_LAYERS_SERVICE_CONTEXT } from '@app/common/services/communities-layers.service';
import { AppCommonModule } from '@app/common/common.module';
import { SharedModule } from '../../shared/shared.module';
import { CommunitiesPageComponent } from './communities.component';
import { CommunitiesMapLayersComponent } from './communities-map-layers/communities-map-layers.component';

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
    AppCommonModule,
  ],
  declarations: [CommunitiesPageComponent, CommunitiesMapLayersComponent],
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
