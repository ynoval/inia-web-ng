import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ZoneModel } from '@app/common/models/zone.model';

@Component({
  selector: 'app-delete-zones',
  templateUrl: 'delete-zones.component.html',
  styleUrls: ['./delete-zones.component.scss'],
})
export class DeleteZonesComponent implements OnInit {
  selectedZones = [];

  areHiddenZones: boolean;

  areVisibleZones: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { zones: ZoneModel[] }) {}

  ngOnInit() {
    this.selectedZones = Object.assign(
      [],
      this.data.zones.map((z) => z.name)
    );

    this.areHiddenZones = this.data.zones.filter((z) => !z.visible).length > 0;
    this.areVisibleZones = this.data.zones.filter((z) => z.visible).length > 0;
  }

  checkAll(): void {
    this.selectedZones = Object.assign(
      [],
      this.data.zones.map((z) => z.name)
    );
  }

  uncheckAll(): void {
    this.selectedZones = Object.assign([]);
  }

  checkVisible(): void {
    this.selectedZones = Object.assign(
      [],
      this.data.zones.filter((z) => z.visible).map((z) => z.name)
    );
  }

  checkHidden(): void {
    this.selectedZones = Object.assign(
      [],
      this.data.zones.filter((z) => !z.visible).map((z) => z.name)
    );
  }
}
