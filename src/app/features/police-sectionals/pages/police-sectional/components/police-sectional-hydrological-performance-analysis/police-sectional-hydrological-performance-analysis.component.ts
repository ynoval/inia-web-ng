import { Component, Input } from '@angular/core';
import { ZoneModel } from '@app/common/models/zone.model';

@Component({
  selector: 'app-police-sectional-rh-analysis',
  templateUrl: './police-sectional-hydrological-performance-analysis.component.html',
  styleUrls: ['./police-sectional-hydrological-performance-analysis.component.scss'],
})
export class PoliceSectionalHydrologicalPerformanceAnalysisComponent {
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
