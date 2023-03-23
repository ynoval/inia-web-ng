import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-basin-properties',
  templateUrl: './basin-properties.component.html',
  styleUrls: ['./basin-properties.component.scss'],
})
export class BasinPropertiesComponent implements OnInit {
  @Input() properties: Array<{ propertyName: string; propertyValue: string }>;

  displayedColumns: string[] = ['propertyName', 'propertyValue'];

  ngOnInit(): void {
    console.log('Basin properties init');
    console.log({ properties: this.properties });
  }
}
