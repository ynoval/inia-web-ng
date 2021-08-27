export type ZoneModel = {
  id: string;
  name: string;
  visible: boolean;
  // 'MARKER' | 'POLYGON' | 'RECTANGLE' ;
  type: google.maps.drawing.OverlayType;
  // geometry?: google.maps.Data.Geometry;
  shape: any;
  properties?: any;
};
