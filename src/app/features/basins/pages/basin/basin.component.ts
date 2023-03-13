import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';

import { NotificationService } from '@app/common/components/notification/notification.service';

@Component({
  selector: 'app-basin',
  templateUrl: './basin.component.html',
  styleUrls: ['./basin.component.scss'],
})
export class BasinPageComponent implements AfterViewInit {
  texts = {
    loadingMessage: 'Cargando información de la cuenca',
  };

  constructor(private notificationService: NotificationService, public router: Router) {}

  ngAfterViewInit() {
    this.notificationService.showAction(this.texts.loadingMessage);
    setTimeout(() => this.notificationService.snackBar.dismiss(), 1000);
  }
}
