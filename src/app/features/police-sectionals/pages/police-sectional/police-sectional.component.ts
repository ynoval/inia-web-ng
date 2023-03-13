import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';

import { NotificationService } from '@app/common/components/notification/notification.service';

@Component({
  selector: 'app-police-sectional',
  templateUrl: './police-sectional.component.html',
  styleUrls: ['./police-sectional.component.scss'],
})
export class PoliceSectionalPageComponent implements AfterViewInit {
  texts = {
    loadingMessage: 'Cargando información de la seccional Policial',
  };

  constructor(private notificationService: NotificationService, public router: Router) {}

  ngAfterViewInit() {
    this.notificationService.showAction(this.texts.loadingMessage);
    setTimeout(() => this.notificationService.snackBar.dismiss(), 1000);
  }
}
