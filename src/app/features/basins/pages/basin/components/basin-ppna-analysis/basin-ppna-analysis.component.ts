import { Component, Input } from '@angular/core';
import { ZoneModel } from '@app/common/models/zone.model';

@Component({
  selector: 'app-basin-ppna-analysis',
  templateUrl: './basin-ppna-analysis.component.html',
  styleUrls: ['./basin-ppna-analysis.component.scss'],
})
export class BasinPPNAAnalysisComponent {
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
