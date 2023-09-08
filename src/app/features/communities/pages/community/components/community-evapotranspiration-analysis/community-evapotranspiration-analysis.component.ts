import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-community-et-analysis',
  templateUrl: './community-evapotranspiration-analysis.component.html',
  styleUrls: ['./community-evapotranspiration-analysis.component.scss'],
})
export class CommunityEvapotranspirationAnalysisComponent {
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
