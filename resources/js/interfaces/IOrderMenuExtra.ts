import IExtra from "./IExtra";
import IOrderMenu from "./IOrderMenu";

export default interface IOrderMenuExtra {
  id: number;
  order_menu_id: number;
  extra_id: number;
  created_at: string;
  updated_at: string;
  order_menu?: IOrderMenu;
  extra?: IExtra;
} 