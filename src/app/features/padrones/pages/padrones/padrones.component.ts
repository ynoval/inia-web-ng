import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
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
import { Observable, map, startWith } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Ng2DeepSearchPipe } from '../../pipes/padrones-search.pipe';

@Component({
  selector: 'app-padrones',
  templateUrl: './padrones.component.html',
  styleUrls: ['./padrones.component.scss'],
  providers: [Ng2DeepSearchPipe]
})
export class PadronesPageComponent implements AfterViewInit {
  @ViewChild(GoogleMap, { static: false }) mapInstance: GoogleMap;

  public gmOptions: google.maps.MapOptions;

  searchPlaceholder = 'Filtrar lista de padrones...';


  public filteredZones: ZoneListItemModel[] = [];

  public padrones = [];

  public padronesZones: ZoneListItemModel[] = [];

  public selectedPadronId = '';

  keysToExclude: string[] = ['shape', 'visible', 'coordinates'];

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
    private padronesService: PadronesService,
    private ng2DeepSearchPipe: Ng2DeepSearchPipe
  ) {
    this.gmOptions = googleMapService.getMapOptions();
  }

  ngAfterViewInit(): void {
    this.loadPadrones();
    // Get selected Zone
    this.padronesService.getSelected().subscribe((padronId) => {
      this.selectedPadronId = padronId;
    });
  }

  private loadPadrones() {
    // Load from service
    this.padronesService.getAll().subscribe((padrones) => {
      if (!padrones) return;

      this.padrones = padrones;

      // Set Map
      console.log(`Set Map --> ${this.mapInstance}`)
      this.padrones.forEach((p) => {
        p.shape.setMap(p.visible ? this.mapInstance.googleMap : null);
      });
      this.cd.detectChanges();
      this.reloadPadronesZones();
    });




  }

  onAddPadron(): void {
    const dialogRef = this.dialog.open(AddPadronModalComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.padronesService.addPadron(result.padron, result.department);
    });
  }

  onAction($event): void {
    const { zoneId, actionId } = $event;
    try {
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

  onSearch(text) {
    this.filteredZones = this.ng2DeepSearchPipe.transform(this.padronesZones, text, this.keysToExclude);
  }


}
