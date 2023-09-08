import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-police-sectional-properties',
  templateUrl: './police-sectional-properties.component.html',
  styleUrls: ['./police-sectional-properties.component.scss'],
})
export class PoliceSectionalPropertiesComponent {
  @Input() properties: Array<{ propertyName: string; propertyValue: string }>;

  displayedColumns: string[] = ['propertyName', 'propertyValue'];


}
