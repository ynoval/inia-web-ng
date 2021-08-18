import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { NgElement, WithProperties } from '@angular/elements';
import { GoogleMap } from '@angular/google-maps';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as ee from '@google/earthengine';
import { ApiService } from '@app/common/services/api.service';
import { GEEMapLayerModel } from '@app/common/models/geeMapLayer.model';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { MapLayersComponent } from './map-layers/map-layers.component';

export interface Zone {
  name: string;
  type: google.maps.drawing.OverlayType;
  visible: boolean;
  info: any;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  public settings: Settings;

  @ViewChild(GoogleMap, { static: false }) set map(m: GoogleMap) {
    if (m) {
      this.loadLayers(m);
      this.initDrawingManager(m);
    }
  }

  public activeMarkerIcon: string = 'https://cdn3.iconfinder.com/data/icons/musthave/32/Stock%20Index%20Down.png';

  public mapInstance: GoogleMap;

  public mapLayers = [];

  public definedZones: Zone[] = [];

  public selectedZone: string = '';

  public displayedColumns = ['name', 'actions'];

  // @ViewChild(MatTable) zoneTable: MatTable<any>;

  public gmOptions: google.maps.MapOptions;

  apiLoaded: Observable<boolean>;

  drawingManager: google.maps.drawing.DrawingManager;

  constructor(
    private httpClient: HttpClient,
    appSettings: AppSettings,
    private apiService: ApiService,
    private cd: ChangeDetectorRef
  ) {
    this.settings = appSettings.settings;
    this.loadGoogleMapsApi();
  }

