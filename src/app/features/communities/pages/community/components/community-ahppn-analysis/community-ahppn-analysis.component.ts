import { Component, Input, OnInit } from '@angular/core';
import { CommunitiesService } from '@app/common/services/communities.service';


@Component({
  selector: 'app-community-ahppn-analysis',
  templateUrl: './community-ahppn-analysis.component.html',
  styleUrls: ['./community-ahppn-analysis.component.scss'],
})
export class CommunityAHPPNAnalysisComponent implements OnInit {
  @Input() communityId: string;
  panelOpenState = false;

  isLoading = false;
  ahppnInformation: any;
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
    this.ahppnInformation = await this.communitiesService.getZoneAHPPNInformation(this.communityId);
    this.dataSource = [
      {
        property: "Promedio",
        value: this.ahppnInformation.mean,
      },
      {
        property: "Mediana",
        value: this.ahppnInformation.median,
      },
      {
        property: "Mínimo",
        value: this.ahppnInformation.min,
      },
      {
        property: "Máximo",
        value: this.ahppnInformation.max,
      },
      {
        property: "Percentil 25",
        value: this.ahppnInformation.p25,
      },
      {
        property: "Percentil 75",
        value: this.ahppnInformation.p75,
      }
    ]
    this.isLoading = false;
  }
}
