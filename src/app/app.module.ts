import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { OverlayContainer } from "@angular/cdk/overlay";
import { CustomOverlayContainer } from "./theme/utils/custom-overlay-container";

import { AgmCoreModule } from "@agm/core";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true,
  suppressScrollX: true,
};
import { SharedModule } from "./shared/shared.module";
import { PipesModule } from "./theme/pipes/pipes.module";
import { AppRoutingModule } from "./app.routing";

import { AppComponent } from "./app.component";
import { BookmarkedZonesComponent } from "./pages/bookmarked-zones/bookmarked-zones.component";
import { PagesComponent } from "./pages/pages.component";
import { NotFoundComponent } from "./pages/errors/not-found/not-found.component";
import { ErrorComponent } from "./pages/errors/error/error.component";
import { AppSettings } from "./app.settings";

import { SidenavComponent } from "./theme/components/sidenav/sidenav.component";
import { VerticalMenuComponent } from "./theme/components/menu/vertical-menu/vertical-menu.component";
import { BreadcrumbComponent } from "./theme/components/breadcrumb/breadcrumb.component";
import { FullScreenComponent } from "./theme/components/fullscreen/fullscreen.component";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyAO7Mg2Cs1qzo_3jkKkZAKY6jtwIlm41-I",
    }),
    PerfectScrollbarModule,
    SharedModule,
    PipesModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    PagesComponent,
    NotFoundComponent,
    ErrorComponent,
    SidenavComponent,
    VerticalMenuComponent,
    BreadcrumbComponent,
    FullScreenComponent,
  ],
  providers: [
    AppSettings,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    { provide: OverlayContainer, useClass: CustomOverlayContainer },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
