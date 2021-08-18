import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from '../../shared/shared.module';
import { BookmarkedZonesComponent } from './bookmarked-zones.component';

export const routes = [
  { path: '', component: BookmarkedZonesComponent, pathMatch: 'full' },
  {
    path: 'zone',
    loadChildren: () => import('../zone/zone.module').then((m) => m.ZoneModule),
    data: { breadcrumb: 'Zona' },
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule, PerfectScrollbarModule, SharedModule],
  declarations: [BookmarkedZonesComponent],
})
export class BookmarkedZonesModule {}
