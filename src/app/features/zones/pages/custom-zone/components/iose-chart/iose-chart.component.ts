import { Component, Input } from '@angular/core';
import { NotificationService } from '@app/common/components/notification/notification.service';
import { ZoneModel } from '@app/common/models/zone.model';
import { ZonesService } from '@app/common/services/zones.service';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-iose-chart',
  templateUrl: './iose-chart.component.html',
  styleUrls: ['./iose-chart.component.scss'],
})
export class IOSEChartComponent {
  @Input() zone: ZoneModel;

  chartOptions: EChartsOption = {
    title: {
      text: 'IOSE',
      top: '2%',
      // left: '50%',
    },
    legend: {
      data: ['IOSE'],
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
      name: 'Años',
      nameLocation: 'middle',
      nameTextStyle: {
        padding: 20,
      },
      axisLabel: {
        interval: 0,
        rotate: 30,
      },
    },
    yAxis: {
      type: 'value',
      name: 'IOSE',
      nameLocation: 'middle',
      nameTextStyle: {
        padding: 30,
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

  option = {
    title: [
      {
        text: 'IOSE Histórica',
        left: 'center',
      },
      // {
      //   text: 'upper: Q3 + 1.5 * IQR \nlower: Q1 - 1.5 * IQR',
      //   borderColor: '#999',
      //   borderWidth: 1,
      //   textStyle: {
      //     fontWeight: 'normal',
      //     fontSize: 14,
      //     lineHeight: 20,
      //   },
      //   left: '10%',
      //   top: '90%',
      // },
    ],
    dataset: [
      {
        source: [
          [0.8740109459521498, 0.7642973295806322, 0.5066020520455362, 0.783177660141265],
          [0.8609276702926325, 0.7551237404394245, 0.5131693703087455, 0.7558326560123171],
          [0.8681674808451808, 0.7380826954495475, 0.4837841822508205, 0.7480186045725054],
          [0.848759100268129, 0.7003254197261125, 0.48209410519044493, 0.6933773221976856],
          [0.8652308369423193, 0.6857094230018199, 0.47985784730298353, 0.7050737204327203],
          [0.8432803886530564, 0.618947121345577, 0.4277622418639012, 0.6230346157846552],
          [0.8613560454326382, 0.7136373608980505, 0.4537471492969331, 0.7402669736060197],
          [0.8610680165895076, 0.6416919395728452, 0.4561577450672003, 0.6386193848723237],
          [0.8421260960437237, 0.609085001608825, 0.4477336289714975, 0.5996830473623369],
          [0.8500388676514695, 0.7471157469515458, 0.4473387764135599, 0.7636943395068461],
          [0.8464545721663803, 0.6370249038794065, 0.4829352180228553, 0.6386467651556347],
          [0.8415218978488677, 0.6847332878885606, 0.40659856628817387, 0.6933437921728064],
          [0.8576119704552032, 0.7327561052379797, 0.39114758590086696, 0.712956923924702],
          [0.8583561890489577, 0.712568095672681, 0.3109500365389148, 0.7168476800579672],
          [0.8897581961784403, 0.7406351683857952, 0.36442112045886776, 0.7480283464985228],
          [0.858490987133828, 0.7132166793319189, 0.2820057802103224, 0.7324212261803625],
          [0.885727617571593, 0.7367908772257832, 0.3619924893619805, 0.7441566964040001],
          [0.8716064714762741, 0.6826516062051964, 0.3464742881888338, 0.6308444038292468],
          [0.8833293259303406, 0.7531765134739594, 0.31384666776584713, 0.763716913336468],
          [0.8765173145812705, 0.7124210396513531, 0.3327714589134487, 0.7011467116917328],
          [0.8719502751997458, 0.7271659753263033, 0.38983763002818755, 0.7129306117204637],
          [0.861641256560031, 0.6747372822578508, 0.35366812643588014, 0.6425964493934638],
        ],
      },
      {
        transform: {
          type: 'boxplot',
          config: {
            itemNameFormatter: function (params) {
              return 2000 + params.value;
            },
          },
        },
      },
      {
        fromDatasetIndex: 1,
        fromTransformResult: 1,
      },
    ],
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%',
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      nameGap: 30,
      splitArea: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      // data: this.getAbscissaAxisData(),
      name: 'Años',
      nameLocation: 'middle',
      nameTextStyle: {
        padding: 20,
      },
      axisLabel: {
        interval: 0,
        rotate: 30,
      },
    },
    yAxis: {
      type: 'value',
      name: 'IOSE',
      splitArea: {
        show: true,
      },
    },
    series: [
      {
        name: 'IOSE',
        type: 'boxplot',
        datasetIndex: 1,
      },
      {
        name: 'outlier',
        type: 'scatter',
        datasetIndex: 2,
      },
    ],
  };

  chartInstance: any;

  updateOptions: any;

  data = [];

  historicalIOSEInformation: any;

  constructor(private zonesService: ZonesService, private notificationService: NotificationService) {}

  onChartInit(ec) {
    if (!this.chartInstance) {
      this.chartInstance = ec;
      // this.load();
    }
  }

  //Generate a list of years from 2000 to the last completed productive year
  // 2000 ... 2021
  getAbscissaAxisData() {
    const startYear = 2000;
    const currentDate = new Date();
    const lastYear = currentDate.getMonth() > 5 ? currentDate.getFullYear() - 1 : currentDate.getFullYear() - 2;
    const amount = lastYear - startYear + 1;
    const years = Array(amount)
      .fill(0, 0, amount)
      .map((_, i) => (i + startYear).toString());
    console.log({ years });
    return years;
  }

  saveCSV() {
    console.log('save CSV');
  }

  private async load() {
    const notification = this.notificationService.showAction('Cargando información de IOSE histórica');
    const legendData = [];
    this.historicalIOSEInformation = await this.zonesService.getZoneHistoricalIOSE(this.zone.id);
    this.data.push({
      type: 'line',
      smooth: true,
      emphasis: {
        itemStyle: {
          shadowBlur: 20,
          shadowColor: 'rgba(0, 0, 0, 0.8)',
        },
      },
      name: 'IOSE Histórica',
      large: true,
      data: this.historicalIOSEInformation.map((value) => value.iose),
      markLine: {
        data: [
          {
            name: 'media histórica',
            type: 'average',
          },
        ],
      },
      endLabel: {
        show: true,
      },
    });
    legendData.push('IOSE Histórica');

    this.updateOptions = {
      series: this.data,
      legend: {
        data: legendData,
      },
    };
    notification.dismiss();
  }
}
