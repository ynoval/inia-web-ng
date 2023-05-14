import { ConfirmInfoModel } from '@app/common/directives/confirm/confirm.model';

export type ZoneActionType = 'ZONE_DELETE' | 'ZONE_HIDE' | 'ZONE_SHOW' | 'ZONE_VIEW';

export interface ZoneListActionModel {
  id: ZoneActionType;
  icon: string;
  confirmAction: boolean;
  confirmInformation?: ConfirmInfoModel;
}

export interface ZoneListItemModel {
  id: string;
  name: string;
  description: string;
  actions: ZoneListActionModel[];
  type?: string;
}
