import { Component, Input, OnInit } from '@angular/core';
import { ZoneModel } from '@app/common/models/zone.model';

@Component({
  selector: 'app-community-iose-analysis',
  templateUrl: './community-iose-analysis.component.html',
  styleUrls: ['./community-iose-analysis.component.scss'],
})
export class CommunityIOSEAnalysisComponent implements OnInit {
  @Input() communityId: string;

  ngOnInit() {
    console.log('IOSE Analysis Component initialized');
  }
}
