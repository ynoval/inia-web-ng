import { Component, Input, OnInit } from '@angular/core';
import { ZoneModel } from '@app/common/models/zone.model';

@Component({
  selector: 'app-community-ppna-analysis',
  templateUrl: './community-ppna-analysis.component.html',
  styleUrls: ['./community-ppna-analysis.component.scss'],
})
export class CommunityPPNAAnalysisComponent implements OnInit {
  @Input() communityId: string;

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
