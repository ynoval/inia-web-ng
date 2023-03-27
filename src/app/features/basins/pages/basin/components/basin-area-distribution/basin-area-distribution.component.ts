import { Component, Input, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
// import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-basin-area-info',
  templateUrl: './basin-area-distribution.component.html',
  styleUrls: ['./basin-area-distribution.component.scss'],
})
export class BasinAreaDistributionComponent implements OnInit {
  @Input() zoneInformation;

  zoneArea = 0;

  communitiesData = [];

  // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  communitiesChartInstance: any;

  communitiesChartOptions = {
    title: {
      text: 'Distribución del área.',
      subtext: 'Área total: ',
      left: 'left',
      subtextStyle: {
        fontWeight: 'bold',
      },
    },
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
    tooltip: {
      trigger: 'item',
      formatter: (params) => `${params.data.name} - ${params.data.value}%`,
    },
    legend: {
      orient: 'vertical',
      right: 'right',
      // bottom: 0,
    },
    // legend: {
    //   top: '5%',
    //   left: 'center',
    // },
    series: [
      {
        name: 'Areas',
        type: 'pie',
        radius: '50%',
        data: [],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  updateCommunitiesOptions: any;

  constructor(private router: Router, private ngZone: NgZone) {}

  ngOnInit() {
    this.processCommunityInformation();
    console.log({ info: this.zoneInformation });
  }

  processCommunityInformation() {
    let totalArea = 0;
    this.zoneArea = +this.zoneInformation.area;
    this.communitiesChartOptions.title.subtext = `Area Total: ${this.zoneArea} ha`;
    this.zoneInformation.communitiesAreas.forEach((c) => {
      const area = +c.area;
      totalArea += area;
      this.communitiesData.push({
        name: `comunidad ${c.order}`,
        value: ((100 * area) / this.zoneArea).toFixed(2),
        id: c.id,
      });
    });

    if (totalArea < this.zoneArea) {
      this.communitiesData.push({
        name: 'Otros usos del suelo',
        value: (100 - (100 * totalArea) / this.zoneArea).toFixed(2),
      });
    }

    console.log({ data: this.communitiesData });
    this.updateCommunitiesOptions = {
      series: {
        data: this.communitiesData,
      },
    };
  }

  onCommunitiesChartInit(ec) {
    console.log({ ec });
    this.communitiesChartInstance = ec;
    this.communitiesChartInstance.on('dblclick', ({ data }) => {
      if (data.id) {
        this.ngZone.run(() => this.router.navigate(['communities/', data.id]));
        return;
      }
    });
    this.communitiesChartInstance.on('click', ({ data }) => {
      if (data.id) {
        this.ngZone.run(() => this.router.navigate(['communities/', data.id]));
        return;
      }
    });
  }

  saveCSV() {
    const csvHeader = ['Comunidad', 'Área(ha)', 'Área(%)'];
    const csvData = [];
    this.communitiesData.forEach((community) => {
      console.log(community);
      csvData.push({
        comunidad: community.name,
        area: ((community.value * this.zoneArea) / 100).toFixed(2),
        area_percent: community.value,
      });
    });

    new AngularCsv(csvData, `${this.zoneInformation.name} Distribución del área por comunidades`, {
      headers: csvHeader,
    });
  }
}
