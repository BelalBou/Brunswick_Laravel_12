import ICategory from "./ICategory";
import IOrderMenu from "./IOrderMenu";

export default interface IOrderMenuCategory {
  id: number;
  order_menu_id: number;
  category_id: number;
  created_at: string;
  updated_at: string;
  order_menu?: IOrderMenu;
  category?: ICategory;
} 