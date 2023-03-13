import { AfterViewInit, Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSettings } from '@app/app.settings';
import { Settings } from '@app/app.settings.model';

import { NotificationService } from '@app/common/components/notification/notification.service';
import { ZoneModel } from '@app/common/models/zone.model';
import { ZonesService } from '@app/common/services/zones.service';
import { from, Observable } from 'rxjs';

@Component({
  selector: 'app-custom-zone',
  templateUrl: './custom-zone.component.html',
  styleUrls: ['./custom-zone.component.scss'],
})
export class CustomZonePageComponent implements OnInit, AfterViewInit {
  texts = {
    loadingMessage: 'Cargando información de la zona',
  };

  public settings: Settings;

  id: string;

  zone$: Observable<ZoneModel>;

  zone: ZoneModel;

  zoneArea = 0;

  zoneInformation$: Observable<any>;

  constructor(
    public appSettings: AppSettings,
    private router: Router,
    private route: ActivatedRoute,
    private zonesService: ZonesService,
    private notificationService: NotificationService,
    private ngZone: NgZone
  ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.zonesService.getZone(this.id).then((zone) => {
      this.zone = zone;
      // this.zone.properties = !this.zone.properties
      //   ? []
      //   : this.zone.properties.map((prop) => ({ ...prop, id: uuidv4() }));
      this.loadZoneInformation();
    });
  }

  ngAfterViewInit() {
    this.notificationService.showAction(this.texts.loadingMessage);
    setTimeout(() => this.notificationService.snackBar.dismiss(), 1000);
  }

  private async loadZoneInformation() {
    const notification = this.notificationService.showAction('Cargando información sobre la zona');
    this.zoneInformation$ = from(this.zonesService.getZoneInformation(this.id));
    this.zoneInformation$.subscribe(() => {
      this.notificationService.confirmAction('Zona cargada!');
      setTimeout(() => notification.dismiss(), 300);
    });
  }

  getZoneName() {
    if (!this.zone) {
      return '';
    }
    const propertyName = this.zone.properties.find((prop) => prop.propertyName === 'name');
    return propertyName ? propertyName.propertyValue : this.zone.name;
  }

  getZoneDescription() {
    if (!this.zone) {
      return '';
    }
    const propertyDescription = this.zone.properties.find((prop) => prop.propertyName === 'description');
    return propertyDescription ? propertyDescription.propertyValue : '';
  }

  viewCommunity(communityId: string) {
    this.router.navigate(['community', communityId]);
  }
}
