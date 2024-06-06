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
        property: "Promedio",
        value: this.eftInformation.mean,
      },
      {
        property: "Mediana",
        value: this.eftInformation.median,
      },
      {
        property: "Mínimo",
        value: this.eftInformation.min,
      },
      {
        property: "Máximo",
        value: this.eftInformation.max,
      },
      {
        property: "Percentil 25",
        value: this.eftInformation.p25,
      },
      {
        property: "Percentil 75",
        value: this.eftInformation.p75,
      }
    ]
    this.isLoading = false;
  }
}

