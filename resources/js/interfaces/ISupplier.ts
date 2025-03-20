import moment from "moment";

export default interface ISupplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_verified: boolean;
  email_verified_at?: string;
  remember_token?: string;
  menus?: any[];
  orders?: any[];
  users?: any[];
  selected_menu?: any;
  selected_extras?: any[];
  selected_allergies?: any[];
  is_selected?: boolean;
  is_carried_away?: boolean;
  is_delivered?: boolean;
  is_paid?: boolean;
  payment_method?: string;
  notes?: string;
  delivery_address?: string;
  delivery_time?: string;
  status?: string;
  total_price?: number;
  user_id?: number;
  order_extras?: any[];
}
