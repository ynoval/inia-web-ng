import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { SharedModule } from "../../shared/shared.module";
import { CommunityModule } from "../community/community.module";
import { CommunitiesPageComponent } from "./communities.component";
import { CommunityPageComponent } from "../community/community.component";
import { SpeciePageComponent } from "../specie/specie.component";

export const routes = [
  {
    path: "",
    component: CommunitiesPageComponent,
    pathMatch: "full",
  },
  {
    path: "community/:id",
    loadChildren: () =>
      import("../community/community.module").then((m) => m.CommunityModule),
    data: { breadcrumb: "Comunidad" },
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NgxChartsModule,
    PerfectScrollbarModule,
    SharedModule,
  ],
  declarations: [CommunitiesPageComponent],
})
export class CommunitiesModule {}
