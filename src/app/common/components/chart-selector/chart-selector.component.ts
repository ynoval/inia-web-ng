import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

export type ChartType = {
  id: string;
  label: string;
};

@Component({
  selector: 'app-chart-selector',
  templateUrl: './chart-selector.component.html',
  styleUrls: ['./chart-selector.component.scss'],
})
export class ChartSelectorComponent implements OnInit {
  @Input() chartTypes: ChartType[];

  _selectedChart: string;

  @Output() selectedChartChanged: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit() {
    this._selectedChart = this.chartTypes[0].id;
  }

  changeChart(selectedOption) {
    this.selectedChartChanged.emit(selectedOption.value);
  }

}
