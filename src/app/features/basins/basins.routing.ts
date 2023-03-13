import { PathMatch } from '@app/common/models/pathMatch.type';
import { BasinPageComponent } from './pages/basin/basin.component';
import { BasinsPageComponent } from './pages/basins/basins.component';

export const BasinsRoutes = [
  {
    path: '',
    component: BasinsPageComponent,
    pathMatch: 'full' as PathMatch,
  },
  {
    path: ':id',
    component: BasinPageComponent,
    pathMath: 'full' as PathMatch,
    data: { breadcrumb: 'Cuenca Seleccionada' },
  },
];
