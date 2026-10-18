import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { NgElement, WithProperties } from '@angular/elements';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { GoogleMap } from '@angular/google-maps';
import { TerraDraw, TerraDrawPointMode, TerraDrawPolygonMode } from 'terra-draw';
import { TerraDrawGoogleMapsAdapter } from 'terra-draw-google-maps-adapter';

import { GEEMapLayerModel } from '@app/common/models/geeMapLayer.model';
import { ZonesService } from '@app/common/services/zones.service';
import { ConfirmInfoModel } from '@app/common/directives/confirm/confirm.model';
import { ZoneModel, ZoneType } from '@app/common/models/zone.model';
import { LayersService } from '@app/common/services/layers.service';
import { NotificationService } from '@app/common/components/notification/notification.service';
import { Settings } from '@app/app.settings.model';
import { AppSettings } from '@app/app.settings';

import { MapLayersComponent } from '../../components/map-layers/map-layers.component';
import { ImportZonesComponent } from '../../components/import-zones/import-zones.component';
import { ExportZonesComponent } from '../../components/export-zones/export-zones.component';
import { DeleteZonesComponent } from '../../components/delete-zones/delete-zones.component';
import { AddZoneComponent } from '../../components/add-zone/add-zone.component';

// Terra Draw mode names ('static' = no drawing, the map can be moved)
type DrawingMode = 'static' | 'point' | 'polygon';

@Component({
  selector: 'app-custom-zones',
  templateUrl: './custom-zones.component.html',
  styleUrls: ['./custom-zones.component.scss'],
})
export class CustomZonesPageComponent implements AfterViewInit, OnDestroy {
  public settings: Settings;

  @ViewChild(GoogleMap, { static: false }) mapInstance: GoogleMap;

  public zones: ZoneModel[] = [];

  public selectedZone: string = '';

  public displayedColumns = ['name', 'actions'];

  public gmOptions: google.maps.MapOptions;

  searchText: string = '';

  keysToExclude: string[] = ['shape', 'visible', 'coordinates'];

  isLoadingZones: boolean = false;

  public mapLayers = [];

  // Google Drawing Library (DrawingManager) was removed in Maps JavaScript API 3.65,
  // Terra Draw is the replacement recommended by Google
  drawing: TerraDraw;

  drawingMode: DrawingMode = 'static';

  isDrawingReady: boolean = false;

  @ViewChild('drawingControl', { static: true }) drawingControl: ElementRef<HTMLElement>;

  confirmInformation: ConfirmInfoModel = {
    title: 'Eliminar Zona',
    question: 'Estas seguro que deseas eliminar la zona',
    width: '250px',
  };

  @ViewChild('zonesContainer') listContainer: ElementRef;

  @ViewChildren('zoneItem') listItems: QueryList<ElementRef>;

