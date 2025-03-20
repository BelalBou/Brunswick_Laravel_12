import IOrder from "./IOrder";
import IMenu from "./IMenu";
import IOrderMenuExtra from "./IOrderMenuExtra";
import IOrderMenuAllergy from "./IOrderMenuAllergy";
import IOrderMenuCategory from "./IOrderMenuCategory";
import IOrderMenuSize from "./IOrderMenuSize";

export default interface IOrderMenu {
  id: number;
  order_id: number;
  quantity: number;
  pricing: string;
  article_not_retrieved: boolean;
  remark: string;
  menu_id: number;
  total_price: number;
  created_at: string;
  updated_at: string;
  order?: IOrder;
  menu?: IMenu;
  extras?: IOrderMenuExtra[];
  allergies?: IOrderMenuAllergy[];
  categories?: IOrderMenuCategory[];
  sizes?: IOrderMenuSize[];
}
