import Dexie, { Table } from 'dexie';

export interface StoreCommunity {
  id: string;
  order: string;
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

export class CommunityDB extends Dexie {
  storeCommunities!: Table<StoreCommunity, number>;

  constructor(key: string) {
    super(key); //'storeZones');
    this.version(3).stores({
      storeCommunities: '++id, name, order',
    });
  }

  async addCommunity(community: StoreCommunity) {
    return this.storeCommunities.add(community);
  }

  async deleteZone(communityOrder: string) {
    return this.storeCommunities.where('order').equals(communityOrder).delete();
  }
}
// export const db = new AppDB();
