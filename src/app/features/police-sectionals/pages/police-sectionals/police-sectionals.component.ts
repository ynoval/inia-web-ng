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

import { ApiService } from '@app/common/services/api.service';
import { Settings } from '@app/app.settings.model';
import { AppSettings } from '@app/app.settings';

@Component({
  selector: 'app-police-sectionals',
  templateUrl: './police-sectionals.component.html',
  styleUrls: ['./police-sectionals.component.scss'],
})
export class PoliceSectionalsPageComponent implements AfterViewInit {
  public settings: Settings;

  @ViewChild(GoogleMap, { static: false }) mapInstance: GoogleMap;

  public zones: ZoneModel[] = [];

  public selectedZone: string = '';

  public displayedColumns = ['name', 'actions'];

  public gmOptions: google.maps.MapOptions;

  searchText: string = '';

  keysToExclude: string[] = ['shape', 'visible', 'coordinates'];

  isLoadingZones: boolean = false;

  @ViewChild('zonesContainer') listContainer: ElementRef;

  @ViewChildren('zoneItem') listItems: QueryList<ElementRef>;

  constructor(
    appSettings: AppSettings,
    private cd: ChangeDetectorRef,
    private apiService: ApiService,
    private zonesService: ZonesService,
    private notificationService: NotificationService,
    public router: Router
  ) {
    this.settings = appSettings.settings;

    this.gmOptions = {
      center: { lat: -32, lng: -56 },
      zoom: 6,
      mapTypeId: 'satellite',
      scaleControl: false,
      disableDefaultUI: true,
      zoomControl: true,
      fullscreenControl: true,
      fullscreenControlOptions: { position: google.maps.ControlPosition.BOTTOM_RIGHT },
      keyboardShortcuts: false,
    };
  }

  ngAfterViewInit() {
    // Load Zones
    this.loadZones();

    // Load Selected Zone
    this.zonesService.getSelectedZone().subscribe((zone) => {
      this.selectedZone = zone;

      const listItem = this.listItems.find((listItemRef) => {
        return listItemRef.nativeElement.getAttribute('data-zone-id') === `${this.selectedZone}`;
      });
      if (listItem) {
        // this.listContainer.nativeElement.scrollTop = listItem.nativeElement.offsetTop;
        listItem.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
      this.cd.detectChanges();
    });
  }

  private loadZones() {
    this.zonesService.getZones().subscribe((_zones) => {
      // Avoid first call with zones equal to null
      // TODO: FIX!!
      if (_zones === null) return;

      this.isLoadingZones = true;

      if (!_zones || _zones.length === 0) {
        this.importPoliceSectionals();
        return;
      }

      const notification = this.notificationService.showAction('cargando el listado de seccionales policiales ...');

      _zones.forEach((z) => {
        z.shape.setMap(z.visible ? this.mapInstance.googleMap : null);
      });

      this.zones = _zones;
      this.cd.detectChanges();
      notification.dismiss();
      setTimeout(() => {
        this.isLoadingZones = false;
      }, 300);
    });
  }

  private importPoliceSectionals() {
    const notification = this.notificationService.showAction(`importando seccionales policiales ...`);
    this.apiService
      .getPoliceSectionals()
      .then((policeSectionals) => {
        const policeSectionalsToImport = policeSectionals.map((zone) => {
          const properties = zone.properties ? zone.properties : {};
          console.log({ properties });
          properties.name = `Seccional Policial - ${properties.CODIGOSECC}`;
          properties.description = this.getPoliceSectionalDescription(properties);
          return { ...zone, properties: properties };
        });

        console.log({ policeSectionalsToImport });
        try {
          this.zonesService.importZones(
            policeSectionalsToImport.sort((z1, z2) => (z1.properties.CODIGOSECC >= z2.properties.CODIGOSECC ? 1 : -1))
          );
          this.isLoadingZones = false;
        } catch (error) {
          console.log({ error });
        }
        notification.dismiss();
      })
      .catch((e) => {
        // TODO: Show error importing basings...
        console.log('importing police sectionals error', { error: e });
        notification.dismiss();
      });
  }

  private getPoliceSectionalDescription(properties) {
    return properties.NOMBRE_1 ? `${properties.NOMBRE_1} - ${properties.DEPARTAMEN}` : `${properties.DEPARTAMEN}`;
  }

  // eslint-disable-next-line class-methods-use-this
  toggleZone(zone: any) {
    const index = this.zones.findIndex((z) => z.name === zone.name);
    if (this.zones[index].visible) {
      this.zonesService.hideZone(zone.name);
    } else {
      this.zonesService.showZone(zone.name);
    }
  }

  toggleSelectZone(zone: any) {
    if (zone.name === this.selectedZone) {
      this.zonesService.noSelectedZone();
    } else {
      this.zonesService.selectZone(zone.name);
    }
  }

  viewZone(zone) {
    this.router.navigate(['police-sectionals', zone.id]);
  }

  private getZoneName(zone) {
    const name = zone.properties.find((p) => p.propertyName === 'name');
    return name ? name.propertyValue : zone.name || 'Seccional Policial - ??';
  }

  private getZoneDescription(zone) {
    const description = zone.properties.find((p) => p.propertyName === 'description');
    return description ? description.propertyValue : '';
  }

  cleanSearch() {
    this.searchText = '';
  }
}
