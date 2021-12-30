import { SpecieModel } from './specie.model';

export type SubCommunityModel = {
  id: string;
  order: string;
  predominantSpecies: SpecieModel[];
  indicatorSpecies: SpecieModel[];
  imageUrls?: string[];
};
