import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import EChartsOption  from 'echarts';
// import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { v4 as uuidv4 } from 'uuid';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { NotificationService } from '@app/common/components/notification/notification.service';
import { ZoneModel } from '@app/common/models/zone.model';
import { ZonesService } from '@app/common/services/zones.service';
import { from, Observable } from 'rxjs';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AppSettings } from '../../src/app/app.settings';
import { Settings } from '../../src/app/app.settings.model';
import { GridDeleteButtonRendererComponent } from './grid-delete-button';

@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.scss'],
})
export class ZonePageComponent implements OnInit {
  // modules = [ClientSideRowModelModule];

  public settings: Settings;

  id: string;

  zone: ZoneModel;

  zoneArea = 0;

  zoneInformation$: Observable<any>;

  zonePPNAInformation: any;

  selectedPPNAChart = 'ANNUAL_CHART';

  ppnaChartsTypes = [
    { id: 'ANNUAL_CHART', label: 'Análisis por año' },
    { id: 'HISTORICAL_CHART', label: 'Análisis Histórico' },
    // { id: 'MONTHLY_CHART', label: 'Análisis mensual' },
  ];

  selectedRHChart = 'ANNUAL_CHART';

  rhChartsTypes = [
    { id: 'ANNUAL_CHART', label: 'Análisis por año' },
    { id: 'HISTORICAL_CHART', label: 'Análisis Histórico' },
    { id: 'RH_PPT', label: 'RH/PPT' },
  ];

  selectedETChart = 'ANNUAL_CHART';

  etChartsTypes = [
    { id: 'ANNUAL_CHART', label: 'Análisis por año' },
    { id: 'HISTORICAL_CHART', label: 'Análisis Histórico' },
    // { id: 'MONTHLY_CHART', label: 'Análisis mensual' },
  ];

  // #region Annual Chart
  annualData = [];

  annualChartInstance: any;

  startPredictionMonth = (new Date().getMonth() + 5) % 12;

  endPredictionMonth = this.startPredictionMonth + 3;

