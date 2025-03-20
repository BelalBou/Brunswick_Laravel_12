import { ReactNode } from "react";
import IMenu from './IMenu';
import IExtra from './IExtra';
import IAllergy from './IAllergy';

export default interface IMenuCarriedAway {
  id: number;
  menu_id: number;
  quantity: number;
  extras: IExtra[];
  allergies: IAllergy[];
  menu: IMenu;
  total_price: number;
  created_at: string;
  updated_at: string;
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
