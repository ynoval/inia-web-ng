import { Component, Input, OnInit } from '@angular/core';
import { ZoneModel } from '@app/common/models/zone.model';
import { ZonesService } from '@app/common/services/zones.service';

@Component({
  selector: 'app-ahppn-analysis',
  templateUrl: './ahppn-analysis.component.html',
  styleUrls: ['./ahppn-analysis.component.scss'],
})
export class AHPPNAnalysisComponent implements OnInit {
  @Input() zone: ZoneModel;
  panelOpenState = false;

  isLoading = false;
  ahppnInformation: any;
  dataSource = []
  displayedColumns: string[] = ['property', 'value'];
  texts = {
    loadingMessage: 'Cargando... ',
  };

  constructor(private zonesService: ZonesService) {}

  ngOnInit(){
    this.isLoading = true;
    this.getData()
  }

  private async getData(){
    this.ahppnInformation = await this.zonesService.getZoneAHPPNInformation(this.zone.id);
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