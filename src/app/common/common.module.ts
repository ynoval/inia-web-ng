import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

import { NotificationComponent } from './components/notification/notification.component';
import { NotificationService } from './components/notification/notification.service';
import { ConfirmDirective } from './directives/confirm/confirm.directive';
import { ConfirmDialogComponent } from './directives/confirm/confirm-dialog/confirm-dialog.component';
import { ApiService } from './services/api.service';
import { ZonesService } from './services/zones.service';
import { LayersService } from './services/layers.service';
import { CommunitiesLayersService } from './services/communities-layers.service';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  declarations: [NotificationComponent, ConfirmDirective, ConfirmDialogComponent],
  exports: [NotificationComponent, ConfirmDirective, ConfirmDialogComponent],
  providers: [NotificationService, ApiService, ZonesService, LayersService, CommunitiesLayersService],
  entryComponents: [ConfirmDialogComponent],
})
export class AppCommonModule {}
