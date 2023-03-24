import { Component, Input } from '@angular/core';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { EChartsOption } from 'echarts';

import { CommunitiesService } from '@app/common/services/communities.service';

@Component({
  selector: 'app-community-apar-historical-chart',
  templateUrl: './community-apar-historical-chart.component.html',
  styleUrls: ['./community-apar-historical-chart.component.scss'],
})
export class CommunityAPARHistoricalChartComponent {
  @Input() communityId: string;

  defaultMinValue = 600;

  defaultMaxValue = 800;

  yInterval = 50;

  chartOptions: EChartsOption = {
    grid: {
      left: '5%',
      right: '5%',
      show: true,
      borderWidth: 0,
      backgroundColor: '#f4f4f4',
      containLabel: true,
    },
    title: {
      text: 'Radiación absorbida anual',
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
        padding: 40,
        fontWeight: 'bold',
      },
      axisLabel: {
        rotate: 30,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#f5f5f5', '#e9e9e9'],
        },
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['#fcfcfc', '#f5f5f5'],
        },
      },
    },
    yAxis: {
      type: 'value',
      name: 'APAR (MJ/m2 por año)',
      nameLocation: 'middle',
      nameTextStyle: {
        padding: 30,
        fontWeight: 'bold',
      },
      max: 800,
      min: 600,
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

  aparInformation: any;

  constructor(private communitiesService: CommunitiesService) {}

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
    const firstYear = 2001; // TODO: FIX Get from Config
    for (let i = firstYear; i <= lastYear; i += 1) {
      years.push(`${i} - ${i + 1}`);
    }
    return years;
  }

  saveCSV() {
    const csvHeader = ['Info', ...this.getAbscissaAxisData()];
    const csvData = [['APAR Histórica', ...this.aparInformation.map((value) => (23 * value.apar).toFixed(2))]];
    new AngularCsv(csvData, `${this.communityId} Radiación Absorbida Histórica`, { headers: csvHeader });
  }

  // TODO: Refactoring
  private async load() {
    this.chartInstance.showLoading({ text: 'Cargando datos...' });
    const legendData = [];
    this.aparInformation = await this.communitiesService.getHistoricalAPAR(this.communityId);
    const data = this.aparInformation.map((value) => (12 * value.apar).toFixed(2));
    const minValue = Math.floor(Math.min(...data) / this.yInterval) * this.yInterval;
    const maxValue = Math.ceil(Math.max(...data) / this.yInterval) * this.yInterval;
    this.data.push({
      type: 'line',
      smooth: true,
      emphasis: {
        itemStyle: {
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.8)',
        },
      },
      name: 'APAR Histórica',
      large: true,
      data: data,
      markLine: {
        data: [
          {
            name: 'media histórica',
            type: 'average',
          },
        ],
      },
    });
    legendData.push('APAR Histórica');
    this.updateOptions = {
      series: this.data,
      legend: {
        data: legendData,
      },
      yAxis: {
        min: minValue < this.defaultMinValue ? minValue : this.defaultMinValue,
        max: maxValue > this.defaultMaxValue ? maxValue : this.defaultMaxValue,
      },
    };
    this.chartInstance.hideLoading();
  }
}
