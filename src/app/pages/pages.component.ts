import { Component, OnInit, ViewChild, HostListener, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
// import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { AppSettings } from '../app.settings';
import { Settings } from '../app.settings.model';
import { MenuService } from '../theme/components/menu/menu.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  providers: [MenuService],
})
export class PagesComponent implements OnInit, AfterViewInit {
  @ViewChild('sidenav') sidenav: any;

  @ViewChild('backToTop') backToTop: any;

  // @ViewChildren(PerfectScrollbarDirective) pss: QueryList<PerfectScrollbarDirective>;

  public settings: Settings;

  public menuOption: string;

  public menuTypes = ['default', 'compact', 'mini'];

  public menuTypeOption: string;

  public lastScrollTop = 0;

  public showBackToTop = false;

  public toggleSearchBar = false;

  private defaultMenu: string; // declared for return default menu when window resized

  constructor(public appSettings: AppSettings, public router: Router, private menuService: MenuService) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    if (window.innerWidth <= 768) {
      this.settings.menu = 'vertical';
      this.settings.sidenavIsOpened = false;
      this.settings.sidenavIsPinned = false;
    }
    this.menuOption = this.settings.menu;
    this.menuTypeOption = this.settings.menuType;
    this.defaultMenu = this.settings.menu;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.settings.loadingSpinner = false;
    }, 300);
    this.backToTop.nativeElement.style.display = 'none';
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (!this.settings.sidenavIsPinned) {
          this.sidenav.close();
        }
        if (window.innerWidth <= 768) {
          this.sidenav.close();
        }
      }
    });
    if (this.settings.menu === 'vertical') {
      this.menuService.expandActiveSubMenu(this.menuService.getVerticalMenuItems());
    }
  }

  public chooseMenu() {
    this.settings.menu = this.menuOption;
    this.defaultMenu = this.menuOption;
    this.router.navigate(['/']);
  }

  public chooseMenuType() {
    this.settings.menuType = this.menuTypeOption;
  }

  public changeTheme(theme) {
    this.settings.theme = theme;
  }

  public toggleSidenav() {
    this.sidenav.toggle();
  }

  public onPsScrollY(event) {
    if (event.target.scrollTop > 300) {
      this.backToTop.nativeElement.style.display = 'flex';
    } else {
      this.backToTop.nativeElement.style.display = 'none';
    }
  }

  public scrollToTop() {
    // this.pss.forEach((ps) => {
    //   if (ps.elementRef.nativeElement.id === 'main' || ps.elementRef.nativeElement.id === 'main-content') {
    //     ps.scrollToTop(0, 250);
    //   }
    // });
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    if (window.innerWidth <= 768) {
      this.settings.sidenavIsOpened = false;
      this.settings.sidenavIsPinned = false;
      this.settings.menu = 'vertical';
    } else {
      this.settings.menu = 'vertical';
      this.settings.sidenavIsOpened = true;
      this.settings.sidenavIsPinned = true;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public closeSubMenus() {
    const menu = document.querySelector('.sidenav-menu-outer');
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
