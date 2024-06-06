import Dexie, { Table } from 'dexie';

export interface StoreZone {
  id: string;
  name: string;
  order: number;
  visible: boolean;
  type: google.maps.drawing.OverlayType;
  coordinates: { lat: number; lng: number }[];
  properties: { propertyName: string; propertyValue: string }[];
  generalInformation: any;
  // PPNA
  ppnaAnnualInformation: { year: number; values: Array<any> }[];
  ppnaMeanInformation: any;
  historicalPPNAInformation: any;
  // APAR
  aparAnnualInformation: { year: number; values: Array<any> }[];
  aparMeanInformation: any;
  historicalAPARInformation: any;
  // ET
  etAnnualInformation: { year: number; values: Array<any> }[];
  etMeanInformation: any;
  historicalETInformation: any;
  // RH
  rhAnnualInformation: { year: number; values: Array<any> }[];
  rhMeanInformation: any;
  historicalRHInformation: any;
  // RH/PPT
  rhPropAnnualInformation: { year: number; values: Array<any> }[];
  rhPropMeanInformation: any;
  historicalRHPropInformation: any;

  // IOSE
  ioseInformation: any;

  // Mapbiomas
  historicalMapbiomasInformation: any;

  // SOIL
  soilInformation: any;

  // EFT
  eftInformation: any;

  //AHPPN
  ahppnInformation: any;
}

export class AppDB extends Dexie {
  storeZones!: Table<StoreZone, number>;

  constructor(key: string) {
    super(key); //'storeZones');
    this.version(3).stores({
      storeZones: '++id, name, order',
    });
  }

  async addZone(zone: StoreZone) {
    return this.storeZones.add(zone);
  }

  async deleteZone(zoneId: string) {
    return this.storeZones.where('id').equals(zoneId).delete();
  }

  async hideZone(zoneId: string) {
    return this.storeZones.where('id').equals(zoneId).modify({ visible: false });
  }

  async showZone(zoneId: string) {
    return this.storeZones.where('id').equals(zoneId).modify({ visible: true });
  }

  async updateZoneCoordinates(zoneId: string, coordinates: { lat: number; lng: number }[]) {
    return this.storeZones.where('id').equals(zoneId).modify({ coordinates: coordinates });
  }
}
