import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { from, Observable } from 'rxjs';

import { AppSettings } from '@app/app.settings';
import { Settings } from '@app/app.settings.model';
import { CommunityModel } from '@app/common/models/community.model';
import { SpecieModel } from '@app/common/models/specie.model';
import { SubCommunityModel } from '@app/common/models/subcommunity.model';
import { CommunitiesService } from '@app/common/services/communities.service';

export interface CommunityInformationModel extends CommunityModel {
  id: string;
  order: string;
  name: string;
  description: string;
  link: string;
  species: SpecieModel[];
  subCommunities: SubCommunityModel[];
}

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

  public communityInformation$: Observable<CommunityInformationModel>;

  public communityInformation: CommunityInformationModel;

  isLoading: boolean = true;

  constructor(
    public appSettings: AppSettings,
    private route: ActivatedRoute,
    private communitiesService: CommunitiesService
  ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isLoading = true;
    this.communityInformation$ = from(this.communitiesService.getCommunityInformation(this.id));
    this.communityInformation$.subscribe((communityInformation) => {
      this.communityInformation = communityInformation;
      this.isLoading = false;
    });
  }

  // #region Private

  private viewCommunityInfo() {
    window.open(this.communityInformation.link, '_blank');
  }

  private getCommunityTitle() {
    return `Comunidad ${this.communityInformation.order} - ${this.communityInformation.name}`;
  }
}
