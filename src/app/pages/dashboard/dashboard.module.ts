import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { GoogleMapsModule } from '@angular/google-maps';
import { AppCommonModule } from '@app/common/common.module';
import { createCustomElement } from '@angular/elements';
import { SharedModule } from '../../shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { MapLayersComponent } from './map-layers/map-layers.component';

export const routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' },
  {
    path: 'zone',
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
    SharedModule,
    AppCommonModule,
  ],
  declarations: [DashboardComponent, MapLayersComponent],
  entryComponents: [MapLayersComponent],
})
export class DashboardModule {
  constructor(injector: Injector) {
    const el = createCustomElement(MapLayersComponent, { injector });
    customElements.define('app-map-layers', el);
  }
}
