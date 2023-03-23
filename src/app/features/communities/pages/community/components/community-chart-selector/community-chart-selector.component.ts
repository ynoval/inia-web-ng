import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

export type ChartType = {
  id: string;
  label: string;
};

@Component({
  selector: 'app-community-chart-selector',
  templateUrl: './community-chart-selector.component.html',
  styleUrls: ['./community-chart-selector.component.scss'],
})
export class CommunityChartSelectorComponent implements OnChanges, OnInit {
  @Input() chartTypes: ChartType[];

  _selectedChart: string;

  @Output() selectedChartChanged: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit() {
    this._selectedChart = this.chartTypes[0].id;
  }

  changeChart(selectedOption) {
    this.selectedChartChanged.emit(selectedOption.value);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes:', { changes });
  }
}
