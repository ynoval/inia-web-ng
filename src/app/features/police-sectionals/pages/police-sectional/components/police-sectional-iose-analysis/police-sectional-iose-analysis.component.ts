import { Component, Input, OnInit } from '@angular/core';
import { ZoneModel } from '@app/common/models/zone.model';

@Component({
  selector: 'app-police-sectional-iose-analysis',
  templateUrl: './police-sectional-iose-analysis.component.html',
  styleUrls: ['./police-sectional-iose-analysis.component.scss'],
})
export class PoliceSectionalIOSEAnalysisComponent implements OnInit {
  @Input() zone: ZoneModel;

  ngOnInit() {
    console.log('IOSE Analysis Component initialized');
  }
}
