import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GoogleMapService } from '@app/common/services/google-map.service';
import { AddPadronModalComponent } from './components/add-padron-modal/add-padron-modal.component';
import {
  zoneListDeleteAction,
  zoneListHideAction,
  zoneListShowAction,
  zoneListViewAction,
} from '@app/common/components/zoneList/zoneListCommonActions';
import { ZoneActionType, ZoneListItemModel } from '@app/common/components/zoneList/zoneList.models';
import { PadronesService } from '../../services/padrones.service';
import { Router } from '@angular/router';
import { GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-padrones',
  templateUrl: './padrones.component.html',
  styleUrls: ['./padrones.component.scss'],
})
export class PadronesPageComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) mapInstance: GoogleMap;

  public gmOptions: google.maps.MapOptions;

  searchPlaceholder = 'Filtrar lista de padrones...';

  public padrones = [];

  public padronesZones: ZoneListItemModel[] = [];

  public selectedPadronId: string = '';

  private readonly actionHandlers: Record<ZoneActionType, (arg0: string) => void> = {
    ZONE_DELETE: this.deletePadron.bind(this),
    ZONE_VIEW: this.viewPadron.bind(this),
    ZONE_HIDE: this.hidePadron.bind(this),
    ZONE_SHOW: this.showPadron.bind(this),
  };

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    googleMapService: GoogleMapService,
    public dialog: MatDialog,
    private padronesService: PadronesService
  ) {
    this.gmOptions = googleMapService.getMapOptions();
  }

  ngOnInit(): void {
    this.loadPadrones();
  }

  private loadPadrones() {
    // Load from service
    this.padronesService.getAll().subscribe((padrones) => {
      if (!padrones) return;

      this.padrones = padrones;
      this.reloadPadronesZones();
    });

    // Get selected Zone
    this.padronesService.getSelected().subscribe((padronId) => {
      this.selectedPadronId = padronId;
    });

    // Set Map
    this.padrones.forEach((p) => {
      p.shape.setMap(p.visible ? this.mapInstance.googleMap : null);
    });
    this.cd.detectChanges();
  }

  onSearch(searchText) {
    console.log(searchText);
  }

  onAddPadron(): void {
    const dialogRef = this.dialog.open(AddPadronModalComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.padronesService.addPadron(result);
    });
  }

  onAction($event): void {
    const { zoneId, actionId } = $event;
    try {
      console.log(`actionId: ${actionId} on padron ${zoneId}`);
      const actionFn = this.actionHandlers[actionId];
      actionFn(zoneId);
    } catch (e) {
      console.log(`Invalid Action (${actionId}) error: ${e}`);
    }
  }

  hidePadron(padronId) {
    this.padronesService.hidePadron(padronId);
  }

  showPadron(padronId) {
    this.padronesService.showPadron(padronId);
  }

  viewPadron(padronId) {
    console.log(`View Padron ${padronId}`);
    this.router.navigate(['padrones', padronId]);
  }

  deletePadron(padronId) {
    this.padronesService.deletePadron(padronId);
  }

  onToggleSelect($event) {
    if ($event.zoneId === this.selectedPadronId) {
      this.padronesService.unselectPadron();
      return;
    }

    this.padronesService.selectPadron($event.zoneId);
  }

  reloadPadronesZones() {
    if (this.padrones && this.padrones.length > 0) {
      this.padronesZones = this.padrones.map((p) => {
        return {
          id: p.id,
          name: `Padrón - ${p.padronNumber}`,
          description: p.department,
          // eslint-disable-next-line prettier/prettier
          actions: [
            p.visible ? zoneListHideAction : zoneListShowAction,
            zoneListViewAction,
            zoneListDeleteAction,
          ],
          type: 'POLYGON',
        };
      });
    }
  }
}
