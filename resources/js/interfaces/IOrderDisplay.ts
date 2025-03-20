import React from "react";
import IUser from './IUser';
import IMenu from './IMenu';
import IExtra from './IExtra';
import IAllergy from './IAllergy';

export default interface IOrderDisplay {
  id: number;
  date: string;
  status: string;
  total_price: number;
  user_id: number;
  User: IUser;
  menus: IMenu[];
  extras: IExtra[];
  allergies: IAllergy[];
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
  order_extras?: any[];
}
