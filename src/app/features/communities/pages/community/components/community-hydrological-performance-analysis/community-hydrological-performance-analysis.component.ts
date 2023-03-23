import { Component, Input, OnInit } from '@angular/core';
import { ZoneModel } from '@app/common/models/zone.model';

@Component({
  selector: 'app-community-rh-analysis',
  templateUrl: './community-hydrological-performance-analysis.component.html',
  styleUrls: ['./community-hydrological-performance-analysis.component.scss'],
})
export class CommunityHydrologicalPerformanceAnalysisComponent implements OnInit {
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
