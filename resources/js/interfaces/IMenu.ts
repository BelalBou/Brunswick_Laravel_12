import IOrderMenu from './IOrderMenu';
import IExtra from './IExtra';
import ICategory from './ICategory';
import IMenuSize from './IMenuSize';
import ISupplier from './ISupplier';
import IAllergy from './IAllergy';

/**
 * Interface représentant un menu dans l'application
 */
export default interface IMenu {
  /** Identifiant unique du menu */
  id: number;
  /** Titre du menu en français */
  title: string;
  /** Titre du menu en anglais */
  title_en: string;
  /** Prix du menu */
  pricing: number;
  /** Description du menu en français */
  description: string;
  /** Description du menu en anglais */
  description_en: string;
  /** Image du menu */
  image: string;
  /** Nom de l'image du menu */
  picture: string;
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
  /** Allergies associées au menu */
  allergies: IAllergy[];
}
