import { PathMatch } from '@app/common/models/pathMatch.type';
import { CommunitiesPageComponent } from './pages/communities/communities.component';
import { CommunityPageComponent } from './pages/community/community.component';
import { SpeciePageComponent } from './pages/specie/specie.component';

export const CommunitiesRoutes = [
  {
    path: '',
    component: CommunitiesPageComponent,
    pathMatch: 'full' as PathMatch,
  },
  {
    path: ':id',
    component: CommunityPageComponent,
    pathMath: 'full' as PathMatch,
    data: { breadcrumb: 'Comunidad Seleccionada' },
  },
  {
    path: ':id/specie/:idSpecie',
    component: SpeciePageComponent,
    pathMath: 'full' as PathMatch,
    data: { breadcrumb: 'Especie' },
  },
];
