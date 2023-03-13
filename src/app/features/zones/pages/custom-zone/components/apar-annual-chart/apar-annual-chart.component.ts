import { Component, Input } from '@angular/core';
import { NotificationService } from '@app/common/components/notification/notification.service';
import { ZoneModel } from '@app/common/models/zone.model';
import { ZonesService } from '@app/common/services/zones.service';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-apar-annual-chart',
  templateUrl: './apar-annual-chart.component.html',
  styleUrls: ['./apar-annual-chart.component.scss'],
})
export class APARAnnualChartComponent {
  @Input() zone: ZoneModel;

  chartOptions: EChartsOption = {
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
      },
      axisLabel: {
        interval: 0,
        rotate: 30, //If the label names are too long you can manage this by rotating the label.
      },
    },
    yAxis: {
      type: 'value',
      name: 'APAR (MJ/m2 por dia)',
      nameLocation: 'middle',
      nameTextStyle: {
        padding: 30,
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
      right: '12%',
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

  constructor(private zonesService: ZonesService, private notificationService: NotificationService) {}

  onChartInit(ec) {
    if (!this.chartInstance) {
      this.chartInstance = ec;
      this.chartInstance.on('legendselectchanged', async (params) => {
        if (params.name === 'Media') {
          return;
        }
        const year = +params.name.split('-')[0].trim();
        const index = this.data.findIndex((val) => +val.name.split('-')[0].trim() === year);
        if (this.data[index].data.length === 0) {
          this.chartInstance.showLoading({ text: 'Cargando datos...' });
          const result = await this.zonesService.getZoneAnnualAPAR(this.zone.id, year);
          this.zoneAPARInformation.annualAPAR.push(result);
          this.data[index].data = result.values.map((value) => value.apar);
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
    console.log('save CSV');
  }

  // TODO: Refactoring
  private async load() {
    const notification = this.notificationService.showAction('Cargando información de APAR');
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
      data: this.zoneAPARInformation.annualAPARMean.values.map((value) => value.apar),
      endLabel: {
        show: true,
      },
    });

    legendData.push('Media');
    const selectedYears: any = {
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
      selectedYears[`${i} - ${i + 1}`] = false;
    }
    this.zoneAPARInformation.annualAPAR.forEach((apar) => {
      const index = this.data.findIndex((value) => value.name === `${apar.year} - ${apar.year + 1}`);
      this.data[index].data = apar.values.map((value) => value?.apar);
      selectedYears[`${apar.year} - ${apar.year + 1}`] = true;
    });

    this.data.push({
      name: 'L',
      type: 'line',
      data: this.zoneAPARInformation.annualAPARMean.values.map((value) => value.apar - value.apar / 2),
      lineStyle: {
        opacity: 0,
      },
      stack: 'confidence-band',
      symbol: 'none',
    });
    this.data.push({
      name: 'U',
      type: 'line',
      data: this.zoneAPARInformation.annualAPARMean.values.map((value) => 2 * (value.apar / 2)),
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
        selected: selectedYears,
      },
    };
    notification.dismiss();
  }
}
