import { Component } from '@angular/core';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss'],
})
export class InformationComponent {
  public settings: Settings;

  constructor(public appSettings: AppSettings) {
    this.settings = this.appSettings.settings;
  }
}
