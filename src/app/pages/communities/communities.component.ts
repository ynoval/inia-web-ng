import { Component } from '@angular/core';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';

@Component({
  selector: 'app-communities',
  templateUrl: './communities.component.html',
  styleUrls: ['./communities.component.scss'],
})
export class CommunitiesPageComponent {
  public settings: Settings;

  public gmOptions: google.maps.MapOptions;

  constructor(public appSettings: AppSettings) {
    this.settings = this.appSettings.settings;
    this.gmOptions = {
      center: { lat: -32, lng: -56 },
      zoom: 6,
      mapTypeId: 'satellite',
      scaleControl: false,
      disableDefaultUI: true,
      zoomControl: true,
      fullscreenControl: true,
      fullscreenControlOptions: { position: google.maps.ControlPosition.BOTTOM_RIGHT },
      keyboardShortcuts: false,
    };
  }
}
