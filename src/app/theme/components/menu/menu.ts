import { Menu } from "./menu.model";

export const verticalMenuItems = [
  new Menu(1, "Inicio", "/", null, "dashboard", null, false, 0),
  new Menu(1, "Mis Zonas", "/bookmarkedZones", null, "star", null, false, 0),
  new Menu(2, "Comunidades", '/communities', null, "library_books", null, false, 0),

];