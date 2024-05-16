import { Component, Input } from '@angular/core';
import { ZoneModel } from '@app/common/models/zone.model';

@Component({
  selector: 'app-padron-et-analysis',
  templateUrl: './padron-evapotranspiration-analysis.component.html',
  styleUrls: ['./padron-evapotranspiration-analysis.component.scss'],
})
export class PadronEvapotranspirationAnalysisComponent {
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
