import { Component, Input, OnInit } from '@angular/core';
import { CommunitiesService } from '@app/common/services/communities.service';

@Component({
  selector: 'app-community-eft-analysis',
  templateUrl: './community-eft-analysis.component.html',
  styleUrls: ['./community-eft-analysis.component.scss'],
})
export class CommunityEFTAnalysisComponent implements OnInit {
  @Input() communityId: string;
  panelOpenState = false;

  isLoading = false;
  eftInformation: any;
  dataSource = []
  displayedColumns: string[] = ['property', 'value'];
  texts = {
    loadingMessage: 'Cargando... ',
  };

  constructor(private communitiesService: CommunitiesService) {}

  ngOnInit(){
    this.isLoading = true;
    this.getData()
  }

  private async getData(){
    this.eftInformation = await this.communitiesService.getZoneEFTInformation(this.communityId);
    this.dataSource = [
      {
        property: "Índice de Shannon",
        value: this.eftInformation.eft,
      }
    ]
    this.isLoading = false;
  }
}

