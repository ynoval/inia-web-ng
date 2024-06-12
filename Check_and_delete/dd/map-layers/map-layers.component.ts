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

  toggleLayer(event: any) {
    const option = event.options[0]
    const layer = this.mapLayers[option.value];
    this.changeLayer.next({layer, action: option.selected? 'SHOW' : 'HIDE'});
  }

  show() {
    this.showLayers = true
  }

  close() {
    this.showLayers = false
  }
}
