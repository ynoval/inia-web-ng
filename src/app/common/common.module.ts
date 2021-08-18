import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

import { NotificationComponent } from './components/notification/notification.component';
import { NotificationService } from './components/notification/notification.service';
import { ConfirmDirective } from './directives/confirm/confirm.directive';
import { ConfirmDialogComponent } from './directives/confirm/confirm-dialog/confirm-dialog.component';
import { ApiService } from './services/api.service';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  declarations: [NotificationComponent, ConfirmDirective, ConfirmDialogComponent],
  exports: [NotificationComponent, ConfirmDirective, ConfirmDialogComponent],
  providers: [NotificationService, ApiService],
  entryComponents: [ConfirmDialogComponent],
})
export class AppCommonModule {}
