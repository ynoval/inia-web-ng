import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '@app/common/components/notification/notification.service';
import { CommunityModel } from '@app/common/models/community.model';
import { SpecieModel } from '@app/common/models/specie.model';
import { SubCommunityModel } from '@app/common/models/subcommunity.model';
import { ApiService } from '@app/common/services/api.service';

import { from, Observable } from 'rxjs';
import { AppSettings } from '@app/app.settings';
import { Settings } from '@app/app.settings.model';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss'],
})
export class CommunityPageComponent implements OnInit {
  public settings: Settings;

  public id: string;

  public order: string;

  public name: string;

  public community$: Observable<CommunityModel>;

  public subcommunities$: Observable<SubCommunityModel[]>;

  public species$: Observable<SpecieModel[]>;

  ppnaLoaded: boolean = false;

  constructor(
    public appSettings: AppSettings,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.community$ = from(this.apiService.getCommunity(this.id));
    this.community$.subscribe((community) => {
      this.order = community.order;
      this.name = community.name;
    });
    this.subcommunities$ = from(this.apiService.getSubCommunities(this.id));
    this.species$ = from(this.apiService.getCommunitySpecies(this.id));
  }

  // #region Private

  private viewCommunityInfo() {
    this.community$.subscribe(({ link }) => {
      window.open(link, '_blank');
    });
  }

  private tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.index === 1 && !this.ppnaLoaded) {
      // this.loadPPNAInformation().then(() => {
      //   this.ppnaLoaded = true;
      // });
    }
  }

  getCommunityTitle() {
    // return this.order === 'VI' ? this.name : `Comunidad ${this.order} - ${this.name}`;
    return `Comunidad ${this.order} - ${this.name}`;
  }
}
