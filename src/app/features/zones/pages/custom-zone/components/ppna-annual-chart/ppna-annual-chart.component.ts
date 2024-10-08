import { Component, Input } from '@angular/core';
import { NotificationService } from '@app/common/components/notification/notification.service';
import { ZoneModel } from '@app/common/models/zone.model';
import { ZonesService } from '@app/common/services/zones.service';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import  EChartsOption  from 'echarts';

@Component({
  selector: 'app-ppna-annual-chart',
  templateUrl: './ppna-annual-chart.component.html',
  styleUrls: ['./ppna-annual-chart.component.scss'],
})
export class PPNAAnnualChartComponent {
  @Input() zone: ZoneModel;

  chartOptions: EChartsOption.EChartsOption = {
    grid: {
      left: '5%',
      right: '10%',
      bottom: '25%',
    },
    title: {
      text: 'Productividad Anual',
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
      name: 'PPNA (kg MS/ha por día)',
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

  zonePPNAInformation: any;

  selectedYears: any;

  constructor(private zonesService: ZonesService, private notificationService: NotificationService) {}

  onChartInit(ec) {
    if (!this.chartInstance) {
      this.chartInstance = ec;
      this.chartInstance.on('legendselectchanged', async (params) => {
        if (params.name === 'Media') {
          this.selectedYears.Media = !this.selectedYears.Media;
          return;
        }
        const year = +params.name.split('-')[0].trim();
        const index = this.data.findIndex((val) => +val.name.split('-')[0].trim() === year);
        if (this.data[index].data.length === 0) {
          this.chartInstance.showLoading({ text: 'Cargando datos...' });
          const result = await this.zonesService.getZoneAnnualPPNA(this.zone.id, year);
          this.zonePPNAInformation.annualPPNA.push(result);
          this.data[index].data = result.values.map((value) => (+value.ppna / 16).toFixed(2));
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
        const key = `${year} - ${year + 1}`;
        this.selectedYears[key] = !this.selectedYears[key];
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
        csvRow.push(...this.zonePPNAInformation.annualPPNAMean.values.map((value) => (value ? value.ppna : '')));
      } else {
        const annualPPNA = this.zonePPNAInformation.annualPPNA.find((x) => x.year === +year);
        if (annualPPNA) {
          csvRow.push(`${annualPPNA.year} - ${annualPPNA.year + 1}`);
          csvRow.push(...annualPPNA.values.map((value) => (value ? value.ppna : '')));
        }
      }
      csvData.push(csvRow);
    });
    new AngularCsv(csvData, `${this.zone.name} Productividad Anual`, { headers: csvHeader });
  }

  // TODO: Refactoring
  private async load() {
    this.chartInstance.showLoading({ text: 'Cargando datos...' });
    const currentDate = new Date();
    const lastYear = currentDate.getMonth() >= 6 ? currentDate.getFullYear() : currentDate.getFullYear() - 1;

    this.zonePPNAInformation = {
      annualPPNAMean: await this.zonesService.getZoneAnnualPPNAMean(this.zone.id),
      annualPPNA: [await this.zonesService.getZoneAnnualPPNA(this.zone.id, lastYear)],
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
      data: this.zonePPNAInformation.annualPPNAMean.values.map((value) => value.ppna / 16),
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
    this.zonePPNAInformation.annualPPNA.forEach((ppna) => {
      const index = this.data.findIndex((value) => value.name === `${ppna.year} - ${ppna.year + 1}`);
      this.data[index].data = ppna.values.map((value) => value?.ppna / 16);
      this.selectedYears[`${ppna.year} - ${ppna.year + 1}`] = true;
    });

    this.data.push({
      name: 'L',
      type: 'line',
      data: this.zonePPNAInformation.annualPPNAMean.values.map((value) => value.ppna / 16 - value.ppna / 16 / 2),
      lineStyle: {
        opacity: 0,
      },
      stack: 'confidence-band',
      symbol: 'none',
    });
    this.data.push({
      name: 'U',
      type: 'line',
      data: this.zonePPNAInformation.annualPPNAMean.values.map((value) => 2 * (value.ppna / 16 / 2)),
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
