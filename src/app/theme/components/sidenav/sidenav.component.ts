/* eslint-disable class-methods-use-this */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { MenuService } from '../menu/menu.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MenuService],
})
export class SidenavComponent implements OnInit {
  public userImage = '../assets/img/inia-logo.jpeg';

  public menuItems: Array<any>;

  public settings: Settings;

  constructor(public appSettings: AppSettings, public menuService: MenuService) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit(): void {
    this.menuItems = this.menuService.getVerticalMenuItems();
  }

  public closeSubMenus() {
    const menu = document.getElementById('vertical-menu');
    if (menu) {
      for (let i = 0; i < menu.children[0].children.length; i += 1) {
        const child = menu.children[0].children[i];
        if (child) {
          if (child.children[0].classList.contains('expanded')) {
            child.children[0].classList.remove('expanded');
            child.children[1].classList.remove('show');
          }
        }
      }
    }
  }
}
