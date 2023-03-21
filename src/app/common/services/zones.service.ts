import { Inject, Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { ZoneModel } from '../models/zone.model';
import { ApiService } from './api.service';
import { AppDB } from '@app/app.db';

export const ZONES_SERVICE_CONTEXT = new InjectionToken<string>('ZonesServiceContext');
export const ZONES_SERVICE_EDITABLE = new InjectionToken<boolean>('ZonesServiceEditable');

@Injectable({
  providedIn: 'root',
})
export class ZonesService {
  // TODO: Move to config
  public inactiveMarkerIcon: string = 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';

  // 'https://cdn3.iconfinder.com/data/icons/musthave/32/Stock%20Index%20Down.png';
  // TODO: Move to config
  public activeMarkerIcon: string = 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';

  private _zones: BehaviorSubject<ZoneModel[]> = new BehaviorSubject<ZoneModel[]>(null);

  private zones: ZoneModel[] = [];

  private _selectedZone: BehaviorSubject<string> = new BehaviorSubject<string>('');

  private selectedZone: string = '';

  private db: AppDB;

  private isLoading: boolean;

  // private _viewLayer: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    @Inject(ZONES_SERVICE_CONTEXT) private storageKey: string,
    @Inject(ZONES_SERVICE_EDITABLE) private isEditable: boolean,
    private apiService: ApiService
  ) {
    this.db = new AppDB(this.storageKey);
    this.isLoading = true;
    this.isEditable = isEditable;
    this.loadZones();
  }

  async loadZones() {
    this.zones = [];
    const storeZones = await this.db.storeZones.orderBy('order').toArray();

    console.log({ storeZones });

    storeZones.forEach((sz) => {
      const shape = this.createShape(sz.name, sz.type, sz.coordinates);
      const zone = {
        id: sz.id,
        name: sz.name,
        order: sz.order,
        type: sz.type,
        visible: sz.visible,
        shape,
        properties: sz.properties || [],
      };
      this.zones.push(zone);
    });
    this.isLoading = false;
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

  async getZone(zoneId: string) {
    while (this.isLoading) {
      await this.sleep(200);
    }
    const index = this.zones.findIndex((z) => z.id === zoneId);
    return index >= 0 ? this.zones[index] : undefined;
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // eslint-disable-next-line class-methods-use-this
  importZones(zones) {
    const importedZones = [];
    zones.forEach((zone) => {
      // if (zone.geometry.type !== 'GeometryCollection') {
      const { zoneName, zoneType, zoneCoordinates, zoneProperties } = this.getImportedZoneData(zone);
      const zoneShape = this.createShape(zoneName, zoneType, zoneCoordinates, true);
      const importedZone = {
        id: uuidv4(),
        name: zoneName || this.generateZoneName(),
        order: this.generateZoneOrder(),
        type: zoneType,
        visible: true,
        shape: zoneShape,
        properties: zoneProperties || [],
        coordinates: zoneCoordinates,
      };

      this.zones.push(importedZone);
      importedZones.push(importedZone); // this._zones.next(Object.assign([], this.zones));
      // } else {
      //   console.log('Geometry Type', zone.geometry.type);
      // }
    });

    // Save imported Zones to storage
    console.log('imported Zones: ', importedZones.length);
    this.addStorageZones(importedZones);
    this._zones.next(Object.assign([], this.zones));
  }

  addZone(gmZone) {
    const id = uuidv4();
    const name = this.generateZoneName();
    const coordinates = this.getOverlayCoordinates(gmZone);
    const shape = this.createShape(name, gmZone.type, coordinates, true);
    const zone = {
      id,
      name,
      order: this.generateZoneOrder(),
      type: gmZone.type,
      visible: true,
      shape,
      properties: [],
    };

    this.zones.push(zone);
    this._zones.next(Object.assign([], this.zones));
    this.addStorageZone({ ...zone, coordinates });
    this.selectZone(zone.name);
  }

  selectZone(zoneName: string) {
    if (this.selectedZone) {
      const zone = this.zones.find((z) => z.name === this.selectedZone);
      if (zone) {
        if (zone.type !== google.maps.drawing.OverlayType.MARKER) {
          if (this.isEditable) {
            zone.shape.setEditable(false);
          }
          const options = {
            fillColor: '#DB2826',
            fillOpacity: 0.8,
            strokeWeight: 0.5,
          };
          zone.shape.setOptions(options);
        } else {
          const markerIcon = this.inactiveMarkerIcon;
          zone.shape.setIcon(markerIcon);
        }

        zone.shape.setDraggable(false);
      }
    }

    const newSelectedZone = this.zones.find((z) => z.name === zoneName);
    if (newSelectedZone) {
      if (newSelectedZone.type !== google.maps.drawing.OverlayType.MARKER) {
        if (this.isEditable) {
          newSelectedZone.shape.setEditable(true);
        }
        const options = {
          fillColor: '#222aaa',
          fillOpacity: 1,
          strokeWeight: 1,
        };
        newSelectedZone.shape.setOptions(options);
      } else {
        const markerIcon = this.activeMarkerIcon;
        newSelectedZone.shape.setIcon(markerIcon);
      }

      newSelectedZone.shape.setDraggable(this.isEditable);
      this.selectedZone = zoneName;
      this._selectedZone.next(this.selectedZone);
    }
  }

  noSelectedZone() {
    if (this.selectedZone) {
      const zone = this.zones.find((z) => z.name === this.selectedZone);
      if (zone) {
        if (zone.type !== google.maps.drawing.OverlayType.MARKER) {
          if (this.isEditable) {
            zone.shape.setEditable(false);
          }
          const options = {
            fillColor: '#DB2826',
            fillOpacity: 0.8,
            strokeWeight: 0.5,
          };
          zone.shape.setOptions(options);
        } else {
          zone.shape.setIcon(this.inactiveMarkerIcon);
        }
        zone.shape.setDraggable(false);
      }
    }
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
      this.db.deleteZone(zoneName);
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
    this.db.hideZone(zoneName);
  }

  showZone(zoneName: string) {
    const index = this.zones.findIndex((z) => z.name === zoneName);
    this.zones[index].visible = true;
    this._zones.next(Object.assign([], this.zones));
    this.selectZone(zoneName);
    this.db.showZone(zoneName);
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

  private generateZoneOrder() {
    const maxOrder = Math.max(...this.zones.map((o) => o.order), 0);
    return maxOrder + 1;
  }

  async getZoneInformation(zoneId: string) {
    const zone = await this.getZone(zoneId);
    if (!zone) {
      throw new Error('No defined Zone');
    }

    const storeZone = await this.db.storeZones.where('name').equals(zone.name).first();

    if (storeZone.generalInformation) {
      return storeZone.generalInformation;
    }

    return this.apiService
      .getZoneInformation({
        type: zone.type,
        coordinates: this.getZoneCoordinatesList(zone),
      })
      .then((data) => {
        this.db.storeZones.where('name').equals(zone.name).modify({ generalInformation: data });
        return data;
      });
  }

  // #region PPNA
  async getZoneAnnualPPNAMean(zoneId) {
    const zone = await this.getZone(zoneId);
    if (!zone) {
      throw new Error('No defined Zone');
    }
    const storeZone = await this.db.storeZones.where('name').equals(zone.name).first();

    if (storeZone.ppnaMeanInformation) {
      return storeZone.ppnaMeanInformation;
    }

    return this.apiService
      .getZoneAnnualPPNAMean({
        type: zone.type,
        coordinates: this.getZoneCoordinatesList(zone),
      })
      .then((data) => {
        this.db.storeZones.where('name').equals(zone.name).modify({ ppnaMeanInformation: data });
        return data;
      });
  }

  // TODO: Define year range (2001 - Current Year)
  async getZoneAnnualPPNA(zoneId, year) {
    const zone = await this.getZone(zoneId);
    if (!zone) {
      throw new Error('No defined Zone');
    }

    const storeZone = await this.db.storeZones.where('name').equals(zone.name).first();

    const yearPPNAInformation = storeZone.ppnaAnnualInformation?.find((info) => {
      return info.year === year;
    });

    if (yearPPNAInformation) {
      // Return load information
      return yearPPNAInformation;
    }

    return this.apiService
      .getZoneAnnualPPNA(
        {
          type: zone.type,
          coordinates: this.getZoneCoordinatesList(zone),
        },
        year
      )
      .then((data) => {
        const ppnaInfo = storeZone.ppnaAnnualInformation ? storeZone.ppnaAnnualInformation : [];
        ppnaInfo.push(data);
        this.db.storeZones.where('name').equals(zone.name).modify({ ppnaAnnualInformation: ppnaInfo });
        return data;
      });
  }

  async getZoneHistoricalPPNA(zoneId: string) {
    const zone = await this.getZone(zoneId);
    if (!zone) {
      throw new Error('Zone not defined');
    }
    const storeZone = await this.db.storeZones.where('name').equals(zone.name).first();

    if (storeZone.historicalPPNAInformation) {
      // Return load information
      return storeZone.historicalPPNAInformation;
    }

    return this.apiService
      .getZoneHistoricalPPNA({
        type: zone.type,
        coordinates: this.getZoneCoordinatesList(zone),
      })
      .then((data) => {
        this.db.storeZones.where('name').equals(zone.name).modify({ historicalPPNAInformation: data });
        return data;
      });
  }
  // #endregion PPNA

  // #region APAR
  async getZoneAnnualAPARMean(zoneId) {
    const zone = await this.getZone(zoneId);
    if (!zone) {
      throw new Error('No defined Zone');
    }
    const storeZone = await this.db.storeZones.where('name').equals(zone.name).first();

    if (storeZone.aparMeanInformation) {
      return storeZone.aparMeanInformation;
    }

    return this.apiService
      .getZoneAnnualAPARMean({
        type: zone.type,
        coordinates: this.getZoneCoordinatesList(zone),
      })
      .then((data) => {
        this.db.storeZones.where('name').equals(zone.name).modify({ aparMeanInformation: data });
        return data;
      });
  }

  // TODO: Define year range (2001 - Current Year)
  async getZoneAnnualAPAR(zoneId, year) {
    const zone = await this.getZone(zoneId);
    if (!zone) {
      throw new Error('No defined Zone');
    }

    const storeZone = await this.db.storeZones.where('name').equals(zone.name).first();

    const yearAPARInformation = storeZone.aparAnnualInformation?.find((info) => {
      console.log({ info });
      return info.year === year;
    });

    if (yearAPARInformation) {
      // Return load information
      return yearAPARInformation;
    }

    return this.apiService
      .getZoneAnnualAPAR(
        {
          type: zone.type,
          coordinates: this.getZoneCoordinatesList(zone),
        },
        year
      )
      .then((data) => {
        const aparInfo = storeZone.aparAnnualInformation ? storeZone.aparAnnualInformation : [];
        aparInfo.push(data);
        this.db.storeZones.where('name').equals(zone.name).modify({ aparAnnualInformation: aparInfo });
        return data;
      });
  }

  async getZoneHistoricalAPAR(zoneId: string) {
    const zone = await this.getZone(zoneId);
    if (!zone) {
      throw new Error('Zone not defined');
    }
    const storeZone = await this.db.storeZones.where('name').equals(zone.name).first();

    if (storeZone.historicalAPARInformation) {
      // Return load information
      return storeZone.historicalAPARInformation;
    }

    return this.apiService
      .getZoneHistoricalAPAR({
        type: zone.type,
        coordinates: this.getZoneCoordinatesList(zone),
      })
      .then((data) => {
        this.db.storeZones.where('name').equals(zone.name).modify({ historicalAPARInformation: data });
        return data;
      });
  }
  // #endregion APAR

  // #region ET
  async getZoneAnnualETMean(zoneId) {
    const zone = await this.getZone(zoneId);
    if (!zone) {
      throw new Error('No defined Zone');
    }
    const storeZone = await this.db.storeZones.where('name').equals(zone.name).first();

    if (storeZone.etMeanInformation) {
      return storeZone.etMeanInformation;
    }

    return this.apiService
      .getZoneAnnualETMean({
        type: zone.type,
        coordinates: this.getZoneCoordinatesList(zone),
      })
      .then((data) => {
        this.db.storeZones.where('name').equals(zone.name).modify({ etMeanInformation: data });
        return data;
      });
  }

  async getZoneAnnualET(zoneId, year) {
    const zone = await this.getZone(zoneId);
    if (!zone) {
      throw new Error('No defined Zone');
    }

    const storeZone = await this.db.storeZones.where('name').equals(zone.name).first();

    const yearETInformation = storeZone.etAnnualInformation?.find((info) => {
      return info.year === year;
    });

    if (yearETInformation) {
      // Return load information
      return yearETInformation;
    }

    console.log('api service ET');
    return this.apiService
      .getZoneAnnualET(
        {
          type: zone.type,
          coordinates: this.getZoneCoordinatesList(zone),
        },
        year
      )
      .then((data) => {
        const info = storeZone.etAnnualInformation ? storeZone.etAnnualInformation : [];
        info.push(data);
        this.db.storeZones.where('name').equals(zone.name).modify({ etAnnualInformation: info });
        return data;
      });
  }

  async getZoneHistoricalET(zoneId: string) {
    const zone = await this.getZone(zoneId);
    if (!zone) {
      throw new Error('Zone not defined');
    }
    const storeZone = await this.db.storeZones.where('name').equals(zone.name).first();

    if (storeZone.historicalETInformation) {
      // Return load information
      return storeZone.historicalETInformation;
    }

    return this.apiService
      .getZoneHistoricalET({
        type: zone.type,
        coordinates: this.getZoneCoordinatesList(zone),
      })
      .then((data) => {
        this.db.storeZones.where('name').equals(zone.name).modify({ historicalETInformation: data });
        return data;
      });
  }
  // #endregion ET

  // #region RH
  async getZoneAnnualRHMean(zoneId) {
    const zone = await this.getZone(zoneId);
    if (!zone) {
      throw new Error('No defined Zone');
    }
    const storeZone = await this.db.storeZones.where('name').equals(zone.name).first();

    if (storeZone.rhMeanInformation) {
      return storeZone.rhMeanInformation;
    }

    return this.apiService
      .getZoneAnnualRHMean({
        type: zone.type,
        coordinates: this.getZoneCoordinatesList(zone),
      })
      .then((data) => {
        this.db.storeZones.where('name').equals(zone.name).modify({ rhMeanInformation: data });
        return data;
      });
  }

  async getZoneAnnualRH(zoneId, year) {
    const zone = await this.getZone(zoneId);
    if (!zone) {
      throw new Error('No defined Zone');
    }

    const storeZone = await this.db.storeZones.where('name').equals(zone.name).first();

    const yearRHInformation = storeZone.rhAnnualInformation?.find((info) => {
      return info.year === year;
    });

    if (yearRHInformation) {
      return yearRHInformation;
    }

    return this.apiService
      .getZoneAnnualRH(
        {
          type: zone.type,
          coordinates: this.getZoneCoordinatesList(zone),
        },
        year
      )
      .then((data) => {
        const info = storeZone.rhAnnualInformation ? storeZone.rhAnnualInformation : [];
        info.push(data);
        this.db.storeZones.where('name').equals(zone.name).modify({ rhAnnualInformation: info });
        return data;
      });
  }

  async getZoneHistoricalRH(zoneId: string) {
    const zone = await this.getZone(zoneId);
    if (!zone) {
      throw new Error('Zone not defined');
    }
    const storeZone = await this.db.storeZones.where('name').equals(zone.name).first();

    if (storeZone.historicalRHInformation) {
      // Return load information
      return storeZone.historicalRHInformation;
    }

    return this.apiService
      .getZoneHistoricalRH({
        type: zone.type,
        coordinates: this.getZoneCoordinatesList(zone),
      })
      .then((data) => {
        this.db.storeZones.where('name').equals(zone.name).modify({ historicalRHInformation: data });
        return data;
      });
  }
  // #endregion RH

  // #region RH/PPT
  async getZoneAnnualRHPropMean(zoneId) {
    const zone = await this.getZone(zoneId);
    if (!zone) {
      throw new Error('No defined Zone');
    }
    const storeZone = await this.db.storeZones.where('name').equals(zone.name).first();

    if (storeZone.rhPropMeanInformation) {
      return storeZone.rhPropMeanInformation;
    }

    return this.apiService
      .getZoneAnnualRHPropMean({
        type: zone.type,
        coordinates: this.getZoneCoordinatesList(zone),
      })
      .then((data) => {
        this.db.storeZones.where('name').equals(zone.name).modify({ rhPropMeanInformation: data });
        return data;
      });
  }

  async getZoneAnnualRHProp(zoneId, year) {
    const zone = await this.getZone(zoneId);
    if (!zone) {
      throw new Error('No defined Zone');
    }

    const storeZone = await this.db.storeZones.where('name').equals(zone.name).first();

    const yearRHPropInformation = storeZone.rhPropAnnualInformation?.find((info) => {
      return info.year === year;
    });

    if (yearRHPropInformation) {
      return yearRHPropInformation;
    }

    return this.apiService
      .getZoneAnnualRHProp(
        {
          type: zone.type,
          coordinates: this.getZoneCoordinatesList(zone),
        },
        year
      )
      .then((data) => {
        const info = storeZone.rhPropAnnualInformation ? storeZone.rhPropAnnualInformation : [];
        info.push(data);
        this.db.storeZones.where('name').equals(zone.name).modify({ rhPropAnnualInformation: info });
        return data;
      });
  }

  async getZoneHistoricalRHProp(zoneId: string) {
    const zone = await this.getZone(zoneId);
    if (!zone) {
      throw new Error('Zone not defined');
    }
    const storeZone = await this.db.storeZones.where('name').equals(zone.name).first();

    if (storeZone.historicalRHPropInformation) {
      // Return load information
      return storeZone.historicalRHPropInformation;
    }

    return this.apiService
      .getZoneHistoricalRHProp({
        type: zone.type,
        coordinates: this.getZoneCoordinatesList(zone),
      })
      .then((data) => {
        this.db.storeZones.where('name').equals(zone.name).modify({ historicalRHPropInformation: data });
        return data;
      });
  }
  // #endregion RH/PPT

  // #region IOSE
  async getZoneHistoricalIOSE(zoneId: string) {
    const zone = await this.getZone(zoneId);
    if (!zone) {
      throw new Error('Zone not defined');
    }
    const storeZone = await this.db.storeZones.where('name').equals(zone.name).first();

    if (storeZone.ioseInformation) {
      // Return load information
      return storeZone.ioseInformation;
    }

    return this.apiService
      .getZoneHistoricalIOSE({
        type: zone.type,
        coordinates: this.getZoneCoordinatesList(zone),
      })
      .then((data) => {
        this.db.storeZones.where('name').equals(zone.name).modify({ ioseInformation: data });
        return data;
      });
  }
  // #endregion IOSE

  // #region Private Methods
  // eslint-disable-next-line class-methods-use-this
  private getPolygonCoordinates(featureCoordinates) {
    if (featureCoordinates.length > 1) {
      return this.getMultiPolygonCoordinates(featureCoordinates);
    }
    return featureCoordinates[0].map((c) => ({
      lat: c[1],
      lng: c[0],
    }));
  }

  private getMultiPolygonCoordinates(featureCoordinates) {
    const result = [];
    featureCoordinates.forEach((polygonCoordinates) => {
      result.push(polygonCoordinates.map((c) => ({ lat: c[1], lng: c[0] })));
    });
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  private getMarkerCoordinates(featureCoordinates) {
    return {
      lat: featureCoordinates[1],
      lng: featureCoordinates[0],
    };
  }

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
  private async addStorageZones(zones) {
    zones.forEach((z) => {
      this.addStorageZone(z);
    });
  }

  private addStorageZone(zone) {
    const storageZone = this.createStorageZone(zone);
    this.db.addZone(storageZone);
  }

  private updateStorageZone(zoneName) {
    const zone = this.zones.find((z) => z.name === zoneName);
    const shapeCoordinates = this.getShapeCoordinates(zone.type, zone.shape);
    this.db.updateZoneCoordinates(zoneName, this.convertToStorageCoordinates(zone.type, shapeCoordinates));
  }

  private createStorageZone(zone) {
    return {
      id: zone.id,
      name: zone.name,
      order: zone.order,
      type: zone.type,
      visible: zone.visible,
      coordinates: zone.coordinates,
      properties: zone.properties || [],
      generalInformation: null,
      ppnaAnnualInformation: [],
      ppnaMeanInformation: null,
      historicalPPNAInformation: null,
      aparAnnualInformation: [],
      aparMeanInformation: null,
      historicalAPARInformation: null,
      etAnnualInformation: [],
      etMeanInformation: null,
      historicalETInformation: null,
      rhAnnualInformation: [],
      rhMeanInformation: null,
      historicalRHInformation: null,
      rhPropAnnualInformation: [],
      rhPropMeanInformation: null,
      historicalRHPropInformation: null,
      ioseInformation: null,
    };
  }

  private convertToStorageCoordinates(zoneType, coordinates) {
    switch (zoneType) {
      case 'marker': {
        return { lat: coordinates.lat(), lng: coordinates.lng() };
      }
      case 'rectangle':
      case 'polygon': {
        return coordinates.map((c) => {
          return { lat: c.lat(), lng: c.lng() };
        });
      }
      default: {
        throw new Error('Solo Poligonos, Rectangulos y Marcadores son soportados');
      }
    }
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
    //return  new google.maps.LatLng(marker.position.lat(), marker.position.lng());
    return { lat: marker.position.lat(), lng: marker.position.lng() };
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

  private getZoneCoordinatesList(zone) {
    const coordinates = this.getShapeCoordinates(zone.type, zone.shape);
    // eslint-disable-next-line default-case
    switch (zone.type) {
      case 'marker':
        return this.getMarkerCoordinatesList(coordinates);
      case 'polygon':
        return this.getPolygonCoordinatesList(coordinates);
      case 'rectangle':
        return this.getRectangleCoordinatesList(coordinates);
    }
    return [];
  }

  // eslint-disable-next-line class-methods-use-this
  private getMarkerCoordinatesList(coordinates) {
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
  private getRectangleCoordinatesList(coordinates) {
    // NOTE: JSON stringify convert to  north, east, south, west :O
    const coords = JSON.parse(JSON.stringify(coordinates));
    return [coords.north, coords.west, coords.south, coords.west, coords.south, coords.east, coords.north, coords.east];
  }

  private getImportedZoneData(zone) {
    const zoneProperties = [];
    Object.keys(zone.properties).forEach((key) => {
      zoneProperties.push({
        propertyName: key,
        propertyValue: zone.properties[key],
      });
    });
    const isPolygon =
      zone.geometry.type === 'Polygon' ||
      zone.geometry.type === 'MultiPolygon' ||
      zone.geometry.type === 'GeometryCollection';

    console.log('Geometry Coordinates', { coordinates: zone.geometry.coordinates });
    const coordinates = this.getZoneCoordinates(zone);

    return {
      zoneName: zone.name || this.generateZoneName(),
      zoneType: isPolygon ? google.maps.drawing.OverlayType.POLYGON : google.maps.drawing.OverlayType.MARKER,
      zoneCoordinates: isPolygon ? this.getPolygonCoordinates(coordinates) : this.getMarkerCoordinates(coordinates),
      zoneProperties,
    };
  }

  private getZoneCoordinates(zone) {
    if (zone.geometry.type === 'GeometryCollection') {
      return this.getGeometryCollectionCoordinates(zone.geometry.geometries);
    }

    if (zone.geometry.type === 'MultiPolygon') {
      return this.getZoneMultiPolygonCoordinates(zone.geometry.coordinates);
    }

    return zone.geometry.coordinates;
  }

  private getZoneMultiPolygonCoordinates(coordinates) {
    const result = [];
    coordinates.forEach((polyCoordinates) => {
      result.push(...polyCoordinates);
    });
    return result;
  }

  private getGeometryCollectionCoordinates(geometries) {
    const result = [];
    geometries.forEach((geometry) => {
      if (geometry.type !== 'LineString') {
        result.push(...geometry.coordinates);
      }
    });
    console.log('result', result);
    return result;
  }

  // #endregion
}
