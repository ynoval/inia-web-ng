import { PoliceSectionalsPageComponent } from './pages/police-sectionals/police-sectionals.component';
import { PoliceSectionalPageComponent } from './pages/police-sectional/police-sectional.component';
import { PathMatch } from '@app/common/models/pathMatch.type';


export const PoliceSectionalsRoutes = [
  {
    path: '',
    component: PoliceSectionalsPageComponent,
    pathMatch: 'full' as PathMatch,
  },
  {
    path: ':id',
    component: PoliceSectionalPageComponent,
    pathMath: 'full' as PathMatch,
    data: { breadcrumb: 'Seccional Policial Seleccionada' }
  },
];
