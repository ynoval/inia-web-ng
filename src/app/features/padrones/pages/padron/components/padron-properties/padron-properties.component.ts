import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-padron-properties',
  templateUrl: './padron-properties.component.html',
  styleUrls: ['./padron-properties.component.scss'],
})
export class PadronPropertiesComponent {
  @Input() properties: Array<{ propertyName: string; propertyValue: string }>;

  displayedColumns: string[] = ['propertyName', 'propertyValue'];

}
