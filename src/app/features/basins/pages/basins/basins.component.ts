import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Router } from '@angular/router';

import { ZonesService } from '@app/common/services/zones.service';
import { ZoneModel } from '@app/common/models/zone.model';
import { NotificationService } from '@app/common/components/notification/notification.service';
import { BasinGradeType } from '../../basins.models';
import { ApiService } from '@app/common/services/api.service';
import { Settings } from '@app/app.settings.model';
import { AppSettings } from '@app/app.settings';
import { GoogleMapService } from '@app/common/services/google-map.service';

@Component({
  selector: 'app-basins',
  templateUrl: './basins.component.html',
  styleUrls: ['./basins.component.scss'],
})
export class BasinsPageComponent implements AfterViewInit {
  public settings: Settings;

  @ViewChild(GoogleMap, { static: false }) mapInstance: GoogleMap;

  public basins: ZoneModel[] = [];

  public selectedBasin: string = '';

  public displayedColumns = ['name', 'actions'];

  public gmOptions: google.maps.MapOptions;

  searchText: string = '';

  keysToExclude: string[] = ['shape', 'visible', 'coordinates'];

  selectedGrade: 'I' | 'II' | 'III' | 'IV' | 'V';

  isLoadingZones: boolean = false;

  @ViewChild('zonesContainer') listContainer: ElementRef;

  @ViewChildren('zoneItem') listItems: QueryList<ElementRef>;

  constructor(
    appSettings: AppSettings,
    private cd: ChangeDetectorRef,
    private apiService: ApiService,
    private zonesService: ZonesService,
    private notificationService: NotificationService,
    public router: Router,
    googleMapService: GoogleMapService
  ) {
    this.settings = appSettings.settings;
    this.selectedGrade = 'I';

    this.gmOptions = googleMapService.getMapOptions();
  }

  ngAfterViewInit() {
    // Load Zones
    this.loadZones();

    // Load Selected Zone
    this.zonesService.getSelectedZone().subscribe((zone) => {
      this.selectedBasin = zone;

      const listItem = this.listItems.find((listItemRef) => {
        return listItemRef.nativeElement.getAttribute('data-zone-id') === `${this.selectedBasin}`;
      });
      if (listItem) {
        // this.listContainer.nativeElement.scrollTop = listItem.nativeElement.offsetTop;
        listItem.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }

      this.cd.detectChanges();
    });
  }

  private loadZones() {
    this.zonesService.getZones().subscribe((zones) => {
      // Avoid first call with zones equal to null
      // TODO: FIX!!
      if (zones === null) {
        return;
      }

      // this.isLoadingZones = true;

      const visibleZones = this.getGradeZones(zones);

      if (visibleZones.length === 0) {
        this.importBasins(this.selectedGrade);
        return;
      }

      const notification = this.notificationService.showAction('cargando el listado de cuencas...');

      this.basins.forEach((basin) => {
        basin.shape.setMap(null);
      });

      visibleZones.forEach((z) => {
        z.shape.setMap(z.visible ? this.mapInstance.googleMap : null);
      });

      this.basins = visibleZones;
      this.cd.detectChanges();
      notification.dismiss();
      setTimeout(() => {
        this.isLoadingZones = false;
      }, 100);
    });
  }

  private getGradeZones(zones) {
    if (!zones || zones.length === 0) {
      return [];
    }

    return zones.filter((zone) => {
      const grade = zone.properties.find((p) => p.propertyName === 'grade');
      return grade.propertyValue === this.selectedGrade;
    });
  }

  private importBasins(grade) {
    const notification = this.notificationService.showAction(`importando cuencas de grado ${grade} ...`);
    this.apiService
      .getBasins(grade)
      .then((basins) => {
        const basinsToImport = basins.map((zone) => {
          const properties = zone.properties ? zone.properties : {};
          const basinInformation = this.getBasinInformation(grade, properties);
          properties.name = basinInformation.name;
          properties.grade = basinInformation.grade;
          properties.description = basinInformation.description;
          return { ...zone, name: basinInformation.name, properties: properties };
        });

        try {
          this.zonesService.importZones(basinsToImport);
        } catch (error) {
          console.log({ error });
        } finally {
          this.isLoadingZones = false;
        }
        notification.dismiss();
      })
      .catch((e) => {
        // TODO: Show error importing basins...
        notification.dismiss();
      });
  }

  // eslint-disable-next-line class-methods-use-this
  toggleZone(zone: any) {
    const index = this.basins.findIndex((z) => z.name === zone.name);
    if (this.basins[index].visible) {
      this.zonesService.hideZone(zone.name);
    } else {
      this.zonesService.showZone(zone.name);
    }
  }

  toggleSelectZone(zone: any) {
    console.log('toggleSelectZone', this.selectedBasin, zone.id);
    if (this.selectedBasin === zone.id) {
      this.zonesService.noSelectedZone();
    } else {
      this.zonesService.selectZone(zone.id);
    }
  }

  viewZone(zone) {
    this.router.navigate(['basins', zone.id]);
  }

  switchGrade() {
    this.isLoadingZones = true;
    this.loadZones();
  }

  private getBasinInformation(grade: BasinGradeType, properties) {
    const description = properties.nombrec1 || properties.nombrec2 || properties.nombrec3 || properties.nombrec4 || '';
    return {
      name: `Cuenca-${properties.codcuenca}`,
      description,
      grade,
    };
  }

  private getBasinName(basin) {
    if (basin.name) {
      return basin.name;
    }
    const name = basin.properties.find((p) => p.propertyName === 'name');
    return name ? name.propertyValue : ' Cuenca_NO_COD';
  }

  private getBasinDescription(basin) {
    const description = basin.properties.find((p) => p.propertyName === 'description');
    return description ? description.propertyValue : '';
  }

  cleanSearch() {
    this.searchText = '';
  }
}
