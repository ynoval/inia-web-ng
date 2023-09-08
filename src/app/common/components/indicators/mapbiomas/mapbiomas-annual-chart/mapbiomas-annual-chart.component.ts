import { Component, Input, OnInit } from '@angular/core';
import { ZoneModel } from '@app/common/models/zone.model';
import { ZonesService } from '@app/common/services/zones.service';
import { BehaviorSubject } from 'rxjs';

const coverMap = {
  '1': 'Bosque Natural',
  '3': 'Formación forestal',
  '4': 'Formación sabánica / Bosque abierto',
  '9': 'Silvicultura',
  '10': 'Formación natural no forestal',
  // '11': 'Zona Pantanosa o pastizal inundable',
  '11': 'Zona Pantanosa',
  '12': 'Pastizal',
  '14': 'Agropecuaria y silvicultura',
  '15': 'Pastura',
  '18': 'Agricultura',
  '21': 'Agricultura o pastura',
  '22': 'Área sin vegetación',
  '26': 'Cuerpo de água',
  '33': 'Río, lago u océano',
  '27': 'No observado',
};

@Component({
  selector: 'app-mapbiomas-annual-chart',
  templateUrl: './mapbiomas-annual-chart.component.html',
  styleUrls: ['./mapbiomas-annual-chart.component.scss'],
})
export class MapbiomasAnnualChartComponent implements OnInit {
  @Input() zone: ZoneModel;

  initialYear = 2021;

  options$: BehaviorSubject<any> = new BehaviorSubject<any>({
    title: {
      text: 'Cobertura del suelo',
      subtext: `Año ${this.initialYear}`,
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => `${params.data.name} - ${params.data.value} ha`,
    },
    legend: {
      orient: 'vertical',
      left: 'right',
    },
  });

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  mapbiomasData$: BehaviorSubject<any> = new BehaviorSubject<any>([
    { value: 1048, name: 'Search Engine' },
    { value: 735, name: 'Direct' },
    { value: 580, name: 'Email' },
    { value: 484, name: 'Union Ads' },
    { value: 300, name: 'Video Ads' },
  ]);

  constructor(private zonesService: ZonesService) {}

  ngOnInit() {
    this.load(this.initialYear);
  }

  onYearChange(selectedYear) {
    this.load(selectedYear);
  }

  async load(year) {
    this.isLoading$.next(true);
    const data = await this.zonesService.getZoneAnnualMapbiomas(this.zone.id, year);
    const currentOptions = this.options$.getValue();
    this.options$.next({ ...currentOptions, title: { ...currentOptions.title, subtext: `Año ${year}` } });
    this.mapbiomasData$.next(
      data.map((d: any) => {
        return {
          value: (d.area / 10000).toFixed(2),
          name: coverMap[d.classId],
        };
      })
    );
    this.isLoading$.next(false);
  }
}
