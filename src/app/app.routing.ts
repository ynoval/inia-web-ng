import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from './pages/pages.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { ErrorComponent } from './pages/errors/error/error.component';

export const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        redirectTo: '/zones',
        pathMatch: 'full',
      },
      {
        path: 'zones',
        loadChildren: () => import('./features/zones/custom-zones.module').then((m) => m.CustomZonesModule),
      },
      {
        path: 'police-sectionals',
        loadChildren: () =>
          import('./features/police-sectionals/police-sectionals.module').then((m) => m.PoliceSectionalsModule),
      },
      {
        path: 'basins',
        loadChildren: () => import('./features/basins/basins.module').then((m) => m.BasinsModule),
      },
      {
        path: 'communities',
        loadChildren: () => import('./pages/communities/communities.module').then((m) => m.CommunitiesModule),
      },
      {
        path: 'information',
        loadChildren: () => import('./pages/information/information.module').then((m) => m.InformationModule),
        data: { breadcrumb: 'Información' },
      },
      {
        path: 'mobile',
        loadChildren: () => import('./pages/mobile/mobile.module').then((m) => m.MobileModule),
        data: { breadcrumb: 'Aplicación Movil' },
      },
    ],
  },
  { path: 'error', component: ErrorComponent, data: { breadcrumb: 'Error' } },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // preloadingStrategy: PreloadAllModules, // <- comment this line for activate lazy load
      // relativeLinkResolution: 'legacy',
      // useHash: true
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
