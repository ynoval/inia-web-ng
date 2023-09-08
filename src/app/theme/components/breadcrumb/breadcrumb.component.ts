import { Component } from '@angular/core';
import { ActivatedRoute, Router, ActivatedRouteSnapshot, UrlSegment, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
  public pageTitle: string;

  public breadcrumbs: {
    name: string;
    url: string;
  }[] = [];

  public settings: Settings;

  public pageSection = 'Zones';

  constructor(
    public appSettings: AppSettings,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public title: Title
  ) {
    this.settings = this.appSettings.settings;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.breadcrumbs = [];
        this.parseRoute(this.router.routerState.snapshot.root);
        this.pageTitle = '';
        this.breadcrumbs.forEach((breadcrumb) => {
          this.pageTitle += ` > ${breadcrumb.name}`;
        });
        this.title.setTitle(this.settings.name + this.pageTitle);
        this.pageSection = this.getPageSection();
      }
    });
  }

  private getPageSection(): string {
    if (this.router.url.startsWith('/communities')) return 'COMMUNITIES';
    if (this.router.url.startsWith('/police-sectionals')) return 'POLICE_SECTIONS';
    if (this.router.url.startsWith('/basins')) return 'BASINS';
    if (this.router.url.startsWith('/padrones')) return 'PADRONES';
    return 'ZONES';
  }

  private parseRoute(node: ActivatedRouteSnapshot) {
    if (node.data.breadcrumb) {
      if (node.url.length) {
        let urlSegments: UrlSegment[] = [];
        node.pathFromRoot.forEach((routerState) => {
          urlSegments = urlSegments.concat(routerState.url);
        });
        const url = urlSegments.map((urlSegment) => urlSegment.path).join('/');
        this.breadcrumbs.push({
          name: node.data.breadcrumb,
          url: `/${url}`,
        });
      }
    }
    if (node.firstChild) {
      this.parseRoute(node.firstChild);
    }
  }

  public showNavigator() {
    return this.router.url.match(/\//g).length !== 1;
  }
}
