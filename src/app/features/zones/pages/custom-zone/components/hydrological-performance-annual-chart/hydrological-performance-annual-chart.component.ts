import { Component, Input } from '@angular/core';
import { NotificationService } from '@app/common/components/notification/notification.service';
import { ZoneModel } from '@app/common/models/zone.model';
import { ZonesService } from '@app/common/services/zones.service';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import EChartsOption  from 'echarts';

@Component({
  selector: 'app-rh-annual-chart',
  templateUrl: './hydrological-performance-annual-chart.component.html',
  styleUrls: ['./hydrological-performance-annual-chart.component.scss'],
})
export class HydrologicalPerformanceAnnualChartComponent {
  @Input() zone: ZoneModel;

  chartOptions: EChartsOption.EChartsOption = {
    grid: {
      left: '10%',
      right: '10%',
      bottom: '25%',
    },
    title: {
      text: 'Rendimiento Hidrológico Anual',
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
        rotate: 30, //If the label names are too long you can manage this by rotating the label.
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
      // {
      //   type: 'value',
      //   name: 'RH/PPT (%)',
      //   nameLocation: 'middle',
      //   nameTextStyle: {
      //     padding: 30,
      //   },
      //   min: 0,
      //   max: 100,
      // },
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
            const results = await this.getRHData(year);
            this.zoneInformation.annualRH.push(results);
            const values = results.values.map((item, pos) => {
              return { value: [pos, item.rh, item.rhProp] };
            });
            this.data[index].data = values;
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
      let csvRHRow = [];
      let csvRHPropRow = [];
      if (year === 'Media') {
        csvRHRow.push('RH Media');
        csvRHRow.push(...this.zoneInformation.annualRHMean.map((value) => (value ? value.rh : '')));
        csvRHPropRow.push('RH/PPT Media');
        csvRHPropRow.push(...this.zoneInformation.annualRHMean.map((value) => (value ? value.rhProp : '')));
      } else {
        const annualData = this.zoneInformation.annualRH.find((x) => x.year === +year);
        if (annualData) {
          csvRHRow.push(`RH ${annualData.year} - ${annualData.year + 1}`);
          // csvRHRow.push(...annualData.values.map((value) => (value ? `${value.rh} (${value.rhProp})` : '')));
          csvRHRow.push(...annualData.values.map((value) => (value ? value.rh : '')));
          csvRHPropRow.push(`RH/PPT ${annualData.year} - ${annualData.year + 1}`);
          csvRHPropRow.push(...annualData.values.map((value) => (value ? value.rhProp : '')));
        }
      }
      csvData.push(csvRHRow, csvRHPropRow);
    });
    new AngularCsv(csvData, `${this.zone.name} Rendimiento Hidrológico Anual`, { headers: csvHeader });
  }

  private async getRHData(year) {
    const rhResults = await this.zonesService.getZoneAnnualRH(this.zone.id, year);
    const rhPropResults = await this.zonesService.getZoneAnnualRHProp(this.zone.id, year);

    const values = rhResults.values.map((value, index) => ({
      rh: value.rh,
      rhProp: rhPropResults.values[index].rhProp,
    }));
    return { year: rhResults.year, values };
  }

  private async getRHMeanData() {
    const rhMean = await this.zonesService.getZoneAnnualRHMean(this.zone.id);
    const rhPropMean = await this.zonesService.getZoneAnnualRHPropMean(this.zone.id);
    const values = rhMean.values.map((value, index) => ({ rh: value.rh, rhProp: rhPropMean.values[index].rhProp }));
    return values;
  }

  private async load() {
    this.chartInstance.showLoading({ text: 'Cargando datos...' });
    const currentDate = new Date();
    const lastYear = currentDate.getMonth() >= 6 ? currentDate.getFullYear() : currentDate.getFullYear() - 1;

    const result = await this.getRHData(lastYear);
    const resultMean = await this.getRHMeanData();

    this.zoneInformation = {
      annualRHMean: resultMean,
      annualRH: [result],
    };

    // this.zoneInformation.annualRH.push(result);

    this.data = [];
    const legendData = [];

    // Insert Media
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
      data: this.zoneInformation.annualRHMean.map((item, pos) => {
        return { value: [pos, item.rh, item.rhProp] };
      }),
      tooltip: {
        trigger: 'item',
        formatter: function (param) {
          var displayName = `${param.seriesName}`;
          var xAxisValue = param.name;
          var rh = param.value[1];
          var rhProp = param.value[2];
          var circleStyles = `"display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color:${param.color}; margin-right: 5px;"`;

          return `
              <p>
                <span style=${circleStyles}></span>
                <strong> ${displayName} </strong>
              </p>
              <p>
                <em>${xAxisValue}</em>
              </p>
                <p>
                  <strong>RH:</strong>
                  <span style="text-align: right;">${rh} mm </span>
                </p>
                <p>
                  <strong>RH/PPT: </strong>
                  <span style="text-align: right;">${rhProp} % </span>
                </p>

              `;
        },
      },
      encode: {
        y: 1, // Show the 'RH' field as the value
        tooltip: [1, 2], // Show the 'RH/PPT' field only in the tooltip
      },
    });
    legendData.push('Media');
    this.selectedYears = {
      Media: true,
    };

    const startedDataYear = 2003; // TODO: FIX GET from config
    for (let i = lastYear; i >= startedDataYear; i -= 1) {
      this.data.push({
        type: 'line',
        smooth: true,
        name: `${i} - ${i + 1}`,
        large: true,
        data: [],
        tooltip: {
          trigger: 'item',
          formatter: function (param) {
            var displayName = `${param.seriesName}`;
            var xAxisValue = param.name;
            var rh = param.value[1];
            var rhProp = param.value[2];
            var circleStyles = `"display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color:${param.color}; margin-right: 5px;"`;

            return `
              <p>
                <span style=${circleStyles}></span>
                <strong> ${displayName} </strong>
              </p>
              <p>
                <em>${xAxisValue}</em>
              </p>
                <p>
                  <strong>RH:</strong>
                  <span style="text-align: right;">${rh} mm </span>
                </p>
                <p>
                  <strong>RH/PPT: </strong>
                  <span style="text-align: right;">${rhProp} % </span>
                </p>

              `;
          },
        },
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' },
        },
        encode: {
          y: 1, // Show the 'RH' field as the value
          tooltip: [1, 2], // Show the 'RH/PPT' field only in the tooltip
        },
      });
      legendData.push(`${i} - ${i + 1}`);
      this.selectedYears[`${i} - ${i + 1}`] = false;
    }

    this.zoneInformation.annualRH.forEach((d) => {
      const index = this.data.findIndex((value) => value.name === `${d.year} - ${d.year + 1}`);
      const values = d.values.map((item, pos) => {
        return { value: [pos, item.rh, item.rhProp] };
      });
      this.data[index].data = values;
      this.selectedYears[`${d.year} - ${d.year + 1}`] = true;
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