  constructor(
    appSettings: AppSettings,
    private cd: ChangeDetectorRef,
    private zonesService: ZonesService,
    private notificationService: NotificationService,
    public router: Router,
    private layersService: LayersService,
    public dialog: MatDialog,
    private ngZone: NgZone
  ) {
    this.settings = appSettings.settings;
    // TODO: Move to configuration
    this.gmOptions = {
      center: { lat: -32, lng: -56 },
      zoom: 6,
      mapTypeId: google.maps.MapTypeId.HYBRID,
      scaleControl: false,
      disableDefaultUI: true,
      zoomControl: true,
      fullscreenControl: true,
      fullscreenControlOptions: { position: google.maps.ControlPosition.BOTTOM_RIGHT },
      keyboardShortcuts: false,
      mapTypeControl: true,
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT,
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      },
    };
  }

  ngAfterViewInit() {
    // Load Zones
    this.isLoadingZones = true;
    this.loadZones();
    // Load layers
    this.loadLayers();

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

  ngOnDestroy() {
    if (this.drawing?.enabled) {
      this.drawing.stop();
    }
  }

  // #region GoogleMap and Layers
  private loadLayers() {
    const notification = this.notificationService.showAction('Cargando las capas...');
    this.layersService.getAll().subscribe((layers) => {
      this.mapLayers = layers;
      if (this.mapInstance) {
        this.setLayers();
      }
      //this.notificationService.snackBar.dismiss();
      notification.dismiss();
    });
    // Initialize Drawing
    this.initDrawing();
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

  private initDrawing() {
    const map = this.mapInstance.googleMap;
    map.addListener('click', () => {
      this.noSelectedZone();
    });
    if (!this.drawing) {
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.drawingControl.nativeElement);
      // Terra Draw adapter needs an id on the map element and a map projection
      if (!map.getDiv().id) {
        map.getDiv().id = 'custom-zones-map';
      }
      if (map.getProjection()) {
        this.startDrawing(map);
      } else {
        google.maps.event.addListenerOnce(map, 'projection_changed', () => this.startDrawing(map));
      }
    }
  }

  private startDrawing(map: google.maps.Map) {
    // Outside Angular to avoid change detection on every map mouse event
    this.ngZone.runOutsideAngular(() => {
      this.drawing = new TerraDraw({
        adapter: new TerraDrawGoogleMapsAdapter({ map, lib: google.maps, coordinatePrecision: 9 }),
        modes: [
          new TerraDrawPointMode({
            styles: { pointColor: '#EA4435', pointWidth: 6, pointOutlineColor: '#FFFFFF', pointOutlineWidth: 1 },
          }),
          new TerraDrawPolygonMode({
            styles: {
              fillColor: '#EA4435',
              fillOpacity: 0.5,
              outlineColor: '#FFFFFF',
              outlineWidth: 1,
              closingPointColor: '#FFFFFF',
              closingPointOutlineColor: '#EA4435',
            },
          }),
        ],
      });

      this.drawing.on('ready', () => {
        this.ngZone.run(() => {
          this.isDrawingReady = true;
        });
      });

      this.drawing.on('finish', (id, context) => {
        if (context.action !== 'draw') return;
        const feature = this.drawing.getSnapshotFeature(id);
        // The zone is drawn by ZonesService as a google.maps Marker/Polygon (editable, selectable, ...)
        setTimeout(() => {
          if (this.drawing.enabled) {
            this.drawing.removeFeatures([id]);
          }
        });
        if (!feature) return;

        this.ngZone.run(() => {
          if (feature.geometry.type === 'Point') {
            const [lng, lat] = feature.geometry.coordinates;
            this.zonesService.addZone(ZoneType.MARKER, { lat, lng });
          } else if (feature.geometry.type === 'Polygon') {
            // GeoJSON rings repeat the first coordinate at the end, Google Maps polygons don't need it
            const ring = feature.geometry.coordinates[0].slice(0, -1);
            this.zonesService.addZone(
              ZoneType.POLYGON,
              ring.map(([lng, lat]) => ({ lat, lng }))
            );
          }
        });
      });

      this.drawing.start();
    });
  }

  setDrawingMode(mode: DrawingMode) {
    if (!this.isDrawingReady) return;
    this.drawingMode = mode;
    this.ngZone.runOutsideAngular(() => this.drawing.setMode(mode));
  }

  private setLayers() {
    if (this.mapLayers && this.mapLayers.length > 0) {
      // Create angular element to manage layers
      const containerEl = document.getElementById('containerLayers');
      if (containerEl.childElementCount === 0) {
        const layersElement: NgElement & WithProperties<MapLayersComponent> = document.createElement(
          'app-map-layers'
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

  //#endregion

  // #region Zones

  private loadZones() {
    this.zonesService.getZones().subscribe((_zones) => {
      // Avoid first call with zones equal to null
      // TODO: FIX!!
      if (_zones === null || _zones.length === 0) {
        this.isLoadingZones = false;
        this.zones = [];
        return;
      }

      this.zones = [];
      // this.isLoadingZones = true;

      const notification = this.notificationService.showAction('cargando el listado de seccionales policiales ...');

      _zones.forEach((z) => {
        z.shape.setMap(z.visible ? this.mapInstance.googleMap : null);
      });

      this.zones = _zones;
      this.cd.detectChanges();
      notification.dismiss();
      this.isLoadingZones = false;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  toggleZone(zone: any) {
    const index = this.zones.findIndex((z) => z.name === zone.name);
    if (this.zones[index].visible) {
      this.zonesService.hideZone(zone.id);
    } else {
      this.zonesService.showZone(zone.id);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  deleteZone(zone: any) {
    this.zonesService.removeZone(zone.id);
  }

  toggleSelectZone(zone: any) {
    if (zone.name === this.selectedZone) {
      this.noSelectedZone();
    } else {
      this.zonesService.selectZone(zone.id);
    }
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
        console.log('Export zones');
        // this.zonesService.exportZones(result.zones);
      }
    });
  }

  deleteZones() {
    const dialogRef = this.dialog.open(DeleteZonesComponent, {
      data: { zones: this.zones },
      width: '80%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  viewZone(zone) {
    this.router.navigate(['zones', zone.id]);
  }

  getZoneName(zone) {
    return zone.properties.name ?? zone.name;
  }

  getZoneDescription(zone) {
    return zone.properties.description ?? '';
  }

  cleanSearch() {
    this.searchText = '';
  }
}
