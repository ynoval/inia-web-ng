import { ZoneListActionModel } from './zoneList.models';

export const zoneListDeleteAction: ZoneListActionModel = {
  id: 'ZONE_DELETE',
  icon: 'delete',
  confirmAction: true,
  confirmInformation: {
    title: 'Eliminar Padrón',
    question: '¿Estás seguro que deseas eliminar el padrón?',
    width: '250px',
  },
};

export const zoneListHideAction: ZoneListActionModel = {
  id: 'ZONE_HIDE',
  icon: 'visibility_off',
  confirmAction: false,
};

export const zoneListShowAction: ZoneListActionModel = {
  id: 'ZONE_SHOW',
  icon: 'visibility_on',
  confirmAction: false,
};

export const zoneListViewAction: ZoneListActionModel = {
  id: 'ZONE_VIEW',
  icon: 'info',
  confirmAction: false,
};
