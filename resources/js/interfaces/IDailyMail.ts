export default interface IDailyMail {
  id: number;
  subject: string;
  body: string;
  is_sent: boolean;
  sent_at: string;
  created_at: string;
  updated_at: string;
  recipients?: string[];
  cc?: string[];
  bcc?: string[];
  attachments?: string[];
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
