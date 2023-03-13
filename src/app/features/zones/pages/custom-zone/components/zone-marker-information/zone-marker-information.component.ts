import { Component, Input, OnInit } from '@angular/core';

export type CommunityInfoType = {
  id: string;
  order: string;
};

@Component({
  selector: 'app-zone-marker-info',
  templateUrl: './zone-marker-information.component.html',
  styleUrls: ['./zone-marker-information.component.scss'],
})
export class ZoneMarkerInformationComponent implements OnInit {
  texts = {
    latitudeLabel: 'Latitud',
    longitudeLabel: 'Longitud',
    communityInformation: 'La ubicación pertenece a la comunidad de pastizales ',
    noCommunityInformation: 'La ubicación no pertenece a ninguna comunidad de pastizales',
    communityLinkText: 'Click para más información',
  };

  communityMessage: string = '';

  @Input() latitude = '';

  @Input() longitude = '';

  @Input() communityInformation?: CommunityInfoType;

  // @Output() viewCommunity = new EventEmitter();

  ngOnInit() {
    this.communityMessage = !this.communityInformation
      ? this.texts.noCommunityInformation
      : `${this.texts.communityInformation} ${this.communityInformation.order}`;
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   for (const propName in changes) {
  //     const chng = changes[propName];
  //     const cur = JSON.stringify(chng.currentValue);
  //     console.log('Change:', propName, cur);
  //   }
  // }

  // viewCommunityDetails() {
  //   this.viewCommunity.emit();
  // }
}
