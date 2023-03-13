import { Component, Input } from '@angular/core';
import { NotificationService } from '@app/common/components/notification/notification.service';
import { ZoneModel } from '@app/common/models/zone.model';
import { ZonesService } from '@app/common/services/zones.service';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-ppna-historical-chart',
  templateUrl: './ppna-historical-chart.component.html',
  styleUrls: ['./ppna-historical-chart.component.scss'],
})
export class PPNAHistoricalChartComponent {
  @Input() zone: ZoneModel;

  chartOptions: EChartsOption = {
    title: {
      text: 'Productividad Histórica',
      top: '2%',
      // left: '50%',
    },
    legend: {
      data: [],
      orient: 'vertical',
      align: 'right',
      type: 'scroll',
      right: 10,
      top: 20,
      bottom: 20,
      backgroundColor: 'rgb(238,238,238)',
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: this.getAbscissaAxisData(),
      name: 'Años',
      nameLocation: 'middle',
      nameTextStyle: {
        padding: 20,
      },
    },
    yAxis: {
      type: 'value',
      name: 'PPNA (kg MS/ha por año)',
      nameLocation: 'middle',
      nameTextStyle: {
        padding: 30,
      },
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
      },
      {
        start: 0,
        end: 100,
      },
    ],
    series: [],
  };

  chartInstance: any;

  updateOptions: any;

  data = [];

  historicalPPNAInformation: any;

  constructor(private zonesService: ZonesService, private notificationService: NotificationService) {}

  onChartInit(ec) {
    if (!this.chartInstance) {
      this.chartInstance = ec;
      this.load();
    }
  }

  getAbscissaAxisData() {
    const years = [];
    const currentDate = new Date();
    const lastYear = currentDate.getFullYear() - 1;
    // currentDate.getMonth() !== 0 || currentDate.getDate() > 20
    //   ? currentDate.getFullYear()
    //   : currentDate.getFullYear() - 1;
    const firstYear = 2001; // TODO: FIX Get from Config
    for (let i = firstYear; i <= lastYear; i += 1) {
      years.push(i);
    }
    return years;
  }

  saveCSV() {
    console.log('save CSV');
  }

  // TODO: Refactoring
  private async load() {
    const notification = this.notificationService.showAction('Cargando información de productividad histórica');
    const legendData = [];
    this.historicalPPNAInformation = await this.zonesService.getZoneHistoricalPPNA(this.zone.id);
    this.data.push({
      type: 'line',
      smooth: true,
      emphasis: {
        itemStyle: {
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.8)',
        },
      },
      name: 'Productividad Histórica',
      large: true,
      data: this.historicalPPNAInformation.map((value) => (12 * value.ppna).toFixed(2)),
      markLine: {
        data: [
          {
            name: 'media histórica',
            type: 'average',
          },
        ],
      },
      endLabel: {
        show: true,
      },
    });
    legendData.push('Productividad Histórica');
    this.updateOptions = {
      series: this.data,
      legend: {
        data: legendData,
      },
    };
    notification.dismiss();
  }
}
