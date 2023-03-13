import { Inject, Injectable, InjectionToken } from '@angular/core';
import { ApiService } from '@app/common/services/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { BasinGradeType, BasinModel } from '../basins.models';

export const BASINS_SERVICE_CONTEXT = new InjectionToken<string>('BasinsServiceContext');

// TODO: Implement Service to move component logic to here
@Injectable({ providedIn: 'root' })
export class BasinsService {
  private _basins: BehaviorSubject<BasinModel[]> = new BehaviorSubject<BasinModel[]>(null);

  private basins: BasinModel[] = [];

  constructor(
    @Inject(BASINS_SERVICE_CONTEXT) private storageKey: string,
    private apiService: ApiService,
    private basinsGrade: BasinGradeType
  ) {
    this.loadBasins();
  }

  loadBasins() {
    // this.apiService.getBasins().then((basins) => {
    //   basins.forEach((basin) => {
    //     const storageBasins = this.getStorageBasins();
    //     this.basins.push(basin);
    //   });
    //   this._basins.next(Object.assign([], this.basins));
    //   // Save to storage
    // });
  }

  getAll(): Observable<BasinModel[]> {
    return this._basins.asObservable();
  }
}
