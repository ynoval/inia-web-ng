import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { NotificationService } from '@app/common/components/notification/notification.service';
import { CommunityModel } from '@app/common/models/community.model';
import { SpecieModel } from '@app/common/models/specie.model';
import { SubCommunityModel } from '@app/common/models/subcommunity.model';
import { ApiService } from '@app/common/services/api.service';
import { EChartsOption } from 'echarts';
import { from, Observable } from 'rxjs';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss'],
})
export class CommunityPageComponent implements OnInit {
  public settings: Settings;

  public id: string;

  public order: string;

  public name: string;

  public community$: Observable<CommunityModel>;

  public subcommunities$: Observable<SubCommunityModel[]>;

  public species$: Observable<SpecieModel[]>;

  communityPPNAInformation: any;

  selectedPPNAChart = 'ANNUAL_CHART';

  ppnaChartsTypes = [
    { id: 'ANNUAL_CHART', label: 'Análisis por año' },
    { id: 'HISTORICAL_CHART', label: 'Análisis Histórico' },
    // { id: 'MONTHLY_CHART', label: 'Análisis mensual' },
  ];

  annualData = [];

  historicalData = [];

  annualChartInstance: any;

  startPreditionMonth = (new Date().getMonth() + 5) % 12;

  endPredictionMonth = this.startPreditionMonth + 3;

  annualChartOptions: EChartsOption = {
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
    // visualMap: {
    //   show: false,
    //   seriesIndex: 1,
    //   dimension: 0,
    //   pieces: [
    //     { lt: 5, color: '#096' },
    //     {
    //       gt: this.startPreditionMonth,
    //       lte: this.endPredictionMonth,
    //       color: 'white',
    //     },
    //   ],
    // },
    xAxis: {
      type: 'category',
      data: this.getMonthsInfo(),
      name: 'Meses',
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

  historicalChartInstance: any;

  historicalChartOptions: EChartsOption = {
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
      name: 'PPNA (kg MS/ha)',
      nameLocation: 'middle',
      nameTextStyle: {
        padding: 30,
      },
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 20,
      },
      {
        start: 0,
        end: 20,
      },
    ],
    series: [],
  };

  updateHistoricalOptions: any;

  monthlyChartInstance: any;

  monthlyChartOptions: EChartsOption = {
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

  ppnaLoaded: boolean = false;

  constructor(
    public appSettings: AppSettings,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.community$ = from(this.apiService.getCommunity(this.id));
    this.community$.subscribe((community) => {
      this.order = community.order;
      this.name = community.name;
    });
    this.subcommunities$ = from(this.apiService.getSubCommunities(this.id));
    this.species$ = from(this.apiService.getCommunitySpecies(this.id));
  }

  // #region Private
  onAnnualChartInit(ec) {
    this.annualChartInstance = ec;
    this.annualChartInstance.on('legendselectchanged', async (params) => {
      if (params.name === 'Media') {
        return;
      }
      const year = +params.name.split(' - ')[0];
      const index = this.annualData.findIndex((item) => item.name === `${year} - ${year + 1}`);
      if (this.annualData[index].data.length === 0) {
        this.annualChartInstance.showLoading({ text: 'Cargando datos...' });
        const result = await this.apiService.getCommunityAnnualPPNA(this.order, year);
        this.communityPPNAInformation.ppna.push(result);
        this.annualData[index].data = result.values.map((value) => value.ppna);
        this.annualData[index].emphasis = {
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' },
        };
        this.updateAnnualOptions = {
          series: this.annualData,
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

  // eslint-disable-next-line class-methods-use-this
  private getAvailableYears() {
    const years = [];
    const currentDate = new Date();
    const lastYear = currentDate.getMonth() > 6 ? currentDate.getFullYear() : currentDate.getFullYear() - 1;
    const firstYear = 2001; // TODO: FIX Get from Config
    for (let i = firstYear; i <= lastYear; i += 1) {
      years.push(i);
    }
    return years;
  }

  async changePPNAChart() {
    if (this.selectedPPNAChart === 'HISTORICAL_CHART') {
      if (!this.communityPPNAInformation.historicalInformation) {
        const legendData = [];
        const notification = this.notificationService.showAction('Cargando información de productividad histórica');
        this.communityPPNAInformation.historicalInformation = await this.apiService.getCommunityHistoricalPPNA(
          this.order
        );
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
          data: this.communityPPNAInformation.historicalInformation.map((value) => (12 * value.ppna).toFixed(2)),
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

  private viewCommunityInfo() {
    this.community$.subscribe(({ link }) => {
      window.open(link, '_blank');
    });
  }
  // #endregion

  private tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.index === 1 && !this.ppnaLoaded) {
      this.loadPPNAInformation().then(() => {
        this.ppnaLoaded = true;
      });
    }
  }

  async loadPPNAInformation() {
    const notification = this.notificationService.showAction('Cargando información de productividad');
    const currentDate = new Date();
    const lastYear = currentDate.getMonth() > 6 ? currentDate.getFullYear() : currentDate.getFullYear() - 1;
    this.communityPPNAInformation = {
      annualPPNAMean: await this.apiService.getCommunityAnnualPPNAMean(this.order),
      ppna: [await this.apiService.getCommunityAnnualPPNA(this.order, lastYear)],
    };
    // update series :
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
      data: this.communityPPNAInformation.annualPPNAMean.values.map((value) => value.ppna),
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
    this.communityPPNAInformation.ppna.forEach((ppna) => {
      const index = this.annualData.findIndex((value) => value.name === `${ppna.year} - ${ppna.year + 1}`);
      this.annualData[index].data = ppna.values.map((value) => value?.ppna);
      selectedYears[`${ppna.year} - ${+ppna.year + 1}`] = true;
    });

    this.annualData.push({
      name: 'L',
      type: 'line',
      data: this.communityPPNAInformation.annualPPNAMean.values.map((value) => value.ppna - value.ppna / 2),
      lineStyle: {
        opacity: 0,
      },
      stack: 'confidence-band',
      symbol: 'none',
    });
    this.annualData.push({
      name: 'U',
      type: 'line',
      data: this.communityPPNAInformation.annualPPNAMean.values.map((value) => 2 * (value.ppna / 2)),
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

  saveAnnualCSV() {
    const csvHeader = ['AÑO', ...this.getMonthsInfo()];
    const csvData = [];
    this.communityPPNAInformation.ppna.forEach((ppna) => {
      const csvRow = [`${ppna.year} - ${ppna.year + 1}`, ...ppna.values.map((value) => (value ? value.ppna : ''))];
      csvData.push(csvRow);
    });
    new AngularCsv(csvData, `Comunidad ${this.order} - Productividad Anual`, { headers: csvHeader });
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

  getCommunityTitle() {
    // return this.order === 'VI' ? this.name : `Comunidad ${this.order} - ${this.name}`;
    return `Comunidad ${this.order} - ${this.name}`;
  }
}
