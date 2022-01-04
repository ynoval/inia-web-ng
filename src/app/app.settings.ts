import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Settings } from '@app/app.settings.model';

@Injectable()
export class AppSettings {
  public settings = new Settings(
    'Pastizales ROU', // theme name
    true, // loadingSpinner
    true, // fixedHeader
    true, // sidenavIsOpened
    true, // sidenavIsPinned
    true, // sidenavUserBlock
    'vertical', // horizontal was removed
    'default', // default, compact, mini
    'indigo-light', // indigo-light, teal-light, red-light, blue-dark, green-dark, pink-dark
    false, // true = rtl, false = ltr
    true, // true = has footer, false = no footer
    environment.apiUrl,
    environment.gmKey
  );
}
