import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from '../../shared/shared.module';
import { SpeciePageComponent } from './specie.component';

export const routes = [
  {
    path: '',
    component: SpeciePageComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule, PerfectScrollbarModule, SharedModule],
  declarations: [SpeciePageComponent],
})
export class SpecieModule {}
