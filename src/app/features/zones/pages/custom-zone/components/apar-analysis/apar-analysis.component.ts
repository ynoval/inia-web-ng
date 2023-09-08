import { Component, Input } from '@angular/core';
import { ZoneModel } from '@app/common/models/zone.model';

@Component({
  selector: 'app-apar-analysis',
  templateUrl: './apar-analysis.component.html',
  styleUrls: ['./apar-analysis.component.scss'],
})
export class APARAnalysisComponent {
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
