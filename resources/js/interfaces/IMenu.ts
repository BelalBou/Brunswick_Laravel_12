import IOrderMenu from './IOrderMenu';
import IExtra from './IExtra';
import ICategory from './ICategory';
import IMenuSize from './IMenuSize';
import ISupplier from './ISupplier';

/**
 * Interface représentant un menu dans l'application
 */
export default interface IMenu {
  /** Identifiant unique du menu */
  id: number;
  /** Titre du menu */
  title: string;
  /** Prix du menu */
  pricing: number;
  /** Description du menu */
  description: string;
  /** Image du menu */
  image: string;
  /** Indique si le menu est actif */
  is_active: boolean;
  /** Indique si le menu est disponible */
  is_available: boolean;
  /** ID du fournisseur associé */
  supplier_id: number;
  /** ID de la catégorie associée */
  category_id: number;
  /** ID de la taille du menu associée */
  menu_size_id: number;
  /** Relations avec d'autres entités */
  order_menu: IOrderMenu[];
  extras: IExtra[];
  category: ICategory;
  menu_size: IMenuSize;
  supplier: ISupplier;
}
