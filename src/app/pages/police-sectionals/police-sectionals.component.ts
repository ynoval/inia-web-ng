import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { GoogleMap } from '@angular/google-maps';
import { Observable } from 'rxjs';

import { ZonesService } from '@app/common/services/zones.service';
import { ZoneModel } from '@app/common/models/zone.model';
import { NotificationService } from '@app/common/components/notification/notification.service';

import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { ApiService } from '@app/common/services/api.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-police-sectionals',
  templateUrl: './police-sectionals.component.html',
  styleUrls: ['./police-sectionals.component.scss'],
})
export class PoliceSectionalsComponent implements AfterViewInit {
  public settings: Settings;

  @ViewChild(GoogleMap, { static: false }) mapInstance: GoogleMap;

  public policeSectionals: ZoneModel[] = [];

  public selectedZone: string = '';

  public displayedColumns = ['name', 'actions'];

  public gmOptions: google.maps.MapOptions;

  searchText: string = '';

  keysToExclude: string[] = ['shape', 'visible', 'coordinates'];

  constructor(
    appSettings: AppSettings,
    private cd: ChangeDetectorRef,
    private apiService: ApiService,
    private zonesService: ZonesService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
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
    this.notificationService.showAction('Inicializando...');
    try {
      this.policeSectionals = [];
      this.zonesService.getZones().subscribe((zones) => {
        console.log('zones', zones);
        // Avoid first call with zones equal to null
        if (zones === null) return;
        if (zones.length === 0) {
          this.importPoliceSections();
          return;
        }
        zones.forEach((z) => {
          z.shape.setMap(z.visible ? this.mapInstance.googleMap : null);
        });
        this.policeSectionals = zones;
        this.cd.detectChanges();
      });

      // Load Selected Zone
      this.zonesService.getSelectedZone().subscribe((zone) => {
        this.selectedZone = zone;
        this.cd.detectChanges();
      });
    } catch (error) {
    } finally {
      this.notificationService.snackBar.dismiss();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  toggleZone(zone: any) {
    const index = this.policeSectionals.findIndex((z) => z.name === zone.name);
    if (this.policeSectionals[index].visible) {
      this.zonesService.hideZone(zone.name);
    } else {
      this.zonesService.showZone(zone.name);
    }
  }

  selectZone(zone: any) {
    this.zonesService.selectZone(zone.name);
  }

  viewZone(zone) {
    this.router.navigate(['police-sectionals', zone.id]);
  }

  async importPoliceSections() {
    this.notificationService.showAction('Cargando seccionales policiales...');
    const importedZones = await this.apiService.getPoliceSectionals();
    this.zonesService.importZones(importedZones);
    this.notificationService.snackBar.dismiss();
  }
}
