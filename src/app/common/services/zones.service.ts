/* eslint-disable no-underscore-dangle */
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { ZoneModel } from '../models/zone.model';
import { ApiService } from './api.service';

export const ZONES_SERVICE_CONTEXT = new InjectionToken<string>('ZonesServiceContext');

@Injectable({
  providedIn: 'root',
})
export class ZonesService {
  // TODO: Move to config
  public inactiveMarkerIcon: string = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';

  // 'https://cdn3.iconfinder.com/data/icons/musthave/32/Stock%20Index%20Down.png';
  // TODO: Move to config
  public activeMarkerIcon: string = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';

  private _zones: BehaviorSubject<ZoneModel[]> = new BehaviorSubject<ZoneModel[]>(null);

  private zones: ZoneModel[] = [];

  private _selectedZone: BehaviorSubject<string> = new BehaviorSubject<string>('');

  private selectedZone: string = '';

  // private _viewLayer: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(@Inject(ZONES_SERVICE_CONTEXT) private storageKey: string, private apiService: ApiService) {
    this.loadZones();
  }

  loadZones() {
    this.zones = [];
    const storageZones = this.getStorageZones();
    storageZones.forEach((sz) => {
      const shape = this.createShape(sz.name, sz.type, sz.coordinates);
      const zone = {
        id: sz.id,
        name: sz.name,
        type: sz.type,
        visible: sz.visible,
        shape,
        properties: sz.properties || [],
      };
      this.zones.push(zone);
    });
    this._zones.next(this.zones);
  }

  getZones(): Observable<ZoneModel[]> {
    return this._zones.asObservable();
  }

  // getViewLayer(): Observable<string> {
  //   return this._viewLayer.asObservable();
  // }

  getSelectedZone(): Observable<string> {
    return this._selectedZone.asObservable();
  }

  getZone(zoneId: string) {
    const index = this.zones.findIndex((z) => z.id === zoneId);
    return index >= 0 ? this.zones[index] : undefined;
  }

  // eslint-disable-next-line class-methods-use-this
  importZones(zones) {
    zones.forEach((zone) => {
      const { zoneName, zoneType, zoneCoordinates, zoneProperties } = this.getImportedZoneData(zone);
      const zoneShape = this.createShape(zoneName, zoneType, zoneCoordinates, true);
      const importedZone = {
        id: uuidv4(),
        name: zoneName || this.generateZoneName(),
        type: zoneType,
        visible: true,
        shape: zoneShape,
        properties: zoneProperties || [],
      };

      this.zones.push(importedZone);
      this._zones.next(Object.assign([], this.zones));
      this.addStorageZone(importedZone);
    });
  }

  getImportedZoneData(zone) {
    const zoneProperties = [];
    Object.keys(zone.properties).forEach((key) => {
      zoneProperties.push({
        propertyName: key,
        propertyValue: zone.properties[key],
      });
    });
    return {
      zoneName: this.generateZoneName(),
      zoneType:
        zone.geometry.type === 'Polygon'
          ? google.maps.drawing.OverlayType.POLYGON
          : google.maps.drawing.OverlayType.MARKER,
      zoneCoordinates:
        zone.geometry.type === 'Polygon'
          ? this.getPolygonCoordinates(zone.geometry.coordinates)
          : this.getMarkerCoordinates(zone.geometry.coordinates),
      zoneProperties,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  getPolygonCoordinates(featureCoordinates) {
    // TODO: Only simple polygon is supported
    return featureCoordinates[0].map((c) => ({
      lat: c[1],
      lng: c[0],
    }));
  }

  // eslint-disable-next-line class-methods-use-this
  getMarkerCoordinates(featureCoordinates) {
    return {
      lat: featureCoordinates[1],
      lng: featureCoordinates[0],
    };
  }

  addZone(gmZone) {
    const id = uuidv4();
    const name = this.generateZoneName();
    const coordinates = this.getOverlayCoordinates(gmZone);
    const shape = this.createShape(name, gmZone.type, coordinates, true);
    const zone = {
      id,
      name,
      type: gmZone.type,
      visible: true,
      shape,
      properties: [],
    };

    this.zones.push(zone);
    this._zones.next(Object.assign([], this.zones));
    this.addStorageZone(zone);
    this.selectZone(zone.name);
  }

  selectZone(zoneName: string) {
    this.zones.forEach((z) => {
      if (z.type !== google.maps.drawing.OverlayType.MARKER) {
        z.shape.setEditable(z.name === zoneName && z.visible);
        const options = {
          fillColor: z.name === zoneName && z.visible ? '#6991FC' : '#DB2826',
          fillOpacity: z.name === zoneName && z.visible ? 1 : 0.8,
          strokeWeight: z.name === zoneName && z.visible ? 2 : 0.5,
        };
        z.shape.setOptions(options);
      } else {
        const markerIcon = z.name === zoneName && z.visible ? this.activeMarkerIcon : this.inactiveMarkerIcon;
        z.shape.setIcon(markerIcon);
      }
      z.shape.setDraggable(z.name === zoneName && z.visible);
    });
    this.selectedZone = zoneName;
    this._selectedZone.next(this.selectedZone);
  }

  noSelectedZone() {
    this.zones.forEach((z) => {
      if (z.type !== google.maps.drawing.OverlayType.MARKER) {
        z.shape.setEditable(false);
        const options = {
          fillColor: '#DB2826',
          fillOpacity: 0.8,
          strokeWeight: 0.5,
        };
        z.shape.setOptions(options);
      } else {
        z.shape.setIcon(this.inactiveMarkerIcon);
      }
      z.shape.setDraggable(false);
    });
    this.selectedZone = '';
    this._selectedZone.next(this.selectedZone);
  }

  removeZone(zoneName) {
    const index = this.zones.findIndex((z) => z.name === zoneName);
    if (index >= 0) {
      if (this.zones[index].shape) {
        this.zones[index].shape.setMap(null);
      }
      this.zones.splice(index, 1);
      this._zones.next(Object.assign([], this.zones));
      this.removeStorageZone(zoneName);
    }
  }

  hideZone(zoneName: string) {
    const index = this.zones.findIndex((z) => z.name === zoneName);
    this.zones[index].visible = false;
    this._zones.next(Object.assign([], this.zones));
    if (zoneName === this.selectedZone) {
      this.selectedZone = '';
      this._selectedZone.next(this.selectedZone);
    }
  }

  showZone(zoneName: string) {
    const index = this.zones.findIndex((z) => z.name === zoneName);
    this.zones[index].visible = true;
    this._zones.next(Object.assign([], this.zones));
    this.selectZone(zoneName);
  }

  generateZoneName() {
    const zoneName = 'ZONA-';
    let max = 1;
    this.zones.forEach((zone) => {
      const parts = zone.name.split(zoneName);
      // eslint-disable-next-line no-restricted-globals
      if (parts.length === 2 && !isNaN(+parts[1])) {
        max = max <= +parts[1] ? +parts[1] + 1 : max;
      }
    });
    return `${zoneName}${max}`;
  }

  getZoneInformation(zoneId: string) {
    const zone = this.getZone(zoneId);
    if (!zone) {
      throw new Error('No defined Zone');
    }

    return this.apiService.getZoneInformation({
      type: zone.type,
      coordinates: this.getZoneCoordinatesList(zoneId),
    });
  }

  getZoneAnnualPPNAMean(zoneId) {
    const zone = this.getZone(zoneId);
    if (!zone) {
      throw new Error('No defined Zone');
    }
    return this.apiService.getZoneAnnualPPNAMean({
      type: zone.type,
      coordinates: this.getZoneCoordinatesList(zoneId),
    });
  }

  // TODO: Define year range (2001 - Current Year)
  getZoneAnnualPPNA(zoneId, year) {
    const zone = this.getZone(zoneId);
    if (!zone) {
      throw new Error('No defined Zone');
    }
    return this.apiService.getZoneAnnualPPNA(
      {
        type: zone.type,
        coordinates: this.getZoneCoordinatesList(zoneId),
      },
      year
    );
  }

  getZoneHistoricalPPNA(zoneId: string) {
    const zone = this.getZone(zoneId);
    if (!zone) {
      throw new Error('Zone not defined');
    }

    return this.apiService.getZoneHistoricalPPNA({
      type: zone.type,
      coordinates: this.getZoneCoordinatesList(zoneId),
    });
  }

  // #region Private Methods
  private createShape(zoneName, zoneType, coordinates, isActive = false) {
    if (zoneType === google.maps.drawing.OverlayType.MARKER) {
      const marker = this.createMarker(coordinates, isActive);
      marker.addListener('dragend', () => {
        this.updateStorageZone(zoneName);
      });
      marker.addListener('click', () => {
        this.selectZone(zoneName);
      });
      // allow right-click deletion
      marker.addListener('rightclick', () => {
        if (zoneName === this.selectedZone) {
          this.removeZone(zoneName);
        } else {
          this.selectZone(zoneName);
        }
      });
      // marker.addListener('dblclick', () => {
      //   if (zoneName === this.selectedZone) {
      //     const index = this.zones.findIndex((zone) => zone.name === zoneName);
      //     this._viewLayer.next(this.zones[index].id);
      //   }
      // });
      return marker;
    }

    if (zoneType === google.maps.drawing.OverlayType.POLYGON) {
      const polygon = this.createPolygon(coordinates);
      polygon.getPath().addListener('insert_at', () => {
        this.updateStorageZone(zoneName);
      });
      polygon.getPath().addListener('set_at', () => {
        this.updateStorageZone(zoneName);
      });
      polygon.getPath().addListener('remove_at', () => {
        this.updateStorageZone(zoneName);
      });
      polygon.addListener('dragend', () => {
        this.updateStorageZone(zoneName);
      });
      polygon.addListener('click', () => {
        this.selectZone(zoneName);
      });
      polygon.addListener('rightclick', (e) => {
        if (polygon.getEditable()) {
          if (e.vertex === undefined) return;
          if (polygon.getPath().getLength() > 3) {
            polygon.getPath().removeAt(e.vertex);
          } else {
            this.removeZone(zoneName);
          }
        }
      });
      // polygon.addListener('dblclick', () => {
      //   if (zoneName === this.selectedZone) {
      //     const index = this.zones.findIndex((zone) => zone.name === zoneName);
      //     this._viewLayer.next(this.zones[index].id);
      //   }
      // });
      return polygon;
    }

    if (zoneType === google.maps.drawing.OverlayType.RECTANGLE) {
      const rectangle = this.createRectangle(coordinates);
      rectangle.addListener('bounds_changed', () => {
        this.updateStorageZone(zoneName);
      });
      rectangle.addListener('dragend', () => {
        this.updateStorageZone(zoneName);
      });
      rectangle.addListener('click', () => {
        this.selectZone(zoneName);
      });
      rectangle.addListener('rightclick', () => {
        if (rectangle.getEditable()) {
          this.removeZone(zoneName);
        }
      });
      // rectangle.addListener('dblclick', () => {
      //   if (zoneName === this.selectedZone) {
      //     const index = this.zones.findIndex((zone) => zone.name === zoneName);
      //     this._viewLayer.next(this.zones[index].id);
      //     this._viewLayer.next('');
      //   }
      // });
      return rectangle;
    }
    return null;
  }

  // eslint-disable-next-line class-methods-use-this
  private createMarker(position, isActive = false) {
    return new google.maps.Marker({
      position,
      icon: isActive ? this.activeMarkerIcon : this.inactiveMarkerIcon,
      draggable: false,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private createPolygon(paths) {
    return new google.maps.Polygon({
      paths,
      draggable: false,
      strokeWeight: 0.5,
      fillOpacity: 0.8,
      fillColor: '#DB2826',
      strokeColor: '#FFF',
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private createRectangle(bounds) {
    return new google.maps.Rectangle({
      bounds,
      draggable: false,
      strokeWeight: 0.5,
      fillOpacity: 0.8,
      fillColor: '#DB2826',
      strokeColor: '#FFF',
    });
  }

  // #region STORAGE
  private getStorageZones() {
    const zones = localStorage.getItem(this.storageKey);
    return zones ? JSON.parse(zones) : [];
  }

  private addStorageZone(zone) {
    const zones = this.getStorageZones();
    zones.push(this.createStorageZone(zone));
    this.saveStorageZones(zones);
  }

  private updateStorageZone(zoneName) {
    const zone = this.zones.find((z) => z.name === zoneName);
    const storageZones = this.getStorageZones();
    const index = storageZones.findIndex((z) => z.name === zoneName);
    storageZones[index].coordinates = this.getShapeCoordinates(zone.type, zone.shape);
    this.saveStorageZones(storageZones);
  }

  private removeStorageZone(zoneName) {
    const zones = this.getStorageZones();
    const index = zones.findIndex((z) => z.name === zoneName);
    if (index >= 0) {
      zones.splice(index, 1);
      this.saveStorageZones(zones);
    }
  }

  private saveStorageZones(zones) {
    localStorage.setItem(this.storageKey, JSON.stringify(zones));
  }

  private createStorageZone(zone) {
    return {
      id: zone.id,
      name: zone.name,
      type: zone.type,
      visible: zone.visible,
      coordinates: this.getShapeCoordinates(zone.type, zone.shape),
      properties: zone.properties || [],
    };
  }
  // #endregion

  // eslint-disable-next-line class-methods-use-this
  private getShapeCoordinates(zoneType, shape) {
    switch (zoneType) {
      case 'marker': {
        return shape.getPosition();
      }
      case 'rectangle': {
        return shape.getBounds();
      }
      case 'polygon': {
        return shape.getPath().getArray();
      }
      default: {
        throw new Error('Solo Poligonos, Rectangulos y Marcadores son soportados');
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private getOverlayCoordinates(gmOverlay) {
    switch (gmOverlay.type) {
      case 'marker': {
        return this.getOverlayMarkerCoordinates(gmOverlay.overlay);
      }
      case 'rectangle': {
        return this.getOverlayRectangleCoordinates(gmOverlay.overlay);
      }
      case 'polygon': {
        return this.getOverlayPolygonCoordinates(gmOverlay.overlay);
      }
      default: {
        throw new Error('Solo Poligonos, Rectangulos y Marcadores son soportados');
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private getOverlayMarkerCoordinates(marker) {
    return new google.maps.LatLng(marker.position.lat(), marker.position.lng());
  }

  // eslint-disable-next-line class-methods-use-this
  private getOverlayRectangleCoordinates(rectangle) {
    return rectangle.getBounds();
    // const coordinates = [];

    // const bounds = {
    //   north: path[0].lat,
    //   south: path[1].lat,
    //   east: path[0].lng,
    //   west: path[1].lng,
    // };
    // const NE = bounds.getNorthEast();
    // const SW = bounds.getSouthWest();
    // const NW = new google.maps.LatLng(NE.lat(), SW.lng());
    // const SE = new google.maps.LatLng(SW.lat(), NE.lng());
    // coordinates.push(NE.toJSON());
    // coordinates.push(SW.toJSON());
    // coordinates.push(NW.toJSON());
    // coordinates.push(SE.toJSON());
    // return coordinates;
  }

  // eslint-disable-next-line class-methods-use-this
  private getOverlayPolygonCoordinates(polygon) {
    const coordinates = [];
    polygon
      .getPath()
      .getArray()
      .forEach((coor) => {
        coordinates.push(coor.toJSON());
      });
    return coordinates;
  }

  private getZoneCoordinatesList(zoneId: string) {
    const zone = this.getZone(zoneId);
    const coordinates = this.getShapeCoordinates(zone.type, zone.shape);
    // eslint-disable-next-line default-case
    switch (zone.type) {
      case 'marker':
        return this.getMarkerCoodinatesList(coordinates);
      case 'polygon':
        return this.getPolygonCoordinatesList(coordinates);
      case 'rectangle':
        return this.getReactangleCoordinatesList(coordinates);
    }
    return [];
  }

  // eslint-disable-next-line class-methods-use-this
  private getMarkerCoodinatesList(coordinates) {
    return [coordinates.lng(), coordinates.lat()];
    // return [-55.59084933038717, -33.57749649064163];
  }

  // eslint-disable-next-line class-methods-use-this
  private getPolygonCoordinatesList(coordinates) {
    const result = [];
    coordinates.forEach((coord) => {
      result.push(coord.lng(), coord.lat());
    });
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  private getReactangleCoordinatesList(coordinates) {
    // NOTE: JSON stringify convert to  north, east, south, west :O
    const coords = JSON.parse(JSON.stringify(coordinates));
    return [coords.north, coords.west, coords.south, coords.west, coords.south, coords.east, coords.north, coords.east];
  }

  // #endregion
}
