import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";

import { PagesComponent } from "./pages/pages.component";
import { NotFoundComponent } from "./pages/errors/not-found/not-found.component";
import { ErrorComponent } from "./pages/errors/error/error.component";

export const routes: Routes = [
  {
    path: "",
    component: PagesComponent,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./pages/dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
        data: { breadcrumb: "Dashboard" },
      },
      {
        path: "bookmarkedZones",
        loadChildren: () =>
          import("./pages/bookmarked-zones/bookmarked-zones.module").then(
            (m) => m.BookmarkedZonesModule
          ),
        data: { breadcrumb: "Zonas Seleccionadas" },
      },
      {
        path: "communities",
        loadChildren: () =>
          import("./pages/communities/communities.module").then(
            (m) => m.CommunitiesModule
          ),
        data: { breadcrumb: "Comunidades" },
      },
      {
        path: "information",
        loadChildren: () =>
          import("./pages/information/information.module").then(
            (m) => m.InformationModule
          ),
        data: { breadcrumb: "Información" },
      },
      {
        path: "mobile",
        loadChildren: () =>
          import("./pages/mobile/mobile.module").then((m) => m.MobileModule),
        data: { breadcrumb: "Aplicación Movil" },
      },
    ],
  },
  { path: "error", component: ErrorComponent, data: { breadcrumb: "Error" } },
  { path: "**", component: NotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // preloadingStrategy: PreloadAllModules, // <- comment this line for activate lazy load
      relativeLinkResolution: "legacy",
      // useHash: true
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
