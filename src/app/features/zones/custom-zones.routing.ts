import { CustomZonesPageComponent } from './pages/custom-zones/custom-zones.component';
import { CustomZonePageComponent } from './pages/custom-zone/custom-zone.component';
import { PathMatch } from '@app/common/models/pathMatch.type';

export const CustomZonesRoutes = [
  {
    path: '',
    component: CustomZonesPageComponent,
    pathMatch: 'full' as PathMatch,
  },
  {
    path: ':id',
    component: CustomZonePageComponent,
    pathMath: 'full' as PathMatch,
    data: { breadcrumb: 'Zona Seleccionada' },
  },
];
