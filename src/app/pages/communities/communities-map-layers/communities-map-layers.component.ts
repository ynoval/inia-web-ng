/* eslint-disable prettier/prettier */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GEEMapLayerModel } from '@app/common/models/geeMapLayer.model';

/**
 * @title Basic menu
 */
@Component({
  selector: 'app-communities-map-layers',
  templateUrl: './communities-map-layers.component.html',
  styleUrls: ['./communities-map-layers.component.scss']
})
export class CommunitiesMapLayersComponent {
  @Input() mapLayers: GEEMapLayerModel[] = [];

  @Output()
  changeLayer = new EventEmitter<{layer: GEEMapLayerModel, action: 'SHOW' | 'HIDE'}>();

  @Output()
  viewLayer = new EventEmitter<{id: string}>();

  public showLayers: boolean = false;

  toogleLayer(event: any) {
    const layer = this.mapLayers.find( l => l.id === event.option.value);
    this.changeLayer.next({layer, action: event.option.selected? 'SHOW' : 'HIDE'});
  }

  showCommunity(id) {
    this.viewLayer.next({id});
  }

  show() {
    this.showLayers = true
  }

  close() {
    this.showLayers = false
  }
}
