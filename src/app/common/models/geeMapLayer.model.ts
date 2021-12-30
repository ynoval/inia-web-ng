export type GEEMapLayerModel = {
  id: number | string;
  mapId: string;
  urlTemplate: string;
  label: string;
  description?: string;
  isVisible: boolean;
  isEditable: boolean;
  overlay: any;
  properties?: any;
};
