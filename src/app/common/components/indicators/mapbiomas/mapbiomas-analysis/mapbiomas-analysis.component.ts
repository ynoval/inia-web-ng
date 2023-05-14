import { Component, Input, OnInit } from '@angular/core';
import { ZoneModel } from '@app/common/models/zone.model';

@Component({
  selector: 'app-mapbiomas-analysis',
  templateUrl: './mapbiomas-analysis.component.html',
  styleUrls: ['./mapbiomas-analysis.component.scss'],
})
export class MapbiomasAnalysisComponent implements OnInit {
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
    console.log('Mapbiomas Analysis Component initialized');
  }

  changeChart(chartType) {
    this.selectedChart = chartType;
  }
}
