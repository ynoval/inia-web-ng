import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-community-iose-analysis',
  templateUrl: './community-iose-analysis.component.html',
  styleUrls: ['./community-iose-analysis.component.scss'],
})
export class CommunityIOSEAnalysisComponent {
  @Input() communityId: string;
}
