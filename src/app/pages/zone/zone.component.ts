import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ZoneModel } from '@app/common/models/zone.model';
import { ZonesService } from '@app/common/services/zones.service';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';

@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.scss'],
})
export class ZonePageComponent implements OnInit {
  public settings: Settings;

  id: string;

  zone: ZoneModel;

  constructor(public appSettings: AppSettings, private route: ActivatedRoute, private zonesService: ZonesService) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.zone = this.zonesService.getZone(this.id);
    console.log(this.zone);
  }
}
