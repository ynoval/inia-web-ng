import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-community-rh-analysis',
  templateUrl: './community-hydrological-performance-analysis.component.html',
  styleUrls: ['./community-hydrological-performance-analysis.component.scss'],
})
export class CommunityHydrologicalPerformanceAnalysisComponent {
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
