import { Component, OnInit, AfterViewInit, Input, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
import { MenuService } from '../menu.service';

@Component({
  selector: 'app-vertical-menu',
  templateUrl: './vertical-menu.component.html',
  styleUrls: ['./vertical-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MenuService],
})
export class VerticalMenuComponent implements OnInit, AfterViewInit {
  @Input() menuItems;

  @Input() menuParentId;

  @Output() clickMenuItem: EventEmitter<any> = new EventEmitter<any>();

  parentMenu: Array<any>;

  public settings: Settings;

  constructor(public appSettings: AppSettings, public menuService: MenuService, public router: Router) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit(): void {
    this.parentMenu = this.menuItems.filter((item) => item.parentId === this.menuParentId);
  }

  ngAfterViewInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.settings.fixedHeader) {
          const mainContent = document.getElementById('main-content');
          if (mainContent) {
            mainContent.scrollTop = 0;
          }
        } else {
          document.getElementsByClassName('mat-drawer-content')[0].scrollTop = 0;
        }
      }
    });
  }

  onClick(menuId) {
    this.menuService.toggleMenuItem(menuId);
    this.menuService.closeOtherSubMenus(this.menuItems, menuId);
    this.clickMenuItem.emit(menuId);
  }
}
