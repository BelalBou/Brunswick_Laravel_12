export default interface IMenuSize {
  id: number;
  name: string;
  name_en: string;
  description: string;
  description_en: string;
  is_active: boolean;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  menus?: any[];
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