  annualChartOptions: EChartsOption.EChartsOption = {
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
      data: this.getMonthsInfo(),
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
      name: 'PPNA (kg MS/ha por mes)',
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
            this.saveAnnualCSV();
          },
        },
      },
    },
  };

  updateAnnualOptions: any;
  // #endregion

  // #region Historical Chart
  historicalData = [];

  historicalChartInstance: any;

  historicalChartOptions: EChartsOption.EChartsOption = {
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
      right: 10,
      top: 20,
      bottom: 20,
      backgroundColor: 'rgb(238,238,238)',
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: this.getAvailableYears(),
      name: 'Años',
      nameLocation: 'middle',
      nameTextStyle: {
        padding: 20,
      },
    },
    yAxis: {
      type: 'value',
      name: 'PPNA (kg MS/ha por año)',
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
  };

  updateHistoricalOptions: any;

  // #endregion

  // #region monthly chart
  monthlyData = [];

  monthlyChartInstance: any;

  monthlyChartOptions: EChartsOption.EChartsOption = {
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
      right: 10,
      top: 20,
      bottom: 20,
      backgroundColor: 'rgb(238,238,238)',
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: [],
      name: 'Años',
      nameLocation: 'middle',
      nameTextStyle: {
        padding: 20,
      },
    },
    yAxis: {
      type: 'value',
      name: 'PPNA (kg MS/ha)',
      nameLocation: 'middle',
      nameTextStyle: {
        padding: 30,
      },
    },
    series: [],
  };

  updateMonthlyOptions: any;
  // #endregion

  // #region Communities Area distribution chart
  communitiesData = [];

  communitiesChartInstance: any;

  communitiesChartOptions = {
    title: {
      text: 'Distribución del área.',
      subtext: 'Área total: ',
      left: 'left',
    },
    toolbox: {
      itemSize: 24,
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
      left: 'left',
      bottom: 0,
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

  updateCommunitiesOptions: any;

  markerCommunityMessage: string = '';

  markerCommunityInfo = {
    message: '',
    id: '',
    order: '',
  };

  // #endregion

  // #region Zone Properties
  propertiesGridOptions = {
    columnDefs: [
      {
        headerName: 'Propiedad',
        field: 'propertyName',
        editable: true,
        valueSetter: (params) => {
          const { data } = params;
          const { field } = params.colDef;
          if (this.zone.properties.findIndex((val) => val[field] === params.newValue) === -1) {
            data[field] = params.newValue;
            params.api.applyTransaction({ update: [data] });
          }
          return false;
        },
      },
      { headerName: 'Valor', field: 'propertyValue', editable: true },
      {
        cellRenderer: 'gridDeleteButton',
        cellRendererParams: {
          onClick: this.deleteProperty.bind(this),
        },
      },
    ],
    getRowNodeId: (data) => data.id,
    overlayLoadingTemplate: 'cargando...',
    overlayNoRowsTemplate: 'no hay propiedades definidas',
  };

  propertiesGridFrameworkComponents: any;

  propertiesGridApi: any;
  // #endregion

  ppnaLoaded: boolean = false;

  constructor(
    public appSettings: AppSettings,
    private router: Router,
    private route: ActivatedRoute,
    private zonesService: ZonesService,
    private notificationService: NotificationService,
    private ngZone: NgZone
  ) {
    this.settings = this.appSettings.settings;
    this.propertiesGridFrameworkComponents = {
      gridDeleteButton: GridDeleteButtonRendererComponent,
    };
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.zonesService.getZone(this.id).then((zone) => {
      this.zone = zone;
      this.zone.properties = !this.zone.properties
        ? []
        : this.zone.properties.map((prop) => ({ ...prop, id: uuidv4() }));
      this.loadZoneInformation();
    });
  }

  private async loadZoneInformation() {
    const notification = this.notificationService.showAction('Cargando información sobre la zona');
    this.zoneInformation$ = from(this.zonesService.getZoneInformation(this.id));
    this.zoneInformation$.subscribe((zoneInformation) => {
      if (this.zone.type === 'marker') {
        if (zoneInformation.communitiesAreas && zoneInformation.communitiesAreas.length > 0) {
          this.markerCommunityInfo = {
            ...zoneInformation.communitiesAreas[0],
            message: `La ubicación pertenece a la comunidad ${zoneInformation.communitiesAreas[0].order}`,
          };
        } else {
          this.markerCommunityInfo = {
            id: '',
            order: '',
            message: 'La ubicación no pertenece a ninguna comunidad',
          };
        }
      } else {
        // #region Load communities data
        let totalArea = 0;
        this.zoneArea = +zoneInformation.area;
        this.communitiesChartOptions.title.subtext = `Area Total: ${this.zoneArea} ha`;
        zoneInformation.communitiesAreas.forEach((c) => {
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
        this.updateCommunitiesOptions = {
          series: {
            data: this.communitiesData,
          },
        };
      }
      notification.dismiss();
    });
  }

  onAnnualChartInit(ec) {
    this.annualChartInstance = ec;
    const notification = this.notificationService.showAction('inicializando chart');
    setTimeout(() => {
      notification.dismiss();
    }, 1000);
    this.annualChartInstance.on('legendselectchanged', async (params) => {
      if (params.name === 'Media') {
        return;
      }
      const year = +params.name.split('-')[0].trim();
      const index = this.annualData.findIndex((val) => +val.name.split('-')[0].trim() === year);
      if (this.annualData[index].data.length === 0) {
        this.annualChartInstance.showLoading({ text: 'Cargando datos...' });
        const result = await this.zonesService.getZoneAnnualPPNA(this.id, year);
        this.zonePPNAInformation.annualPPNA.push(result);
        this.annualData[index].data = result.values.map((value) => value.ppna);
        this.annualData[index].emphasis = {
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' },
        };
        this.annualChartInstance.hideLoading();
      }
      this.updateAnnualOptions = {
        series: this.annualData,
        legend: { ...this.updateAnnualOptions.legend, selected: params.selected },
      };
      this.annualChartInstance.setOption({ ...this.annualChartOptions, ...this.updateAnnualOptions });
    });
  }

  onHistoricalChartInit(ec) {
    this.historicalChartInstance = ec;
  }

  onMonthlyChartInit(ec) {
    this.monthlyChartInstance = ec;
  }

  onCommunitiesChartInit(ec) {
    this.communitiesChartInstance = ec;
    this.communitiesChartInstance.on('dblclick', ({ data }) => {
      if (data.id) {
        this.ngZone.run(() => this.router.navigate(['communities/community', data.id]));
        return;
      }
    });
    this.communitiesChartInstance.on('click', ({ data }) => {
      if (data.id) {
        this.ngZone.run(() => this.router.navigate(['communities/community', data.id]));
        return;
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private getAvailableYears() {
    const years = [];
    const currentDate = new Date();
    const lastYear = currentDate.getFullYear() - 1;
    // currentDate.getMonth() !== 0 || currentDate.getDate() > 20
    //   ? currentDate.getFullYear()
    //   : currentDate.getFullYear() - 1;
    const firstYear = 2001; // TODO: FIX Get from Config
    for (let i = firstYear; i <= lastYear; i += 1) {
      years.push(i);
    }
    return years;
  }

  async changePPNAChart() {
    if (this.selectedPPNAChart === 'HISTORICAL_CHART') {
      if (!this.zonePPNAInformation.historicalPPNA) {
        const legendData = [];
        const notification = this.notificationService.showAction('Cargando información de productividad histórica');
        this.zonePPNAInformation.historicalPPNA = await this.zonesService.getZoneHistoricalPPNA(this.id);
        this.historicalData.push({
          type: 'line',
          smooth: true,
          emphasis: {
            itemStyle: {
              shadowBlur: 20,
              shadowColor: 'rgba(0, 0, 0, 0.8)',
            },
          },
          name: 'Productividad Histórica',
          large: true,
          data: this.zonePPNAInformation.historicalPPNA.map((value) => (12 * value.ppna).toFixed(2)),
          markLine: {
            data: [
              {
                name: 'media histórica',
                type: 'average',
              },
            ],
          },
        });
        legendData.push('Productividad Histórica');
        this.updateHistoricalOptions = {
          series: this.historicalData,
          legend: {
            data: legendData,
          },
        };
        notification.dismiss();
      }
    }
  }

  async changeRHChart() {
    let message = '';
    switch (this.selectedRHChart) {
      case 'HISTORICAL_CHART': {
        message = 'Cargando información histórica.';
        break;
      }
      case 'ANNUAL_CHART': {
        message = 'Cargando información anual';
        break;
      }
      case 'RH_PPT': {
        message = 'Cargando información de RH/PPT';
      }
    }

    const notification = this.notificationService.showAction(message);
    setTimeout(() => notification.dismiss(), 500);
  }

  async changeETChart() {
    let message = '';
    switch (this.selectedETChart) {
      case 'HISTORICAL_CHART': {
        message = 'Cargando información histórica.';
        break;
      }
      case 'ANNUAL_CHART': {
        message = 'Cargando información anual';
        break;
      }
    }

    const notification = this.notificationService.showAction(message);
    setTimeout(() => notification.dismiss(), 500);
  }

  private addProperty() {
    this.propertiesGridApi.applyTransaction({
      add: [{ id: uuidv4(), propertyName: '', propertyValue: '' }],
      addIndex: 0,
    });
  }

  private deleteProperty(property) {
    this.propertiesGridApi.applyTransaction({ remove: [{ id: property.data.id }] });
  }

  private onPropertiesGridReady(params) {
    this.propertiesGridApi = params.api;
  }

  private tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.index === 1 && !this.ppnaLoaded) {
      this.loadPPNA().then(() => {
        this.ppnaLoaded = true;
      });
    }
  }

  private async loadPPNA() {
    const notification = this.notificationService.showAction('Cargando información de productividad');
    const currentDate = new Date();
    const lastYear = currentDate.getMonth() >= 6 ? currentDate.getFullYear() : currentDate.getFullYear() - 1;

    this.zonePPNAInformation = {
      annualPPNAMean: await this.zonesService.getZoneAnnualPPNAMean(this.id),
      annualPPNA: [await this.zonesService.getZoneAnnualPPNA(this.id, lastYear)],
    };

    this.annualData = [];
    const legendData = [];
    this.annualData.push({
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
      data: this.zonePPNAInformation.annualPPNAMean.values.map((value) => value.ppna),
    });

    legendData.push('Media');
    const selectedYears: any = {
      Media: true,
    };
    const startedDataYear = 2001; // TODO: FIX GET from config

    for (let i = lastYear; i >= startedDataYear; i -= 1) {
      this.annualData.push({
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
    this.zonePPNAInformation.annualPPNA.forEach((ppna) => {
      const index = this.annualData.findIndex((value) => value.name === `${ppna.year} - ${ppna.year + 1}`);
      this.annualData[index].data = ppna.values.map((value) => value?.ppna);
      selectedYears[`${ppna.year} - ${ppna.year + 1}`] = true;
    });

    this.annualData.push({
      name: 'L',
      type: 'line',
      data: this.zonePPNAInformation.annualPPNAMean.values.map((value) => value.ppna - value.ppna / 2),
      lineStyle: {
        opacity: 0,
      },
      stack: 'confidence-band',
      symbol: 'none',
    });
    this.annualData.push({
      name: 'U',
      type: 'line',
      data: this.zonePPNAInformation.annualPPNAMean.values.map((value) => 2 * (value.ppna / 2)),
      lineStyle: {
        opacity: 0,
      },
      areaStyle: {
        color: '#f7eed2',
      },
      stack: 'confidence-band',
      symbol: 'none',
    });
    this.updateAnnualOptions = {
      series: this.annualData,
      legend: {
        data: legendData,
        selected: selectedYears,
      },
    };
    notification.dismiss();
  }

  // eslint-disable-next-line class-methods-use-this
  saveCSV() {
    const csvHeader = ['Comunidad', 'Área(ha)', 'Área(%)'];
    const csvData = [];
    this.communitiesData.forEach((community) => {
      csvData.push({
        comunidad: community.name,
        area: ((community.value * this.zoneArea) / 100).toFixed(2),
        area_percent: community.value,
      });
    });

    new AngularCsv(csvData, `${this.zone.name} Distribución del área por comunidades`, { headers: csvHeader });
  }

  saveAnnualCSV() {
    const csvHeader = ['AÑO', ...this.getMonthsInfo()]; // 'JUL 1', 'JUL 17', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC', 'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN'];
    const csvData = [];
    this.zonePPNAInformation.annualPPNA.forEach((annualPPNA) => {
      const csvRow = [
        `${annualPPNA.year} - ${annualPPNA.year + 1}`,
        ...annualPPNA.values.map((value) => (value ? value.ppna : '')),
      ];
      csvData.push(csvRow);
    });
    new AngularCsv(csvData, `${this.zone.name} Productividad Anual`, { headers: csvHeader });
  }

  getMonthsInfo() {
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
}
