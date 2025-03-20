import IAllergy from "./IAllergy";
import IOrderMenu from "./IOrderMenu";

export default interface IOrderMenuAllergy {
  id: number;
  order_menu_id: number;
  allergy_id: number;
  created_at: string;
  updated_at: string;
  order_menu?: IOrderMenu;
  allergy?: IAllergy;
} 