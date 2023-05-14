import { Component, Input, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnInit {
  @Input() pieChartOptions$: Observable<Partial<EChartsOption>>;

  @Input() pieChartData$: Observable<Array<{ value: number; name: string }>>;

  @Input() isLoading$: Observable<boolean>;

  chartInstance: any;

  options = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'right',
    },
    series: [],
  };

  updateOptions: any;

  ngOnInit() {
    console.log('Init Pie Chart');
    this.pieChartOptions$.subscribe((options) => this.updateChartOptions(options));
    this.pieChartData$.subscribe((data) => this.updateChartData(data));
    this.isLoading$.subscribe((isLoading) => {
      if (this.chartInstance) {
        if (isLoading) {
          this.chartInstance.showLoading({ text: 'Cargando datos...' });
          return;
        }
        this.chartInstance.hideLoading();
      }
    });
  }

  onChartInit(ec) {
    console.log({ ec });
    this.chartInstance = ec;
    // this.chartInstance.showLoading({ text: 'Cargando datos...' });
  }

  updateChartOptions(options) {
    console.log(`Update Chart Options: ${options}`);
    this.updateOptions = {
      ...this.updateOptions,
      ...options,
    };
  }

  updateChartData(data) {
    console.log(`Update Chart Data: ${data}`);
    this.updateOptions = {
      ...this.updateOptions,
      series: [
        {
          name: 'Data',
          type: 'pie',
          radius: '50%',
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
  }
}
