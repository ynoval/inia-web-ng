export type ZoneModel = {
  id: string;
  name: string;
  order: number;
  visible: boolean;
  type: google.maps.drawing.OverlayType; // 'MARKER' | 'POLYGON' | 'RECTANGLE' ;
  shape: any;
  // geometry?: google.maps.Data.Geometry;
  properties?: { propertyName: string; propertyValue: string }[];
};
