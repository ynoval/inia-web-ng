import { Component, Input, OnInit } from '@angular/core';
import { ZoneModel } from '@app/common/models/zone.model';

@Component({
  selector: 'app-basin-iose-analysis',
  templateUrl: './basin-iose-analysis.component.html',
  styleUrls: ['./basin-iose-analysis.component.scss'],
})
export class BasinIOSEAnalysisComponent implements OnInit {
  @Input() zone: ZoneModel;

  ngOnInit() {
    console.log('IOSE Analysis Component initialized');
  }
}
