export default interface IDictionnary {
  id: number;
  key: string;
  value: string;
  value_en: string;
  created_at: string;
  updated_at: string;
  description?: string;
  type?: string;
  group?: string;
  is_public?: boolean;
  is_required?: boolean;
  validation?: string;
  options?: string[];
  default_value?: string;
  order?: number;
  is_active?: boolean;
  is_verified?: boolean;
  email_verified_at?: string;
  remember_token?: string;
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
