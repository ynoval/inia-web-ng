import { Inject, Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { ApiService } from '@app/common/services/api.service';
import { ZonesService } from '@app/common/services/zones.service';
import { PadronModel } from '../models/padron.model';

export const PADRONES_SERVICE_CONTEXT = new InjectionToken<string>('PadronesServiceContext');

@Injectable({ providedIn: 'root' })
export class PadronesService {
  private padrones$: BehaviorSubject<PadronModel[]> = new BehaviorSubject<PadronModel[]>(null);

  private selectedPadron$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    @Inject(PADRONES_SERVICE_CONTEXT) private storageKey: string,
    private apiService: ApiService,
    private zonesService: ZonesService
  ) {
    this.loadPadrones();
  }

  loadPadrones() {
    this.zonesService.getZones().subscribe((zones) => {
      if (zones === null) {
        return;
      }

      if (zones && zones.length > 0) {
        const padrones = zones.map((z) => {
          const departmentProp = z.properties.find((p) => p.propertyName === 'NOMDEPTO');
          const departmentName = departmentProp ? departmentProp.propertyValue : '';
          return {
            id: z.id,
            padronNumber: z.name.split('-')[1].trim(),
            department: departmentName,
            shape: z.shape,
            visible: z.visible,
          };
        });
        this.padrones$.next(padrones);
      }
    });
    this.zonesService.getSelectedZone().subscribe((zone) => {
      this.selectedPadron$.next(zone);
    });
  }

  getAll(): Observable<PadronModel[]> {
    return this.padrones$.asObservable();
  }

  getSelected(): Observable<string> {
    return this.selectedPadron$.asObservable();
  }

  showPadron(padronId: string) {
    this.zonesService.showZone(padronId);
  }

  hidePadron(padronId: string) {
    this.zonesService.hideZone(padronId);
  }

  deletePadron(padronId: string) {
    this.zonesService.removeZone(padronId);
  }

  selectPadron(padronId: string) {
    this.zonesService.selectZone(padronId);
  }

  unselectPadron() {
    this.zonesService.noSelectedZone();
  }

  async addPadron(padronNumber: string) {
    const padron = await this.apiService.getPadron(padronNumber);
    const importPadron = {
      ...padron,
      name: `Padron - ${padronNumber}`,
    };
    // Import padron via zoneService
    this.zonesService.importZones([importPadron]);
  }
}
