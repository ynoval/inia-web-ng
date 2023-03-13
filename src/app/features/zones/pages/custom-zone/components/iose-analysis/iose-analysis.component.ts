import { Component, Input, OnInit } from '@angular/core';
import { ZoneModel } from '@app/common/models/zone.model';

@Component({
  selector: 'app-iose-analysis',
  templateUrl: './iose-analysis.component.html',
  styleUrls: ['./iose-analysis.component.scss'],
})
export class IOSEAnalysisComponent implements OnInit {
  @Input() zone: ZoneModel;

  ngOnInit() {
    console.log('IOSE Analysis Component initialized');
  }
}
