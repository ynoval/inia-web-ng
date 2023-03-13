import { Component, Input, OnInit } from '@angular/core';
import { ZoneModel } from '@app/common/models/zone.model';

@Component({
  selector: 'app-rh-analysis',
  templateUrl: './hydrological-performance-analysis.component.html',
  styleUrls: ['./hydrological-performance-analysis.component.scss'],
})
export class HydrologicalPerformanceAnalysisComponent implements OnInit {
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
    console.log('HydrologicalPerformanceComponent');
  }

  changeChart(chartType) {
    this.selectedChart = chartType;
  }
}
