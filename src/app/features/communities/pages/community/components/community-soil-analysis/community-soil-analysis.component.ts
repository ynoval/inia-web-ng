import { Component, Input, OnInit } from '@angular/core';
import { CommunitiesService } from '@app/common/services/communities.service';

@Component({
  selector: 'app-community-soil-analysis',
  templateUrl: './community-soil-analysis.component.html',
  styleUrls: ['./community-soil-analysis.component.scss'],
})
export class CommunitySOILAnalysisComponent implements OnInit {
  @Input() communityId: string;
  panelOpenState = false;

  isLoading = false;
  soilInformation: any;
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
    this.soilInformation = await this.communitiesService.getZoneSOILInformation(this.communityId);
    this.dataSource = [
      {
        property: "Promedio",
        value: this.soilInformation.mean,
      },
      {
        property: "Mediana",
        value: this.soilInformation.median,
      },
      {
        property: "Mínimo",
        value: this.soilInformation.min,
      },
      {
        property: "Máximo",
        value: this.soilInformation.max,
      },
      {
        property: "Percentil 25",
        value: this.soilInformation.p25,
      },
      {
        property: "Percentil 75",
        value: this.soilInformation.p75,
      }
    ]
    this.isLoading = false;
  }
}

