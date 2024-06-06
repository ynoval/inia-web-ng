import { Component, Input, OnInit } from '@angular/core';
import { ZoneModel } from '@app/common/models/zone.model';
import { ZonesService } from '@app/common/services/zones.service';


@Component({
  selector: 'app-police-sectional-soil-analysis',
  templateUrl: './police-sectional-soil-analysis.component.html',
  styleUrls: ['./police-sectional-soil-analysis.component.scss'],
})
export class PoliceSectionalSOILAnalysisComponent implements OnInit {
  @Input() zone: ZoneModel;
  panelOpenState = false;

  isLoading = false;
  soilInformation: any;
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
    this.soilInformation = await this.zonesService.getZoneSOILInformation(this.zone.id);
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
