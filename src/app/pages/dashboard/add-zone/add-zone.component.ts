import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

type ZoneType = 'LOCATION' | 'MARKER' | 'POLYGON' | 'RECTANGLE';

@Component({
  selector: 'app-add-zone',
  templateUrl: 'add-zone.component.html',
  styleUrls: ['./add-zone.component.scss'],
})
export class AddZoneComponent implements OnInit {
  currentLocation = null;

  selectedZoneType: ZoneType;

  constructor(@Inject(MAT_DIALOG_DATA) private data: { defaultZoneName: string }) {}

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      });
    }
    this.selectedZoneType = 'MARKER';
  }
}
