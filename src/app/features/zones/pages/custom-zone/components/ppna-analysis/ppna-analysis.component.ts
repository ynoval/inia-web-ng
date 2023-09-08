import { Component, Input } from '@angular/core';
import { ZoneModel } from '@app/common/models/zone.model';

@Component({
  selector: 'app-ppna-analysis',
  templateUrl: './ppna-analysis.component.html',
  styleUrls: ['./ppna-analysis.component.scss'],
})
export class PPNAAnalysisComponent {
  @Input() zone: ZoneModel;

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
