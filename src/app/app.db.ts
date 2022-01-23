import Dexie, { Table } from 'dexie';

export interface StoreZone {
  id: string;
  name: string;
  order: number;
  visible: boolean;
  type: google.maps.drawing.OverlayType;
  coordinates: { lat: number; lng: number }[];
  properties: { propertyName: string; propertyValue: string }[];
}

export class AppDB extends Dexie {
  storeZones!: Table<StoreZone, number>;

  constructor() {
    super('storeZones');
    this.version(3).stores({
      storeZones: '++id, name, order',
    });
    // this.on('populate', () => this.populate());
  }

  async populate() {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    await db.storeZones.bulkAdd([
      {
        id: '7426cdfb-b80e-4d48-be4d-43ac4315cc3c',
        name: 'ZONA-1',
        order: 0,
        type: google.maps.drawing.OverlayType.POLYGON,
        visible: true,
        coordinates: [
          { lat: -31.507389923505194, lng: -56.29198373429219 },
          { lat: -31.519329565161314, lng: -56.291738477862594 },
          { lat: -31.519397591270113, lng: -56.30806524575294 },
          { lat: -31.50743472887474, lng: -56.308153390571924 },
          { lat: -31.50743323135493, lng: -56.307876475546294 },
          { lat: -31.507389923505194, lng: -56.29198373429219 },
        ],
        properties: [
          { propertyName: 'Lote', propertyValue: '2' },
          { propertyName: 'Area', propertyValue: '204.54' },
        ],
      },
    ]);
  }

  async addZone(zone: StoreZone) {
    return this.storeZones.add(zone);
  }

  async deleteZone(zoneName: string) {
    return this.storeZones.where('name').equals(zoneName).delete();
  }

  async hideZone(zoneName: string) {
    return this.storeZones.where('name').equals(zoneName).modify({ visible: false });
  }

  async showZone(zoneName: string) {
    return this.storeZones.where('name').equals(zoneName).modify({ visible: true });
  }

  async updateZoneCoordinates(zoneName: string, coordinates: { lat: number; lng: number }[]) {
    return this.storeZones.where('name').equals(zoneName).modify({ coordinates: coordinates });
  }
}
export const db = new AppDB();
