import { Component, Input } from '@angular/core';
import { NotificationService } from '@app/common/components/notification/notification.service';
import { ZoneModel } from '@app/common/models/zone.model';
import { ZonesService } from '@app/common/services/zones.service';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-iose-chart',
  templateUrl: './iose-chart.component.html',
  styleUrls: ['./iose-chart.component.scss'],
})
export class IOSEChartComponent {
  @Input() zone: ZoneModel;

  dimensions = ['Año', 'Media', 'Desviación estándar', 'Nombre'];

  data = [];
  // [
  //   [2000, 0.748039770832004, 0.03256465678882184, '2000-2001'],
  //   [2001, 0.763695289564798, 0.03346213519940505],
  //   [2002, 0.7559004683729068, 0.036920905977168614],
  //   [2003, 0.7246005000728338, 0.033355497912705236],
  //   [2004, 0.7050854376039816, 0.03224198378466213],
  //   [2005, 0.6698614803698208, 0.036968676857193516],
  //   [2006, 0.7480610830344175, 0.033616442602547286],
  //   [2007, 0.6504021435494565, 0.03597376489202562],
  //   [2008, 0.6270194730869351, 0.03491400907724701],
  //   [2009, 0.751972012019186, 0.029124208667576774],
  //   [2010, 0.6513895022520513, 0.030711598288477655],
  //   [2011, 0.7002054193554768, 0.0286010941311772],
  //   [2012, 0.7402352386853258, 0.030722501639679194],
  //   [2013, 0.7246522235735148, 0.0340420416427791],
  //   [2014, 0.7519288231430243, 0.03190581764553141],
  //   [2015, 0.7363397986225245, 0.03532938639151732],
  //   [2016, 0.7324377380609438, 0.03411544645858529],
  //   [2017, 0.7089686027808928, 0.04209356528416233],
  //   [2018, 0.7675879169110649, 0.03313937734544379],
  //   [2019, 0.6933284410426139, 0.034697758770264764],
  //   [2020, 0.744150745662676, 0.031245802146515816],
  //   [2021, 0.6581899738514433, 0.03558705664053226],
  // ];

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
      right: '1%',
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

  constructor(private zonesService: ZonesService, private notificationService: NotificationService) {}

  onChartInit(ec) {
    if (!this.chartInstance) {
      this.chartInstance = ec;
      this.load();
    }
  }

  saveCSV() {
    console.log('IOSE CSV');
    const csvHeader = ['Info', ...this.historicalIOSEInformation.map((d) => `${d.year} - ${+d.year + 1}`)];
    const csvData = [['IOSE (Des Est.)', ...this.historicalIOSEInformation.map((d) => `${d.iose} (± ${d.stdDev})`)]];
    new AngularCsv(csvData, `${this.zone.name} IOSE Histórica`, { headers: csvHeader });
  }

  private async load() {
    const notification = this.notificationService.showAction('Cargando información de IOSE histórica');

    this.historicalIOSEInformation = await this.zonesService.getZoneHistoricalIOSE(this.zone.id);

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

    notification.dismiss();
  }
}
