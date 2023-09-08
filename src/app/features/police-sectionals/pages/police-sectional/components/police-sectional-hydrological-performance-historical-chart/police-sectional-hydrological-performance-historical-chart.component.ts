import { Component, Input } from '@angular/core';
import { NotificationService } from '@app/common/components/notification/notification.service';
import { ZoneModel } from '@app/common/models/zone.model';
import { ZonesService } from '@app/common/services/zones.service';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-police-sectional-rh-historical-chart',
  templateUrl: './police-sectional-hydrological-performance-historical-chart.component.html',
  styleUrls: ['./police-sectional-hydrological-performance-historical-chart.component.scss'],
})
export class PoliceSectionalHydrologicalPerformanceHistoricalChartComponent {
  @Input() zone: ZoneModel;

  chartOptions: EChartsOption = {
    grid: {
      left: '7%',
      right: '7%',
      bottom: '28%',
    },
    title: {
      text: 'Rendimiento Hidrológico Histórico',
      top: '2%',
      // left: '50%',
    },
    legend: {
      data: [],
      orient: 'vertical',
      align: 'right',
      right: 10,
      backgroundColor: 'rgb(238,238,238)',
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: this.getAbscissaAxisData(),
      name: 'Años',
      nameLocation: 'middle',
      nameTextStyle: {
        padding: 40,
        fontWeight: 'bold',
      },
      axisLabel: {
        rotate: 30,
      },
    },
    yAxis: [
      {
        type: 'value',
        name: 'RH (mm)',
        nameLocation: 'middle',
        nameTextStyle: {
          padding: 30,
          fontWeight: 'bold',
        },
      },
      {
        type: 'value',
        name: 'RH/PPT (%)',
        nameLocation: 'middle',
        max: 100,
        nameTextStyle: {
          padding: 40,
          fontWeight: 'bold',
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
    toolbox: {
      itemSize: 24,
      right: '50%',
      iconStyle: { color: 'rgb(40,52,147)' },
      feature: {
        // dataView: { show: true, readOnly: false },
        saveAsImage: { show: true, title: 'Imagen', icon: 'image://assets/icons/download-80.png' },
        myExportCSV: {
          show: true,
          title: 'CSV',
          icon: 'image://assets/icons/export-csv-32.png',
          onclick: () => {
            this.saveCSV();
          },
        },
      },
    },
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
    let lastYear = currentDate.getFullYear() - 1;
    if (currentDate.getMonth() <= 5) {
      lastYear--;
    }
    const firstYear = 2003; // TODO: FIX Get from Config
    for (let i = firstYear; i <= lastYear; i += 1) {
      years.push(`${i} - ${i + 1}`);
    }
    return years;
  }

  saveCSV() {
    const csvHeader = ['Info', ...this.getAbscissaAxisData()];
    const csvData = [
      [
        'RH (RH/PPT)',
        ...this.historicalRHInformation.map(
          (d, index) => `${(12 * d.rh).toFixed(2)} (${this.historicalRHPropInformation[index].rhProp})`
        ),
      ],
    ];
    new AngularCsv(csvData, `${this.zone.name} RH Histórica`, { headers: csvHeader });
  }

  private async load() {
    this.chartInstance.showLoading({ text: 'Cargando datos...' });
    const rhData = await this.loadRH();
    const rhPropData = await this.loadRHProp();
    this.data.push(rhData.data, rhPropData.data);

    this.updateOptions = {
      series: this.data,
      legend: {
        data: [rhData.legendData, rhPropData.legendData],
      },
    };
    this.chartInstance.hideLoading();
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
      },
      legendData: 'RH/PPT Histórico',
    };
  }
}
