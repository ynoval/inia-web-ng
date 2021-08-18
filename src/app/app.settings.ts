import { Injectable } from '@angular/core';
import { Settings } from './app.settings.model';

@Injectable()
export class AppSettings {
  public settings = new Settings(
    'Pastizales', // theme name
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
    'http://localhost:3333/api',
    'AIzaSyBcvxTFLOtacW2lt0sXn_W6QP1ypNaJIkU'
  );
}