  // eslint-disable-next-line class-methods-use-this
  toogleZone(zone: any) {
    const index = this.definedZones.findIndex((z) => z.name === zone.name);
    if (this.definedZones[index].visible) {
      // Hide zone
      this.definedZones[index].info.overlay.setMap(null);
      this.definedZones[index].visible = false;
      if (this.selectedZone === zone.name) {
        this.selectedZone = '';
      }
    } else {
      this.definedZones[index].info.overlay.setMap(this.mapInstance.googleMap);
      this.definedZones[index].visible = true;
      this.selectedZone = zone.name;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  deleteZone(zone: any) {
    const index = this.definedZones.findIndex((z) => z.name === zone.name);
    this.definedZones[index].info.overlay.setMap(null);
    this.definedZones.splice(index, 1);
  }

  selectZone(zone: any) {
    this.definedZones.forEach((z) => {
      if (z.type !== google.maps.drawing.OverlayType.MARKER) {
        z.info.overlay.setEditable(z.name === zone.name && z.visible);
      } else {
        const markerIcon =
          z.name === zone.name && zone.visible
            ? 'https://cdn3.iconfinder.com/data/icons/musthave/32/Stock%20Index%20Down.png'
            : '';
        z.info.overlay.setIcon(markerIcon);
      }
    });
    // TODO: IMPORTANTE!!, por qué fue necesario esto!!!?? :( :(
    this.cd.detectChanges();
    this.selectedZone = zone.name;
  }

  noSelectedZone() {
    this.definedZones.forEach((z) => {
      if (z.type !== google.maps.drawing.OverlayType.MARKER) {
        z.info.overlay.setEditable(false);
      } else {
        z.info.overlay.setIcon();
      }
    });
    this.selectedZone = '';
    this.cd.detectChanges();
  }

  private loadGoogleMapsApi() {
    const { gmKey } = this.settings;
    this.apiLoaded = this.httpClient
      .jsonp(`https://maps.googleapis.com/maps/api/js?key=${gmKey}&libraries=drawing`, 'callback')
      .pipe(
        map(() => {
          this.gmOptions = {
            center: { lat: -33.031, lng: -55.932 },
            zoom: 5,
            mapTypeId: 'satellite',
            scaleControl: false,
            disableDefaultUI: true,
            zoomControl: true,
            fullscreenControl: true,
            fullscreenControlOptions: { position: google.maps.ControlPosition.BOTTOM_RIGHT },
            keyboardShortcuts: false,
          };
          return true;
        }),
        catchError(() => of(false))
      );
  }

  private initDrawingManager(gm: GoogleMap) {
    gm.googleMap.addListener('click', () => {
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
            google.maps.drawing.OverlayType.RECTANGLE,
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
      this.drawingManager.setMap(gm.googleMap);
      this.mapInstance = gm;
      google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event) => {
        const name = this.getZoneName();

        const zone = {
          name,
          type: event.type,
          visible: true,
          info: event, // { ...event.overlay, name },
          coordinates: this.getCoordinates(event.overlay),
        };

        if (event.type === google.maps.drawing.OverlayType.MARKER) {
          zone.info.overlay.setIcon(this.activeMarkerIcon);
        }
        this.selectZone(zone);
        this.definedZones.push(zone);
        google.maps.event.addListener(zone.info.overlay, 'click', () => {
          this.selectZone(zone);
          if (zone.type === google.maps.drawing.OverlayType.MARKER) {
            zone.info.overlay.setIcon(this.activeMarkerIcon);
          }
        });
      });
    }
  }

  private loadLayers(gm: GoogleMap) {
    if (this.mapLayers.length === 0) {
      this.apiService.getInformationLayers().then((layers) => {
        layers.forEach((layer) => {
          this.mapLayers.push({ ...layer, isVisible: layer.label === 'ROU', isEditable: layer.label !== 'ROU' });
          if (layer.label === 'ROU') {
            this.addLayer(layer);
          }
        });
        // Create angular element to manage layers
        const containerEl = document.getElementById('containerLayers');
        const layersElement: NgElement & WithProperties<MapLayersComponent> = document.createElement(
          'app-map-layers'
        ) as any;

        layersElement.addEventListener('changeLayer', (event: any) => {
          if (event.detail.action === 'SHOW') {
            this.addLayer(event.detail.layer);
          } else {
            this.hideLayer(event.detail.layer);
          }
        });

        layersElement.mapLayers = this.mapLayers;

        // Add to the DOM
        containerEl.innerHTML = '';
        containerEl.appendChild(layersElement);
        gm.googleMap.controls[google.maps.ControlPosition.TOP_RIGHT].push(containerEl);
      });
    }
  }

  private addLayer(layer: GEEMapLayerModel) {
    const index = this.mapLayers.findIndex((l) => l.label === layer.label);
    this.mapLayers[index].visible = true;
    const source = new ee.layers.EarthEngineTileSource({ mapid: layer.mapId });
    const overlay = new ee.layers.ImageOverlay(source);
    overlay.name = layer.label;
    this.mapInstance.googleMap.overlayMapTypes.push(overlay);
  }

  private hideLayer(layer: GEEMapLayerModel) {
    const mapIndex = this.mapLayers.findIndex((l) => l.label === layer.label);
    this.mapLayers[mapIndex].visible = false;
    const index = this.mapInstance.googleMap.overlayMapTypes
      .getArray()
      .findIndex((overlay) => overlay.name === layer.label);
    this.mapInstance.googleMap.overlayMapTypes.removeAt(index);
  }

  private getZoneName() {
    const zoneName = 'ZONA-';
    let max = 1;
    this.definedZones.forEach((zone) => {
      const parts = zone.name.split(zoneName);
      // eslint-disable-next-line no-restricted-globals
      if (parts.length === 2 && !isNaN(+parts[1])) {
        max = max <= +parts[1] ? +parts[1] + 1 : max;
      }
    });
    return `${zoneName}${max}`;
  }

  // eslint-disable-next-line class-methods-use-this
  private getCoordinates(gmOverlay) {
    const coordinates = [];
    // console.log(gmOverlay.bounds);
    // const bounds = gmOverlay.getBounds();
    // const NE = bounds.getNorthEast();
    // const SW = bounds.getSouthWest();
    // // North West
    // const NW = new google.maps.LatLng(NE.lat(), SW.lng());
    // // South East
    // const SE = new google.maps.LatLng(SW.lat(), NE.lng());
    // gmOverlay
    //   .getPath()
    //   .getArray()
    //   .forEach((coor) => {
    //     coordinates.push(coor.toJSON());
    //   });
    // coordinates.push(NE.toJSON());
    // coordinates.push(SW.toJSON());
    // coordinates.push(NW.toJSON());
    // coordinates.push(SE.toJSON());
    // console.log(coordinates);

    return coordinates;
  }
}
