import IOrderMenu from "./IOrderMenu";
import IMenuSize from "./IMenuSize";

export default interface IOrderMenuSize {
  id: number;
  order_menu_id: number;
  menu_size_id: number;
  created_at: string;
  updated_at: string;
  order_menu?: IOrderMenu;
  menu_size?: IMenuSize;
} 