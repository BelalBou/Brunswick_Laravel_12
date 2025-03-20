import IOrder from "./IOrder";
import IExtra from "./IExtra";

export default interface IOrderExtra {
  id: number;
  order_id: number;
  extra_id: number;
  quantity: number;
  total_price: number;
  created_at: string;
  updated_at: string;
  order?: IOrder;
  extra?: IExtra;
  is_selected?: boolean;
  is_carried_away?: boolean;
  is_delivered?: boolean;
  is_paid?: boolean;
  payment_method?: string;
  notes?: string;
  delivery_address?: string;
  delivery_time?: string;
  status?: string;
  user_id?: number;
  order_extras?: any[];
}
