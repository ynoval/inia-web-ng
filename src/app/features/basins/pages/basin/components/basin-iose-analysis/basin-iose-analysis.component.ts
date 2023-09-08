import { Component, Input } from '@angular/core';
import { ZoneModel } from '@app/common/models/zone.model';

@Component({
  selector: 'app-basin-iose-analysis',
  templateUrl: './basin-iose-analysis.component.html',
  styleUrls: ['./basin-iose-analysis.component.scss'],
})
export class BasinIOSEAnalysisComponent {
  @Input() zone: ZoneModel;
}
