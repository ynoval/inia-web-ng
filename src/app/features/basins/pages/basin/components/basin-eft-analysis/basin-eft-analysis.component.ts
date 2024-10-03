import { Component, Input, OnInit } from '@angular/core';
import { ZoneModel } from '@app/common/models/zone.model';
import { ZonesService } from '@app/common/services/zones.service';

@Component({
  selector: 'app-basin-eft-analysis',
  templateUrl: './basin-eft-analysis.component.html',
  styleUrls: ['./basin-eft-analysis.component.scss'],
})
export class BasinEFTAnalysisComponent implements OnInit {
  @Input() zone: ZoneModel;
  panelOpenState = false;

  isLoading = false;
  eftInformation: any;
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
    this.eftInformation = await this.zonesService.getZoneEFTInformation(this.zone.id);
    this.dataSource = [
      {
        property: "Índice de Shannon",
        value: this.eftInformation.eft,
      }
    ]
    this.isLoading = false;
  }
}
