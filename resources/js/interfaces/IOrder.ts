import IUser from "./IUser";
import IMenu from "./IMenu";
import IOrderMenu from "./IOrderMenu";
import IOrderExtra from "./IOrderExtra";

export default interface IOrder {
  id: number;
  date: string;
  status: string;
  total_price: number;
  user_id: number;
  User: IUser;
  order_menus: IOrderMenu[];
  order_extras: IOrderExtra[];
  created_at: string;
  updated_at: string;
  menus?: IMenu[];
  extras?: any[];
  is_carried_away: boolean;
  is_delivered: boolean;
  is_paid: boolean;
  payment_method?: string;
  notes?: string;
  delivery_address?: string;
  delivery_time?: string;
}
