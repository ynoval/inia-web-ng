import { Component, Input } from '@angular/core';
import { NotificationService } from '@app/common/components/notification/notification.service';
import { ZoneModel } from '@app/common/models/zone.model';
import { ZonesService } from '@app/common/services/zones.service';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import EChartsOption  from 'echarts';

@Component({
  selector: 'app-et-annual-chart',
  templateUrl: './evapotranspiration-annual-chart.component.html',
  styleUrls: ['./evapotranspiration-annual-chart.component.scss'],
})
export class EvapotranspirationAnnualChartComponent {
  @Input() zone: ZoneModel;

  chartOptions: EChartsOption.EChartsOption = {
    grid: {
      left: '5%',
      right: '10%',
      bottom: '25%',
    },
    title: {
      text: 'Evapotranspiración Anual',
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
        interval: 1,
        rotate: 30, //If the label names are too long you can manage this by rotating the label.
      },
      // axisTick: {
      //   alignWithLabel: true,
      //   interval: 'auto',
      // },
    },
    yAxis: {
      type: 'value',
      name: 'ET (mm/día)',
      nameLocation: 'middle',
      nameTextStyle: {
        padding: 30,
        fontWeight: 'bold',
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

  zoneInformation: any;

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
            const result = await this.zonesService.getZoneAnnualET(this.zone.id, year);
            this.zoneInformation.annual.push(result);
            this.data[index].data = result.values.map((value) => value.et);
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
      'Jul 4',
      'Jul 12',
      'Jul 20',
      'Jul 28',
      'Ago 5',
      'Ago 13',
      'Ago 21',
      'Ago 29',
      'Sep 6',
      'Sep 14',
      'Sep 22',
      'Sep 30',
      'Oct 8',
      'Oct 16',
      'Oct 24',
      'Nov 1',
      'Nov 9',
      'Nov 17',
      'Nov 25',
      'Dic 3',
      'Dic 11',
      'Dic 19',
      'Dic 27',
      'Ene 1',
      'Ene 9',
      'Ene 17',
      'Ene 25',
      'Feb 2',
      'Feb 10',
      'Feb 18',
      'Feb 26',
      'Mar 6',
      'Mar 14',
      'Mar 22',
      'Mar 30',
      'Abr 7',
      'Abr 15',
      'Abr 23',
      'May 1',
      'May 9',
      'May 17',
      'May 25',
      'Jun 2',
      'Jun 10',
      'Jun 18',
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
        csvRow.push(...this.zoneInformation.annualMean.values.map((value) => (value ? value.et : '')));
      } else {
        const annualData = this.zoneInformation.annual.find((x) => x.year === +year);
        if (annualData) {
          csvRow.push(`${annualData.year} - ${annualData.year + 1}`);
          csvRow.push(...annualData.values.map((value) => (value ? value.et : '')));
        }
      }
      csvData.push(csvRow);
    });
    new AngularCsv(csvData, `${this.zone.name} Evapotranspiración Anual`, { headers: csvHeader });
  }

  // TODO: Refactoring
  private async load() {
    this.chartInstance.showLoading({ text: 'Cargando datos...' });
    const currentDate = new Date();
    const lastYear = currentDate.getMonth() >= 6 ? currentDate.getFullYear() : currentDate.getFullYear() - 1;

    this.zoneInformation = {
      annual: [await this.zonesService.getZoneAnnualET(this.zone.id, lastYear)],
      annualMean: await this.zonesService.getZoneAnnualETMean(this.zone.id),
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
      data: this.zoneInformation.annualMean.values.map((value) => value.et),
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

    this.zoneInformation.annual.forEach((elem) => {
      const index = this.data.findIndex((value) => value.name === `${elem.year} - ${elem.year + 1}`);
      this.data[index].data = elem.values.map((value) => value?.et);
      this.selectedYears[`${elem.year} - ${elem.year + 1}`] = true;
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
