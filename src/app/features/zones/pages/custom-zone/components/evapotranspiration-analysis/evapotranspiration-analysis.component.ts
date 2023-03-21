import { Component, Input, OnInit } from '@angular/core';
import { ZoneModel } from '@app/common/models/zone.model';

@Component({
  selector: 'app-et-analysis',
  templateUrl: './evapotranspiration-analysis.component.html',
  styleUrls: ['./evapotranspiration-analysis.component.scss'],
})
export class EvapotranspirationAnalysisComponent implements OnInit {
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

  ngOnInit() {
    console.log('Evapotranspiration Analysis Component initialized');
  }

  changeChart(chartType) {
    this.selectedChart = chartType;
  }
}