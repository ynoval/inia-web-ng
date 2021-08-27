/* eslint-disable no-underscore-dangle */
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as ee from '@google/earthengine';
import { GEEMapLayerModel } from '../models/geeMapLayer.model';
import { ApiService } from './api.service';

export const LAYERS_SERVICE_CONTEXT = new InjectionToken<string>('LayersServiceContext');

@Injectable({ providedIn: 'root' })
export class LayersService {
  private _layers: BehaviorSubject<GEEMapLayerModel[]> = new BehaviorSubject<GEEMapLayerModel[]>(null);

  private layers: GEEMapLayerModel[] = [];

  constructor(@Inject(LAYERS_SERVICE_CONTEXT) private storageKey: string, private apiService: ApiService) {
    this.loadLayers();
  }

  loadLayers() {
    this.apiService.getInformationLayers().then((layers) => {
      layers.forEach((layer) => {
        const source = new ee.layers.EarthEngineTileSource({ mapid: layer.mapId });
        const overlay = new ee.layers.ImageOverlay(source);
        overlay.name = layer.label;
        const storageLayers = this.getStorageLayers();
        this.layers.push({
          ...layer,
          isVisible: layer.label === 'ROU' || storageLayers.findIndex((l) => l === layer.label) !== -1,
          isEditable: layer.label !== 'ROU',
          overlay,
        });
      });

      this._layers.next(Object.assign([], this.layers));
      // Save to storage
    });
  }

  getAll(): Observable<GEEMapLayerModel[]> {
    return this._layers.asObservable();
  }

  show(layer) {
    const index = this.layers.findIndex((l) => l.id === layer.id);
    this.layers[index].isVisible = true;
    this._layers.next(Object.assign([], this.layers));
    this.addStorageLayer(layer.label);
  }

  hide(layer) {
    const index = this.layers.findIndex((l) => l.id === layer.id);
    this.layers[index].isVisible = false;
    this._layers.next(Object.assign([], this.layers));
    this.removeStorageLayer(layer.label);
  }

  // #region STORAGE
  private getStorageLayers() {
    const zones = localStorage.getItem(this.storageKey);
    return zones ? JSON.parse(zones) : [];
  }

  private addStorageLayer(layerLabel) {
    const layers = this.getStorageLayers();
    layers.push(layerLabel);
    this.saveStorageLayers(layers);
  }

  private removeStorageLayer(layerLabel) {
    const layers = this.getStorageLayers();
    layers.splice(layers.indexOf(layerLabel), 1); // TODO: FIX
    this.saveStorageLayers(layers);
  }

  private saveStorageLayers(layers) {
    localStorage.setItem(this.storageKey, JSON.stringify(layers));
  }
  // #endregion
}
