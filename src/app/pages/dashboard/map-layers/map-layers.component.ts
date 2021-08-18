/* eslint-disable prettier/prettier */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GEEMapLayerModel } from '@app/common/models/geeMapLayer.model';

/**
 * @title Basic menu
 */
@Component({
  selector: 'app-map-layers',
  templateUrl: './map-layers.component.html',
  styleUrls: ['./map-layers.component.scss']
})
export class MapLayersComponent {
  @Input() mapLayers: GEEMapLayerModel[] = [];

  @Output()
  changeLayer = new EventEmitter<{layer: GEEMapLayerModel, action: 'SHOW' | 'HIDE'}>();

  public showLayers: boolean = false;

  toogleLayer(event: any) {
    const layer = this.mapLayers[event.option.value];
    this.changeLayer.next({layer, action: event.option.selected? 'SHOW' : 'HIDE'});
  }

  show() {
    this.showLayers = true
  }

  close() {
    this.showLayers = false
  }
}
