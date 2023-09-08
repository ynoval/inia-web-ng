import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-basin-properties',
  templateUrl: './basin-properties.component.html',
  styleUrls: ['./basin-properties.component.scss'],
})
export class BasinPropertiesComponent {
  @Input() properties: Array<{ propertyName: string; propertyValue: string }>;

  displayedColumns: string[] = ['propertyName', 'propertyValue'];

}
