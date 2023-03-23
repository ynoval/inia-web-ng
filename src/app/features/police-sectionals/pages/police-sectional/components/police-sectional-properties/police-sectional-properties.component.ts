import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-police-sectional-properties',
  templateUrl: './police-sectional-properties.component.html',
  styleUrls: ['./police-sectional-properties.component.scss'],
})
export class PoliceSectionalPropertiesComponent implements OnInit {
  @Input() properties: Array<{ propertyName: string; propertyValue: string }>;

  displayedColumns: string[] = ['propertyName', 'propertyValue'];

  ngOnInit(): void {
    console.log('Police Sectional properties init');
    console.log({ properties: this.properties });
  }
}
