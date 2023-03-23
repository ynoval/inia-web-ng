import { Component, Input, OnInit } from '@angular/core';
import { ZoneModel } from '@app/common/models/zone.model';

@Component({
  selector: 'app-police-sectional-ppna-analysis',
  templateUrl: './police-sectional-ppna-analysis.component.html',
  styleUrls: ['./police-sectional-ppna-analysis.component.scss'],
})
export class PoliceSectionalPPNAAnalysisComponent implements OnInit {
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
    console.log('PPNA Analysis Component initialized');
  }

  changeChart(chartType) {
    this.selectedChart = chartType;
  }
}
