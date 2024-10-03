import { Component, Input } from '@angular/core';
import { ZoneModel } from '@app/common/models/zone.model';
import { ZonesService } from '@app/common/services/zones.service';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import EChartsOption  from 'echarts';

const coverMap = {
  '1': 'Bosque Natural',
  '3': 'Formación forestal',
  '4': 'Formación sabánica / Bosque abierto',
  '9': 'Silvicultura',
  '10': 'Formación natural no forestal',
  // '11': 'Zona Pantanosa o pastizal inundable',
  '11': 'Zona Pantanosa',
  '12': 'Pastizal',
  '14': 'Agropecuaria y silvicultura',
  '15': 'Pastura',
  '18': 'Agricultura',
  '21': 'Agricultura o pastura',
  '22': 'Área sin vegetación',
  '26': 'Cuerpo de água',
  '33': 'Río, lago u océano',
  '27': 'No observado',
};

@Component({
  selector: 'app-mapbiomas-historical-chart',
  templateUrl: './mapbiomas-historical-chart.component.html',
  styleUrls: ['./mapbiomas-historical-chart.component.scss'],
})
export class MapbiomasHistoricalChartComponent {
  @Input() zone: ZoneModel;

  chartOptions: EChartsOption.EChartsOption = {
    grid: {
      left: '2%',
      right: '15%',
      bottom: '20%',
      show: true,
      borderWidth: 0,
      backgroundColor: '#f4f4f4',
      containLabel: true,
    },
    title: {
      text: 'Cobertura del suelo',
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
      name: 'Área (ha)',
      nameLocation: 'middle',
      nameTextStyle: {
        padding: 30,
        fontWeight: 'bold',
      },
      scale: true,
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
        top: 400,
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

  historicalMapbiomasInformation: any;

  constructor(private zonesService: ZonesService) {}

  onChartInit(ec) {
    if (!this.chartInstance) {
      this.chartInstance = ec;
      this.load();
    }
  }

  getAbscissaAxisData() {
    const years = [];
    // const currentDate = new Date();
    // let lastYear = currentDate.getFullYear() - 1;
    // if (currentDate.getMonth() <= 5) {
    //   lastYear--;
    // }
    const firstYear = 1985; // TODO: FIX Get from Config
    const lastYear = 2021;
    for (let i = firstYear; i <= lastYear; i += 1) {
      years.push(i);
    }
    return years;
  }

  saveCSV() {
    const csvHeader = ['Cobertura', ...this.getAbscissaAxisData()];
    const csvData = [];
    for (let coverId in this.historicalMapbiomasInformation) {
      const data = this.historicalMapbiomasInformation[coverId].map((value) => (value / 10000).toFixed(2));
      csvData.push([coverMap[coverId], ...data]);
    }

    new AngularCsv(csvData, `${this.zone.name} Cobertura del suelo Histórica`, { headers: csvHeader });
  }

  private async load() {
    this.chartInstance.showLoading({ text: 'Cargando datos...' });
    this.historicalMapbiomasInformation = await this.zonesService.getZoneHistoricalMapbiomas(this.zone.id);
    const legendData = [];
    // let minValue = Infinity;
    // let maxValue = -Infinity;
    for (let coverId in this.historicalMapbiomasInformation) {
      const coverName = coverMap[coverId];
      legendData.push(coverName);
      const data = this.historicalMapbiomasInformation[coverId].map((value) => (value / 10000).toFixed(2));
      // minValue = Math.min(minValue, Math.floor(Math.min(...data) / this.yInterval) * this.yInterval);
      // maxValue = Math.max(maxValue, Math.ceil(Math.max(...data) / this.yInterval) * this.yInterval);
      this.data.push({
        type: 'line',
        smooth: true,
        emphasis: {
          itemStyle: {
            shadowBlur: 20,
            shadowColor: 'rgba(0, 0, 0, 0.8)',
          },
        },
        name: coverName,
        large: true,
        data: data,
      });
    }

    this.updateOptions = {
      series: this.data,
      legend: {
        data: legendData,
      },
      // yAxis: {
      //   min: minValue,
      //   max: maxValue,
      // },
    };
    this.chartInstance.hideLoading();
  }
}
