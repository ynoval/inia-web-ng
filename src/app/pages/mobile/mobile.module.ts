import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
// import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { PathMatch } from '@app/common/models/pathMatch.type';
import { AppSharedModule } from '@app/shared.module';
import { MobileComponent } from './mobile.component';

export const routes = [{ path: '', component: MobileComponent, pathMatch: 'full' as PathMatch}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    // PerfectScrollbarModule,
    AppSharedModule],
  declarations: [MobileComponent],
})
export class MobileModule {}
