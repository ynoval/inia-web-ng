// eslint-disable-next-line max-classes-per-file
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { NotificationComponent } from './notification.component';
import { NotificationModel } from './notification.model';

type MessageType = 'INFO' | 'WARN' | 'ERROR' | 'CONFIRM';

class SnackConfig {
  public duration: number;

  public data: NotificationModel;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(public snackBar: MatSnackBar) {}

  public showAction(actionMessage: string): MatSnackBarRef<NotificationComponent> {
    return this.showSnackBar('INFO', actionMessage, true);
  }

  public confirmAction(actionMessage: string) {
    this.showSnackBar('CONFIRM', actionMessage);
  }

  public showInformation(infoMessage: string) {
    this.showSnackBar('INFO', infoMessage);
  }

  public showWarning(warnMessage: string) {
    this.showSnackBar('WARN', warnMessage);
  }

  public showError(errorMessage: string) {
    this.showSnackBar('ERROR', errorMessage);
  }

  private showSnackBar(
    messageType: MessageType,
    message: string,
    showProgress = false
  ): MatSnackBarRef<NotificationComponent> {
    const notification = new NotificationModel(message, this.getIcon(messageType), showProgress);

    const snackBarConfig = new SnackConfig();
    snackBarConfig.data = notification;
    if (!showProgress) {
      snackBarConfig.duration = 1000;
    }

    return this.snackBar.openFromComponent(NotificationComponent, snackBarConfig);
  }

  // eslint-disable-next-line class-methods-use-this
  private getIcon(type: MessageType): string {
    switch (type) {
      case 'INFO': {
        return 'info';
      }
      case 'WARN': {
        return 'warn';
      }
      case 'ERROR': {
        return 'error';
      }
      case 'CONFIRM': {
        return 'done_outline';
      }
      default: {
        return 'info';
      }
    }
  }
}
