import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapService {
  private gmOptions = {
    center: { lat: -32, lng: -56 },
    zoom: 6,
    mapTypeId: google.maps.MapTypeId.HYBRID,
    scaleControl: false,
    disableDefaultUI: true,
    zoomControl: true,
    fullscreenControl: true,
    fullscreenControlOptions: { position: google.maps.ControlPosition.BOTTOM_RIGHT },
    keyboardShortcuts: false,
    mapTypeControl: true,
    mapTypeControlOptions: {
      position: google.maps.ControlPosition.TOP_LEFT,
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
    },
  };

  getMapOptions() {
    return this.gmOptions;
  }
}
