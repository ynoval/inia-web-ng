import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NotificationService } from '@app/common/components/notification/notification.service';
import { AppSettings } from '@app/app.settings';
import { Settings } from '@app/app.settings.model';
import { GoogleMap } from '@angular/google-maps';
import { NgElement, WithProperties } from '@angular/elements';
import { GEEMapLayerModel } from '@app/common/models/geeMapLayer.model';
import { CommunitiesLayersService } from '@app/common/services/communities-layers.service';
import { Router } from '@angular/router';
import { CommunitiesMapLayersComponent } from './communities-map-layers/communities-map-layers.component';

@Component({
  selector: 'app-communities',
  templateUrl: './communities.component.html',
  styleUrls: ['./communities.component.scss'],
})
export class CommunitiesPageComponent implements AfterViewInit {
  public settings: Settings;

  @ViewChild(GoogleMap, { static: false }) mapInstance: GoogleMap;

  public gmOptions: google.maps.MapOptions;

  public mapLayers = [];

  constructor(
    private router: Router,
    private appSettings: AppSettings,
    private notificationService: NotificationService,
    private communitiesLayersService: CommunitiesLayersService
  ) {
    this.settings = this.appSettings.settings;
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
    this.communitiesLayersService.getAll().subscribe((layers) => {
      this.mapLayers = layers;
      if (this.mapInstance) {
        this.setLayers();
      }
      // this.notificationService.snackBar.dismiss();
    });
  }

  private setLayers() {
    if (this.mapLayers && this.mapLayers.length > 0) {
      // Create angular element to manage layers
      const containerEl = document.getElementById('communitiesContainerLayers');
      if (containerEl.childElementCount === 0) {
        const layersElement: NgElement & WithProperties<CommunitiesMapLayersComponent> = document.createElement(
          'app-communities-map-layers'
        ) as any;

        layersElement.addEventListener('changeLayer', (event: any) => {
          if (event.detail.action === 'SHOW') {
            this.showLayer(event.detail.layer);
          } else {
            this.hideLayer(event.detail.layer);
          }
        });
        layersElement.addEventListener('viewLayer', (event: any) => {
          this.router.navigate(['communities/community', event.detail.id]);
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
    this.communitiesLayersService.show(layer);
    this.mapInstance.googleMap.overlayMapTypes.push(layer.overlay);
  }

  private hideLayer(layer: GEEMapLayerModel) {
    this.communitiesLayersService.hide(layer);
    const mapIndex = this.mapLayers.findIndex((l) => l.label === layer.label);
    this.mapLayers[mapIndex].isVisible = false;
    const index = this.mapInstance.googleMap.overlayMapTypes
      .getArray()
      .findIndex((overlay) => overlay.name === layer.label);
    this.mapInstance.googleMap.overlayMapTypes.removeAt(index);
  }
}
