import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { NgElement, WithProperties } from '@angular/elements';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { GoogleMap } from '@angular/google-maps';

import { GEEMapLayerModel } from '@app/common/models/geeMapLayer.model';
import { ZonesService } from '@app/common/services/zones.service';
import { ZoneModel } from '@app/common/models/zone.model';
import { LayersService } from '@app/common/services/layers.service';
import { NotificationService } from '@app/common/components/notification/notification.service';

import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';

import { MapLayersComponent } from './map-layers/map-layers.component';
import { ImportZonesComponent } from './import-zones/import-zones.component';
import { ExportZonesComponent } from './export-zones/export-zones.component';
import { DeleteZonesComponent } from './delete-zones/delete-zones.component';
import { AddZoneComponent } from './add-zone/add-zone.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements AfterViewInit {
  public settings: Settings;

  // @ViewChild(GoogleMap, { static: false }) set map(m: GoogleMap) {
  //   if (m) {
  //     this.mapInstance = m;
  //     this.initDrawingManager(m);
  //     this.setLayers(m)
  //   }
  // }

  @ViewChild(GoogleMap, { static: false }) mapInstance: GoogleMap;

  public mapLayers = [];

  public definedZones: ZoneModel[] = [];

  public selectedZone: string = '';

  public displayedColumns = ['name', 'actions'];

  public gmOptions: google.maps.MapOptions;

  // apiLoaded: Observable<boolean>;

  drawingManager: google.maps.drawing.DrawingManager;

  searchText: string = '';

  keysToExclude: string[] = ['shape', 'visible', 'coordinates'];

  constructor(
    appSettings: AppSettings,
    private cd: ChangeDetectorRef,
    private zonesService: ZonesService,
    private layersService: LayersService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    public router: Router
  ) {
    this.settings = appSettings.settings;
    // this.loadGoogleMapsApi();
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
    // Load Layers
    this.layersService.getAll().subscribe((layers) => {
      this.mapLayers = layers;
      if (this.mapInstance) {
        this.setLayers();
      }
      // this.notificationService.snackBar.dismiss();
    });
    // Initialize Drawing
    this.initDrawingManager();

    // Load Zones
    this.zonesService.getZones().subscribe((zones) => {
      this.definedZones = [];
      if (zones) {
        zones.forEach((z) => {
          z.shape.setMap(z.visible ? this.mapInstance.googleMap : null);
          this.definedZones.push(z);
        });
      }
      this.cd.detectChanges();
    });
    // Load Selected Zone
    this.zonesService.getSelectedZone().subscribe((zone) => {
      this.selectedZone = zone;
      this.cd.detectChanges();
    });
  }

  // eslint-disable-next-line class-methods-use-this
  toggleZone(zone: any) {
    const index = this.definedZones.findIndex((z) => z.name === zone.name);
    if (this.definedZones[index].visible) {
      this.zonesService.hideZone(zone.name);
    } else {
      this.zonesService.showZone(zone.name);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  deleteZone(zone: any) {
    this.zonesService.removeZone(zone.name);
  }

  selectZone(zone: any) {
    this.zonesService.selectZone(zone.name);
    // TODO: IMPORTANTE!!, por qué fue necesario esto!!!?? :( :(
    // this.cd.detectChanges();
  }

  noSelectedZone() {
    this.zonesService.noSelectedZone();
  }

  addZone() {
    const dialogRef = this.dialog.open(AddZoneComponent, {
      data: { defaultZoneName: this.zonesService.generateZoneName() },
      width: '50%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  importZones() {
    const dialogRef = this.dialog.open(ImportZonesComponent, { width: '50%' });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.zones) {
        this.notificationService.showAction('Importando zonas...');
        this.zonesService.importZones(result.zones);
        this.notificationService.snackBar.dismiss();
      }
    });
  }

  exportZones() {
    const dialogRef = this.dialog.open(ExportZonesComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.zones.length > 0) {
        this.zonesService.importZones(result.zones);
      }
    });
  }

  deleteZones() {
    const dialogRef = this.dialog.open(DeleteZonesComponent, {
      data: { zones: this.definedZones },
      width: '80%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  // LAZY LOADING PROBLEM (multiple googlemap API)
  // Try to solve later, now api is loading as script on index.html
  // private loadGoogleMapsApi() {
  //   const { gmKey } = this.settings;
  //   this.apiLoaded = this.httpClient
  //     .jsonp(`https://maps.googleapis.com/maps/api/js?key=${gmKey}&libraries=drawing`, 'callback')
  //     .pipe(
  //       map(() => {
  //         this.gmOptions = {
  //           center: { lat: -33.031, lng: -55.932 },
  //           zoom: 5,
  //           mapTypeId: 'satellite',
  //           scaleControl: false,
  //           disableDefaultUI: true,
  //           zoomControl: true,
  //           fullscreenControl: true,
  //           fullscreenControlOptions: { position: google.maps.ControlPosition.BOTTOM_RIGHT },
  //           keyboardShortcuts: false,
  //         };
  //         return true;
  //       }),
  //       catchError(() => of(false))
  //     );
  // }

  private initDrawingManager() {
    this.mapInstance.googleMap.addListener('click', () => {
      this.noSelectedZone();
    });
    if (!this.drawingManager) {
      const drawingOptions = {
        // drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_LEFT,
          drawingModes: [
            google.maps.drawing.OverlayType.MARKER,
            google.maps.drawing.OverlayType.POLYGON,
            // google.maps.drawing.OverlayType.RECTANGLE,
          ],
        },
        markerOptions: {
          draggable: true,
        },
        polygonOptions: {
          strokeWeight: 1,
          fillOpacity: 0.6,
          editable: true,
          fillColor: '#EA4435',
          strokeColor: '#FFF',
          draggable: true,
          clickable: true,
        },
        rectangleOptions: {
          strokeWeight: 1,
          fillOpacity: 0.6,
          editable: true,
          fillColor: '#EA4435',
          strokeColor: '#FFF',
          draggable: true,
          clickable: true,
        },
      };
      this.drawingManager = new google.maps.drawing.DrawingManager(drawingOptions);
      this.drawingManager.setMap(this.mapInstance.googleMap);
      google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event) => {
        this.zonesService.addZone(event);
        event.overlay.setMap(null);
      });
    }
  }

  private setLayers() {
    if (this.mapLayers && this.mapLayers.length > 0) {
      // Create angular element to manage layers
      const containerEl = document.getElementById('containerLayers');
      if (containerEl.childElementCount === 0) {
        const layersElement: NgElement & WithProperties<MapLayersComponent> = document.createElement(
          'app-map-layers2'
        ) as any;

        layersElement.addEventListener('changeLayer', (event: any) => {
          if (event.detail.action === 'SHOW') {
            this.showLayer(event.detail.layer);
          } else {
            this.hideLayer(event.detail.layer);
          }
        });
        layersElement.mapLayers = this.mapLayers;
        // Add to the DOM
        containerEl.innerHTML = '';
        containerEl.appendChild(layersElement);
        this.mapInstance.googleMap.controls[google.maps.ControlPosition.TOP_RIGHT].push(containerEl);
        const overlays = this.mapInstance.googleMap.overlayMapTypes.getArray();
        this.mapLayers.forEach((l) => {
          if (l.isVisible) {
            const index = overlays.findIndex((overlay) => overlay.name === l.label);
            if (index === -1) {
              this.mapInstance.googleMap.overlayMapTypes.push(l.overlay);
            }
          }
        });
        this.notificationService.snackBar.dismiss();
      }
      // } else {
      //   const layersElement: NgElement & WithProperties<MapLayersComponent> = containerEl.children[0] as NgElement &
      //     WithProperties<MapLayersComponent>;
      //   layersElement.mapLayers = this.mapLayers;
      // }
    }
  }

  private showLayer(layer: GEEMapLayerModel) {
    this.layersService.show(layer);
    this.mapInstance.googleMap.overlayMapTypes.push(layer.overlay);
  }

  private hideLayer(layer: GEEMapLayerModel) {
    this.layersService.hide(layer);
    const mapIndex = this.mapLayers.findIndex((l) => l.label === layer.label);
    this.mapLayers[mapIndex].isVisible = false;
    const index = this.mapInstance.googleMap.overlayMapTypes
      .getArray()
      .findIndex((overlay) => overlay.name === layer.label);
    this.mapInstance.googleMap.overlayMapTypes.removeAt(index);
  }

  viewZone(zone) {
    this.router.navigate(['zone', zone.id]);
  }
}
