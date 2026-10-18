// Same values as google.maps.drawing.OverlayType (removed from the Maps JavaScript API in 3.65),
// so zones already stored keep working.
export enum ZoneType {
  MARKER = 'marker',
  POLYGON = 'polygon',
  RECTANGLE = 'rectangle',
}

export type ZoneModel = {
  id: string;
  name: string;
  order: number;
  visible: boolean;
  type: ZoneType;
  shape: any;
  // geometry?: google.maps.Data.Geometry;
  properties?: { propertyName: string; propertyValue: string }[];
};
