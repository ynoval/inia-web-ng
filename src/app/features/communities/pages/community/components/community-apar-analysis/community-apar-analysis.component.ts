import { Component, Input, OnInit } from '@angular/core';
import { ZoneModel } from '@app/common/models/zone.model';

@Component({
  selector: 'app-community-apar-analysis',
  templateUrl: './community-apar-analysis.component.html',
  styleUrls: ['./community-apar-analysis.component.scss'],
})
export class CommunityAPARAnalysisComponent implements OnInit {
  @Input() communityId: string;

  chartOptions = [
    {
      id: 'ANNUAL',
      label: 'Análisis por año',
    },
    {
      id: 'HISTORICAL',
      label: 'Análisis Histórico',
    },
  ];

  selectedChart = 'ANNUAL';

  ngOnInit() {
    console.log('APAR Analysis Component initialized');
  }

  changeChart(chartType) {
    this.selectedChart = chartType;
  }
}
