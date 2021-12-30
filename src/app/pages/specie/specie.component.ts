import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpecieModel } from '@app/common/models/specie.model';
import { ApiService } from '@app/common/services/api.service';
import { from, Observable } from 'rxjs';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';

@Component({
  selector: 'app-specie',
  templateUrl: './specie.component.html',
  styleUrls: ['./specie.component.scss'],
})
export class SpeciePageComponent implements OnInit {
  public settings: Settings;

  public id: string;

  public specie$: Observable<SpecieModel>;

  constructor(public appSettings: AppSettings, private route: ActivatedRoute, private apiService: ApiService) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('idSpecie');
    this.specie$ = from(this.apiService.getSpecie(this.id));
  }
}
