import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  constructor(public appSettings: AppSettings, private route: ActivatedRoute) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('idSpecie');
  }
}
