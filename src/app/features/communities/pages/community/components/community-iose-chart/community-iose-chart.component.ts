import { Component, Input } from '@angular/core';
import { CommunitiesService } from '@app/common/services/communities.service';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-community-iose-chart',
  templateUrl: './community-iose-chart.component.html',
  styleUrls: ['./community-iose-chart.component.scss'],
})
export class CommunityIOSEChartComponent {
  @Input() communityId: string;

  dimensions = ['Año', 'Media', 'Desviación estándar', 'Nombre'];

  data = [];

  renderItem(
    params: echarts.CustomSeriesRenderItemParams,
    api: echarts.CustomSeriesRenderItemAPI
  ): echarts.CustomSeriesRenderItemReturn {
    const group: echarts.CustomSeriesRenderItemReturn = {
      type: 'group',
      children: [],
    };

    const encode = params.encode;
    const xBaseValue = api.value(encode.x[0]) as number;
    const yBaseValue = api.value(encode.y[0]) as number;
    const desEstValue = api.value(encode.y[1]) as number;

    const highPoint = api.coord([xBaseValue, yBaseValue + desEstValue]);
    const lowPoint = api.coord([xBaseValue, yBaseValue - desEstValue]);

    let halfWidth = 5;
    // TODO: FIX style is deprecated
    // var style = api.style({
    //   stroke: api.visual('color'),
    //   fill: undefined,
    // });
    group.children.push(
      {
        type: 'line',
        transition: ['shape'],
        shape: {
          x1: highPoint[0] - halfWidth,
          y1: highPoint[1],
          x2: highPoint[0] + halfWidth,
          y2: highPoint[1],
        },
        // style: style,
      },
      {
        type: 'line',
        transition: ['shape'],
        shape: {
          x1: highPoint[0],
          y1: highPoint[1],
          x2: lowPoint[0],
          y2: lowPoint[1],
        },
        // style: style,
      },
      {
        type: 'line',
        transition: ['shape'],
        shape: {
          x1: lowPoint[0] - halfWidth,
          y1: lowPoint[1],
          x2: lowPoint[0] + halfWidth,
          y2: lowPoint[1],
        },
        // style: style,
      }
    );

    return group;
  }

  chartOptions: EChartsOption = {
    tooltip: {},
    title: {
      text: 'IOSE Histórico',
      top: '2%',
      // left: '50%',
    },
    legend: {
      data: ['IOSE', 'Desviación Estándar'],
      orient: 'vertical',
      align: 'right',
      right: 10,
      backgroundColor: 'rgb(238,238,238)',
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
    grid: {
      left: '2%',
      right: '3%',
      bottom: '15%',
      show: true,
      borderWidth: 0,
      backgroundColor: '#f4f4f4',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      name: 'Años',
      nameLocation: 'middle',
      nameTextStyle: {
        padding: 30,
        fontWeight: 'bold',
      },
      axisLabel: {
        rotate: 30,
        formatter: function (value) {
          return `${value} - ${parseInt(value) + 1}`;
        },
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
      name: 'IOSE',
      nameLocation: 'middle',
      nameTextStyle: {
        padding: 20,
        fontWeight: 'bold',
      },
      max: 1,
      min: 0.5,
    },

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

  //  data = [];

  historicalIOSEInformation: any;

  constructor(private communitiesService: CommunitiesService) {}

  onChartInit(ec) {
    if (!this.chartInstance) {
      this.chartInstance = ec;
      this.load();
    }
  }

  saveCSV() {
    const csvHeader = ['Info', ...this.historicalIOSEInformation.map((d) => `${d.year} - ${+d.year + 1}`)];
    const csvData = [['IOSE (Des Est.)', ...this.historicalIOSEInformation.map((d) => `${d.iose} (± ${d.stdDev})`)]];
    new AngularCsv(csvData, `${this.communityId} IOSE Histórica`, { headers: csvHeader });
  }

  private async load() {
    this.chartInstance.showLoading({ text: 'Cargando datos...' });

    this.historicalIOSEInformation = await this.communitiesService.getHistoricalIOSE(this.communityId);

    this.data = this.historicalIOSEInformation.map((value) => {
      return [parseInt(value.year), value.iose, value.stdDev, `${value.year} - ${parseInt(value.year) + 1}`];
    });

    this.updateOptions = {
      series: [
        {
          type: 'scatter',
          name: 'IOSE',
          data: this.data,
          dimensions: this.dimensions,
          encode: {
            x: 0,
            y: 1,
            tooltip: [1, 2],
            itemName: 3,
          },
          itemStyle: {
            color: '#77bef7',
          },
           markLine: {
            data: [
              {
                name: 'media histórica',
                type: 'average',
              },
            ],
          },
          z: 100,
        },
        {
          type: 'custom',
          name: 'Desviación Estándar',
          renderItem: this.renderItem,
          dimensions: this.dimensions,
          tooltip: {
            show: false,
          },
          encode: {
            x: [0],
            y: [1, 2],
          },
          data: this.data,
          z: 10,
        },
      ],
    };

    this.chartInstance.hideLoading();
  }
}
