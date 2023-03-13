import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Router } from '@angular/router';

import { ZonesService } from '@app/common/services/zones.service';
import { ZoneModel } from '@app/common/models/zone.model';
import { NotificationService } from '@app/common/components/notification/notification.service';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { ApiService } from '@app/common/services/api.service';

@Component({
  selector: 'app-basins',
  templateUrl: './basins.component.html',
  styleUrls: ['./basins.component.scss'],
})
export class BasinsComponent implements AfterViewInit {
  public settings: Settings;

  @ViewChild(GoogleMap, { static: false }) mapInstance: GoogleMap;

  public basins: ZoneModel[] = [];

  public selectedBasin: string = '';

  public displayedColumns = ['name', 'actions'];

  public gmOptions: google.maps.MapOptions;

  searchText: string = '';

  keysToExclude: string[] = ['shape', 'visible', 'coordinates'];

  selectedGrade: 'I' | 'II' | 'III' | 'IV' | 'V';

  constructor(
    appSettings: AppSettings,
    private cd: ChangeDetectorRef,
    private apiService: ApiService,
    private zonesService: ZonesService,
    private notificationService: NotificationService,
    public router: Router
  ) {
    this.settings = appSettings.settings;
    this.selectedGrade = 'I';

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
    this.notificationService.showAction('cargando la información');
    // Load Zones
    this.basins = [];
    this.loadZones();

    // Load Selected Zone
    this.zonesService.getSelectedZone().subscribe((zone) => {
      this.selectedBasin = zone;
      this.cd.detectChanges();
    });
  }

  private loadZones() {
    this.zonesService.getZones().subscribe((zones) => {
      // Avoid first call with zones equal to null
      if (zones === null) return;

      const notification = this.notificationService.showAction('cargando las cuencas...');

      if (zones.length === 0) {
        this.importBasins(this.selectedGrade);
        notification.dismiss();
        return;
      }

      const visibleZones = zones.filter((zone) => {
        const grade = zone.properties.find((p) => p.propertyName === 'grado');
        return grade.propertyValue === this.selectedGrade;
      });

      if (visibleZones.length === 0) {
        this.importBasins(this.selectedGrade);
        return;
      }

      visibleZones.forEach((z) => {
        z.shape.setMap(z.visible ? this.mapInstance.googleMap : null);
      });

      this.basins = visibleZones;
      this.cd.detectChanges();
      notification.dismiss();
    });
  }

  private importBasins(grade) {
    this.apiService.getBasins(grade).then((basins) => {
      this.zonesService.importZones(
        basins.map((zone) => {
          const properties = zone.properties ? zone.properties : {};
          properties.grado = grade;
          return { ...zone, properties: properties };
        })
      );
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

  selectZone(zone: any) {
    this.zonesService.selectZone(zone.name);
  }

  viewZone(zone) {
    this.router.navigate(['basins', zone.id]);
  }

  switchGrade() {
    this.loadZones();
  }

  cleanSearch() {
    console.log('clean search');
    this.searchText = '';
  }
}
