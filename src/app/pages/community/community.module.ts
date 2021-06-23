import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { SharedModule } from "../../shared/shared.module";
import { CommunityPageComponent } from "./community.component";

export const routes = [
  {
    path: "",
    component: CommunityPageComponent,
    pathMatch: "full",

  },
  {
    path: "specie/:idSpecie",
    loadChildren: () =>
      import("../specie/specie.module").then((m) => m.SpecieModule),
    data: { breadcrumb: "Especie" },
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
  declarations: [CommunityPageComponent],
})
export class CommunityModule {}
