import { Component, Input, OnInit } from '@angular/core';
import { ZoneModel } from '@app/common/models/zone.model';

@Component({
  selector: 'app-police-sectional-rh-analysis',
  templateUrl: './police-sectional-hydrological-performance-analysis.component.html',
  styleUrls: ['./police-sectional-hydrological-performance-analysis.component.scss'],
})
export class PoliceSectionalHydrologicalPerformanceAnalysisComponent implements OnInit {
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
