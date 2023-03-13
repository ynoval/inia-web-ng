import { Component, Input } from '@angular/core';
import { NotificationService } from '@app/common/components/notification/notification.service';
import { ZoneModel } from '@app/common/models/zone.model';
import { ZonesService } from '@app/common/services/zones.service';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-rh-historical-chart',
  templateUrl: './hydrological-performance-historical-chart.component.html',
  styleUrls: ['./hydrological-performance-historical-chart.component.scss'],
})
export class HydrologicalPerformanceHistoricalChartComponent {
  @Input() zone: ZoneModel;

  chartOptions: EChartsOption = {
    title: {
      text: 'Rendimiento Hidrológico Histórico',
      top: '2%',
      // left: '50%',
    },
    legend: {
      data: [],
      // orient: 'vertical',
      // align: 'right',
      // type: 'scroll',
      // right: 10,
      // top: 20,
      // bottom: 20,
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
    yAxis: [
      {
        type: 'value',
        name: 'RH (mm)',
        nameLocation: 'middle',
        nameTextStyle: {
          padding: 30,
        },
      },
      {
        type: 'value',
        name: 'RH/PPT (%)',
        nameLocation: 'middle',
        nameTextStyle: {
          padding: 30,
        },
      },
    ],
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

  historicalRHInformation: any;

  historicalRHPropInformation: any;

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
    const firstYear = 2003; // TODO: FIX Get from Config
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
    const notification = this.notificationService.showAction(
      'Cargando información de rendimiento hidrológico histórico'
    );
    const rhData = await this.loadRH();
    const rhPropData = await this.loadRHProp();
    this.data.push(rhData.data, rhPropData.data);

    this.updateOptions = {
      series: this.data,
      legend: {
        data: [rhData.legendData, rhPropData.legendData],
      },
    };
    notification.dismiss();
  }

  private async loadRH() {
    this.historicalRHInformation = await this.zonesService.getZoneHistoricalRH(this.zone.id);
    return {
      data: {
        type: 'bar',
        smooth: true,
        emphasis: {
          itemStyle: {
            shadowBlur: 20,
            shadowColor: 'rgba(0, 0, 0, 0.8)',
          },
        },
        name: 'RH Histórico',
        large: true,
        data: this.historicalRHInformation.map((value) => (12 * value.rh).toFixed(2)),
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
      },
      legendData: 'RH Histórico',
    };
  }

  private async loadRHProp() {
    this.historicalRHPropInformation = await this.zonesService.getZoneHistoricalRHProp(this.zone.id);
    return {
      data: {
        type: 'bar',
        smooth: true,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.8)',
          },
        },
        name: 'RH/PPT Histórico',
        yAxisIndex: 1,
        large: true,
        data: this.historicalRHPropInformation.map((value) => (1 * value.rhProp).toFixed(2)),
        markLine: {
          data: [
            {
              name: 'media RH/PPT histórica',
              type: 'average',
            },
          ],
        },
        endLabel: {
          show: true,
        },
      },
      legendData: 'RH/PPT Histórico',
    };
  }
}
