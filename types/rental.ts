import { GearItem } from "./gear";
import { Payment } from "./payment";

export type RentalStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PAID"
  | "PICKED_UP"
  | "RETURNED"
  | "CANCELLED";

export interface RentalItem {
  id: string;
  rentalOrderId: string;
  gearItemId: string;
  gearItem: GearItem;
  quantity: number;
  pricePerDay: number;
}

export interface RentalOrder {
  id: string;
  customerId: string;
  customer?: {
    id: string;
    name: string;
    email: string;
  };
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: RentalStatus;
  createdAt: string;
  updatedAt: string;
  items: RentalItem[];
  payment?: Payment | null;
}

export interface CreateRentalItemInput {
  gearItemId: string;
  quantity: number;
}

export interface CreateRentalInput {
  startDate: string;
  endDate: string;
  items: CreateRentalItemInput[];
}