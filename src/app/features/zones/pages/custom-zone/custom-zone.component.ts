import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSettings } from '@app/app.settings';
import { Settings } from '@app/app.settings.model';

import { ZoneModel } from '@app/common/models/zone.model';
import { ZonesService } from '@app/common/services/zones.service';
import { from, Observable } from 'rxjs';

@Component({
  selector: 'app-custom-zone',
  templateUrl: './custom-zone.component.html',
  styleUrls: ['./custom-zone.component.scss'],
})
export class CustomZonePageComponent implements OnInit {
  texts = {
    loadingMessage: 'Cargando información de la zona, espere por favor... ',
  };


  public settings: Settings;

  id: string;

  zone$: Observable<ZoneModel>;

  zone: ZoneModel;

  zoneArea = 0;

  zoneInformation$: Observable<any>;

  isLoadingZone: boolean = true;

  constructor(
    public appSettings: AppSettings,
    private router: Router,
    private route: ActivatedRoute,
    private zonesService: ZonesService
  ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.isLoadingZone = true;
    this.id = this.route.snapshot.paramMap.get('id');
    this.zonesService.getZone(this.id).then((zone) => {
      this.zone = zone;
      this.isLoadingZone = false;
      this.zoneInformation$ = from(this.zonesService.getZoneInformation(this.id));
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
