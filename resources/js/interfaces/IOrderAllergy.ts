import IAllergy from "./IAllergy";
import IOrder from "./IOrder";

export default interface IOrderAllergy {
  id: number;
  order_id: number;
  allergy_id: number;
  created_at: string;
  updated_at: string;
  order?: IOrder;
  allergy?: IAllergy;
} 