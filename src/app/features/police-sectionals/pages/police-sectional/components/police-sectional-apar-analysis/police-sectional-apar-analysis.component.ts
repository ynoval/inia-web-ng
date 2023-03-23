import { Component, Input, OnInit } from '@angular/core';
import { ZoneModel } from '@app/common/models/zone.model';

@Component({
  selector: 'app-police-sectional-apar-analysis',
  templateUrl: './police-sectional-apar-analysis.component.html',
  styleUrls: ['./police-sectional-apar-analysis.component.scss'],
})
export class PoliceSectionalAPARAnalysisComponent implements OnInit {
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
    console.log('APAR Analysis Component initialized');
  }

  changeChart(chartType) {
    this.selectedChart = chartType;
  }
}
