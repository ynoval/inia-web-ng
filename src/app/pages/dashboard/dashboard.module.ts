import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { GoogleMapsModule } from '@angular/google-maps';
import { AppCommonModule } from '@app/common/common.module';
import { createCustomElement } from '@angular/elements';
import { NotificationComponent } from '@app/common/components/notification/notification.component';
import { LAYERS_SERVICE_CONTEXT } from '@app/common/services/layers.service';
import { ZONES_SERVICE_CONTEXT } from '@app/common/services/zones.service';
import { SharedModule } from '../../shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { MapLayersComponent } from './map-layers/map-layers.component';
import { ImportZonesComponent } from './import-zones/import-zones.component';
import { ExportZonesComponent } from './export-zones/export-zones.component';
import { DeleteZonesComponent } from './delete-zones/delete-zones.component';
import { AddZoneComponent } from './add-zone/add-zone.component';

export const routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' },
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
    SharedModule,
    AppCommonModule,
  ],
  declarations: [
    DashboardComponent,
    MapLayersComponent,
    ImportZonesComponent,
    ExportZonesComponent,
    AddZoneComponent,
    DeleteZonesComponent,
  ],
  entryComponents: [
    MapLayersComponent,
    NotificationComponent,
    ImportZonesComponent,
    ExportZonesComponent,
    AddZoneComponent,
    DeleteZonesComponent,
  ],
  providers: [
    {
      provide: LAYERS_SERVICE_CONTEXT,
      useValue: 'dashboard-layers',
    },
    {
      provide: ZONES_SERVICE_CONTEXT,
      useValue: 'dashboard-zones',
    },
  ],
})
export class DashboardModule {
  constructor(injector: Injector) {
    const el = createCustomElement(MapLayersComponent, { injector });
    customElements.define('app-map-layers', el);
  }
}
