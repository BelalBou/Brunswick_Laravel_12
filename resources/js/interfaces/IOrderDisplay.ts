import { ReactNode } from "react";

export default interface IOrderDisplay {
  id: number;
  date: string;
  client: string;
  pricing: string;
  action: ReactNode;
}
