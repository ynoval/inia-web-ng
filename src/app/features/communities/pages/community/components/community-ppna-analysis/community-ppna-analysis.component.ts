import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-community-ppna-analysis',
  templateUrl: './community-ppna-analysis.component.html',
  styleUrls: ['./community-ppna-analysis.component.scss'],
})
export class CommunityPPNAAnalysisComponent {
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

  changeChart(chartType) {
    this.selectedChart = chartType;
  }
}
