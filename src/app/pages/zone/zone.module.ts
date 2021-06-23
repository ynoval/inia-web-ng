import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { SharedModule } from "../../shared/shared.module";
import { ZonePageComponent } from "./zone.component";

export const routes = [
  {
    path: "",
    component: ZonePageComponent,
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
    PerfectScrollbarModule,
    SharedModule,
  ],
  declarations: [ZonePageComponent],
})
export class ZoneModule {}
