import { Component, Input } from '@angular/core';
import { NotificationService } from '@app/common/components/notification/notification.service';
import { ZoneModel } from '@app/common/models/zone.model';
import { ZonesService } from '@app/common/services/zones.service';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-basin-apar-annual-chart',
  templateUrl: './basin-apar-annual-chart.component.html',
  styleUrls: ['./basin-apar-annual-chart.component.scss'],
})
export class BasinAPARAnnualChartComponent {
  @Input() zone: ZoneModel;

  chartOptions: EChartsOption = {
    grid: {
      left: '5%',
      right: '10%',
      bottom: '25%',
    },
    title: {
      text: 'Radiación absorbida Anual',
      top: '2%',
      // left: '50%',
    },
    legend: {
      data: [],
      orient: 'vertical',
      align: 'right',
      type: 'scroll',
      right: 0,
      top: 20,
      bottom: 20,
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: this.getAbscissaAxisData(),
      name: 'Meses',
      nameLocation: 'middle',
      nameTextStyle: {
        padding: 20,
        fontWeight: 'bold',
      },
      axisLabel: {
        interval: 0,
        rotate: 30,
      },
    },
    yAxis: {
      type: 'value',
      name: 'APAR (MJ/m2 por dia)',
      nameLocation: 'middle',
      nameTextStyle: {
        padding: 30,
        fontWeight: 'bold',
      },
    },
    // visualMap: {
    //   show: false,
    //   seriesIndex: 1,
    //   dimension: 0,
    //   pieces: [
    //     { lt: 5, color: '#096' },
    //     {
    //       gt: this.startPredictionMonth,
    //       lte: this.endPredictionMonth,
    //     },
    //   ],
    // },
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

  zoneAPARInformation: any;

  selectedYears: any;

  constructor(private zonesService: ZonesService, private notificationService: NotificationService) {}

  onChartInit(ec) {
    if (!this.chartInstance) {
      this.chartInstance = ec;
      this.chartInstance.on('legendselectchanged', async (params) => {
        if (params.name !== 'Media') {
          const year = +params.name.split('-')[0].trim();
          const index = this.data.findIndex((val) => +val.name.split('-')[0].trim() === year);
          if (this.data[index].data.length === 0) {
            this.chartInstance.showLoading({ text: 'Cargando datos...' });
            const result = await this.zonesService.getZoneAnnualAPAR(this.zone.id, year);
            this.zoneAPARInformation.annualAPAR.push(result);
            this.data[index].data = result.values.map((value) => value.apar / 16);
            this.data[index].emphasis = {
              itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' },
            };
            this.chartInstance.hideLoading();
          }

          this.updateOptions = {
            series: this.data,
            legend: { ...this.updateOptions.legend, selected: params.selected },
          };
          this.chartInstance.setOption({ ...this.chartOptions, ...this.updateOptions });
        }
        this.selectedYears[params.name] = !this.selectedYears[params.name];
      });
      this.load();
    }
  }

  getAbscissaAxisData() {
    return [
      'Jul 12',
      'Jul 28',
      'Ago 13',
      'Ago 29',
      'Sep 14',
      'Sep 30',
      'Oct 16',
      'Nov 1',
      'Nov 17',
      'Dic 3',
      'Dic 19',
      'Ene 1',
      'Ene 17',
      'Feb 2',
      'Feb 18',
      'Mar 6',
      'Mar 22',
      'Abr 7',
      'Abr 23',
      'May 9',
      'May 25',
      'Jun 10',
      'Jun 26',
    ];
  }

  saveCSV() {
    const csvHeader = ['AÑO', ...this.getAbscissaAxisData()];
    const csvData = [];
    const years = Object.keys(this.selectedYears)
      .filter((key) => this.selectedYears[key])
      .map((key) => {
        return key === 'Media' ? 'Media' : key.split('-')[0].trim();
      });

    years.forEach((year) => {
      let csvRow = [];
      if (year === 'Media') {
        csvRow.push('Media');
        csvRow.push(...this.zoneAPARInformation.annualAPARMean.values.map((value) => (value ? value.apar : '')));
      } else {
        const annualAPAR = this.zoneAPARInformation.annualAPAR.find((x) => x.year === +year);
        if (annualAPAR) {
          csvRow.push(`${annualAPAR.year} - ${annualAPAR.year + 1}`);
          csvRow.push(...annualAPAR.values.map((value) => (value ? value.apar : '')));
        }
      }
      csvData.push(csvRow);
    });
    console.log('Cuenca: ', { zone: this.zone });
    new AngularCsv(csvData, `${this.zone.name} Radiación Absorbida Anual`, { headers: csvHeader });
  }

  // TODO: Refactoring
  private async load() {
    this.chartInstance.showLoading({ text: 'Cargando datos...' });
    const currentDate = new Date();
    const lastYear = currentDate.getMonth() >= 6 ? currentDate.getFullYear() : currentDate.getFullYear() - 1;

    this.zoneAPARInformation = {
      annualAPARMean: await this.zonesService.getZoneAnnualAPARMean(this.zone.id),
      annualAPAR: [await this.zonesService.getZoneAnnualAPAR(this.zone.id, lastYear)],
    };

    this.data = [];
    const legendData = [];
    this.data.push({
      type: 'line',
      smooth: true,
      emphasis: {
        itemStyle: {
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.8)',
        },
      },
      name: 'Media',
      large: true,
      data: this.zoneAPARInformation.annualAPARMean.values.map((value) => value.apar / 16),
    });

    legendData.push('Media');
    this.selectedYears = {
      Media: true,
    };
    const startedDataYear = 2001; // TODO: FIX GET from config

    for (let i = lastYear; i >= startedDataYear; i -= 1) {
      this.data.push({
        type: 'line',
        smooth: true,
        name: `${i} - ${i + 1}`,
        large: true,
        data: [],
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' },
        },
      });
      legendData.push(`${i} - ${i + 1}`);
      this.selectedYears[`${i} - ${i + 1}`] = false;
    }
    this.zoneAPARInformation.annualAPAR.forEach((apar) => {
      const index = this.data.findIndex((value) => value.name === `${apar.year} - ${apar.year + 1}`);
      this.data[index].data = apar.values.map((value) => value?.apar / 16);
      this.selectedYears[`${apar.year} - ${apar.year + 1}`] = true;
    });

    this.data.push({
      name: 'L',
      type: 'line',
      data: this.zoneAPARInformation.annualAPARMean.values.map((value) => value.apar / 16 - value.apar / 16 / 2),
      lineStyle: {
        opacity: 0,
      },
      stack: 'confidence-band',
      symbol: 'none',
    });
    this.data.push({
      name: 'U',
      type: 'line',
      data: this.zoneAPARInformation.annualAPARMean.values.map((value) => 2 * (value.apar / 16 / 2)),
      lineStyle: {
        opacity: 0,
      },
      areaStyle: {
        color: '#f7eed2',
      },
      stack: 'confidence-band',
      symbol: 'none',
    });
    this.updateOptions = {
      series: this.data,
      legend: {
        data: legendData,
        selected: this.selectedYears,
      },
    };
    this.chartInstance.hideLoading();
  }
}
