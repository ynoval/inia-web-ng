import { Component, Input } from '@angular/core';
import { ZoneModel } from '@app/common/models/zone.model';

@Component({
  selector: 'app-basin-et-analysis',
  templateUrl: './basin-evapotranspiration-analysis.component.html',
  styleUrls: ['./basin-evapotranspiration-analysis.component.scss'],
})
export class BasinEvapotranspirationAnalysisComponent {
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
