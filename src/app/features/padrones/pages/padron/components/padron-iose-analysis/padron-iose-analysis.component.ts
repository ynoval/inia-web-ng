import { Component, Input } from '@angular/core';
import { ZoneModel } from '@app/common/models/zone.model';

@Component({
  selector: 'app-padron-iose-analysis',
  templateUrl: './padron-iose-analysis.component.html',
  styleUrls: ['./padron-iose-analysis.component.scss'],
})
export class PadronIOSEAnalysisComponent {
  @Input() zone: ZoneModel;
}
