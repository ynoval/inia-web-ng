import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ZoneListItemModel } from './zoneList.models';

@Component({
  selector: 'app-zone-list',
  templateUrl: './zoneList.component.html',
  styleUrls: ['./zoneList.component.scss'],
})
export class ZoneListComponent {
  @Input() zones: ZoneListItemModel[] = [];

  @Input() selectedZoneId: string = '';

  @Output() action: EventEmitter<any> = new EventEmitter<{ zoneId: string; actionId: string }>();

  @Output() toggleSelect: EventEmitter<any> = new EventEmitter<{ zoneId: string }>();

  doAction(zoneId, actionId) {
    console.log(zoneId, actionId);
    this.action.emit({ zoneId: zoneId, actionId: actionId });
  }

  toggleSelectZone(zone) {
    this.toggleSelect.emit({ zoneId: zone.id });
  }
}
