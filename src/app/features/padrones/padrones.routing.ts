import { PathMatch } from '@app/common/models/pathMatch.type';
import { PadronesPageComponent } from './pages/padrones/padrones.component';
import { PadronPageComponent } from './pages/padron/padron.component';

export const PadronesRoutes = [
  {
    path: '',
    component: PadronesPageComponent,
    pathMatch: 'full' as PathMatch,
  },
  {
    path: ':id',
    component: PadronPageComponent,
    pathMath: 'full' as PathMatch,
    data: { breadcrumb: 'Padrón Seleccionado' },
  },
];
