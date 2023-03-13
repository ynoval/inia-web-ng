import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { AppSharedModule } from '@app/shared.module';
import { AppCommonModule } from '@app/common/common.module';
import { PathMatch } from '@app/common/models/pathMatch.type';
import { InformationComponent } from './information.component';

export const routes = [{ path: '', component: InformationComponent, pathMatch: 'full' as PathMatch}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    PerfectScrollbarModule,
    AppSharedModule,
    AppCommonModule,
  ],
  declarations: [InformationComponent],
})
export class InformationModule {}
