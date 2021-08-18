import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AppSettings } from './app.settings';
import { Settings } from './app.settings.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public settings: Settings;

  constructor(appSettings: AppSettings, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.settings = appSettings.settings;
    this.matIconRegistry.addSvgIcon(
      'marker',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/marker.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'rectangle',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/rectangle.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'polygon',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/polygon.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'circle',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/circle.svg')
    );
  }
}
