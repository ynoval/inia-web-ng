import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
// import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { AppSharedModule } from '@app/shared.module';
import { SpeciePageComponent } from './specie.component';
import { PathMatch } from '@app/common/models/pathMatch.type';

export const routes = [
  {
    path: '',
    component: SpeciePageComponent,
    pathMatch: 'full' as PathMatch,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    // PerfectScrollbarModule,
    AppSharedModule],
  declarations: [SpeciePageComponent],
})
export class SpecieModule {}
