import { Inject, Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { ApiService } from '@app/common/services/api.service';
import { ZoneModel } from '@app/common/models/zone.model';

export const CUSTOM_ZONES_SERVICE_CONTEXT = new InjectionToken<string>('CustomZonesServiceContext');

// TODO: Implement Service to move component logic to here
@Injectable({ providedIn: 'root' })
export class CustomZonesService {
  private _zones: BehaviorSubject<ZoneModel[]> = new BehaviorSubject<ZoneModel[]>(null);

  private zones: ZoneModel[] = [];

  constructor(@Inject(CUSTOM_ZONES_SERVICE_CONTEXT) private storageKey: string, private apiService: ApiService) {
    this.loadZones();
  }

  loadZones() {
    // this.apiService.getBasins().then((basins) => {
    //   basins.forEach((basin) => {
    //     const storageBasins = this.getStorageBasins();
    //     this.basins.push(basin);
    //   });
    //   this._basins.next(Object.assign([], this.basins));
    //   // Save to storage
    // });
  }

  getAll(): Observable<ZoneModel[]> {
    return this._zones.asObservable();
  }
}
