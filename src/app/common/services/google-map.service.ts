import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapService {
  private gmOptions = {
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

  getMapOptions() {
    return this.gmOptions;
  }
}
