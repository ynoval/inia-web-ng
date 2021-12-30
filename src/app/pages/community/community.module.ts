import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
// import { MatCarouselModule } from '@ngbmodule/material-carousel';
// import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxEchartsModule } from 'ngx-echarts';
import { SharedModule } from '../../shared/shared.module';
import { CommunityPageComponent } from './community.component';
import { ImageCarouselComponent } from './image-carousel/image-carousel.component';
import { SubCommunityComponent } from './subcommunity/subcommunity.component';

export const routes = [
  {
    path: '',
    component: CommunityPageComponent,
    pathMatch: 'full',
  },
  {
    path: 'specie/:idSpecie',
    loadChildren: () => import('../specie/specie.module').then((m) => m.SpecieModule),
    data: { breadcrumb: 'Especie' },
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    PerfectScrollbarModule,
    // MatCarouselModule.forRoot(),
    // LazyLoadImageModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    SharedModule,
  ],
  declarations: [CommunityPageComponent, SubCommunityComponent, ImageCarouselComponent],
})
export class CommunityModule {}
