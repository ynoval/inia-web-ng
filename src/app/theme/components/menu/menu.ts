import { Menu } from './menu.model';

export const verticalMenuItems = [
  new Menu(1, 'Mis zonas', '/zones', null, 'dashboard', null, false, 0),
  new Menu(2, 'Seccionales Policiales', '/police-sectionals', null, 'local_police', null, false, 0),
  new Menu(3, 'Cuencas', '/basins', null, 'water', null, false, 0),
  new Menu(4, 'Capas', null, null, 'layers', null, true, 0),
  new Menu(41, 'Comunidades', '/communities', null, 'library_books', null, false, 4),
  // new Menu(42, 'Productividad', '/ppna', null, 'grass', null, false, 4),
  // new Menu(43, 'Precipitaciones', '/rainfall', null, 'water_drop', null, false, 4),
  // new Menu(44, 'Temperatura', '/temperature', null, 'thermostat', null, false, 4),
];
